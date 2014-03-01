## Klügeres Caching via HTML5 APIs
---
### Motivation

"Cache Pinning"

<div class="datatable"></div>

| OS                | Browser            | Max Persistent Cache Size |
|-------------------|--------------------|---------------------------|
| iOS 4.3           | Mobile Safari      | 0                         |
| iOS 5.1.1         | Mobile Safari      | 0                         |
| iOS 5.1.1         | Chrome for IOS     | 200 MB+                   |
| Android 2.2       | Android Browser    | 4 MB                      |
| Android 2.3       | Android Browser    | 4 MB                      |
| Android 3.0       | Android Browser    | 20 MB                     |
| Android 4.0 – 4.1 | Chrome for Android | 85 MB                     |
| Android 4.0 – 4.1 | Android Browser    | 85 MB                     |
| Android 4.1       | Firefox Beta       | 75 MB                     |
| Blackberry OS 6   | Browser            | 25 MB                     |
| Blackberry OS 7   | Browser            | 85 MB                     |

[Quelle](http://www.guypo.com/uncategorized/mobile-browser-cache-sizes-round-2/)

---
### Motivation

![HTTP Archive Trends Total Size](images/HTTP%20Archive%20Trends%20Total%20Size.png)

[HTTP Archive Trends](http://httparchive.org/trends.php)
---
### Motivation

![HTTP Archive Image Size](images/HTTP%20Archive%20Trends%20Image%20Size.png)

[HTTP Archive Trends](http://httparchive.org/trends.php)
---
### Motivation

![HTTP Archive Cacheable Resources](images/HTTP%20Archive%20Cacheable%20Resources.png)

[HTTP Archive Trends](http://httparchive.org/trends.php)
---
### AppCache

* Eines der prominentesten neuen Features von HTML5
* Offline Speichern beliebig vieler Ressourcen
* Erlaubt es, zusammen mit Webstorage, WebSQL oder IndexedDB, eine Webanwendung offlinefähig zu machen

[Demo](demos/caching/appcache/)
---
### AppCache

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 10+ |

---
### AppCache

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 2.1+ | &#10004; | &#10004; | &#10004; | 10+ |

---
### AppCache

Leider das Enfant Terrible von HTML5:

> The Application Cache has skills we need, but if you asked him to paint your bathroom he'd somehow manage to flood your kitchen and break your TV in the process, and he wouldn't care.

[Jack Archibald](http://alistapart.com/article/application-cache-is-a-douchebag)
---
### AppCache

```html
<html manifest="offline.appcache">
```

`offline.appcache`:

```
CACHE MANIFEST
http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
assets/script/main.js
assets/style/main.css
assets/style/fonts/font.woff
assets/style/images/sprite.png
```

Die aufgelisteten Ressourcen werden alle offline gespeichert und ab dem nächsten Aufruf der referenzierenden HTML-Seite von Platte bezogen.
---
### AppCache

```html
<html manifest="offline.appcache">
```

Leider wird immer auch die referenzierende HTML-Datei offline gespeichert!

Der Browser stellt also in Zukunft immer dieselben Inhalte dar, sofern diese wie üblich im HTML stecken.

**WTF?**
---
### AppCache

Weil die HTML-Datei mitgespeichert wird, bringt es auch nichts, wenn man mit klassischen Cachebusting-Methoden Updates erzwingen will:

```html
<html manifest="offline.appcache?v=2">
```

Die Änderungen passiert online und nicht offline beim User. Bringt also nichts!
---
### AppCache

Die einzige Möglichkeit, den Browser zum Aktualisieren von Ressourcen zu bewegen, ist die Manifestdatei inhaltlich zu verändern, z.B. durch eine integrierte Versionsnummer:

```
CACHE MANIFEST
# v2
http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
assets/script/main.js
assets/style/main.css
assets/style/fonts/font.woff
assets/style/images/sprite.png
```

---
### AppCache

**Achtung:** Niemals Far-Future Cache Header für die Manifest-Datei setzen, weil man sonst keine Möglichkeit mehr hat, Dateien zu aktualisieren.

Der Besucher bliebe in der Vergangenheit gefangen.

---
### AppCache

Apropos Cache-Header: Der Application Cache ist eine zweite Cache-Layer über dem üblichen clientseitigen Cache. Daher ist es weiterhin sinnvoll, alle Ressourcen mit Far-Future Cache Headern auszustatten, so dass die Browser nur die wirklich aktualisierten Dateien beim Updaten des Manifests vom Server lädt.

---
### AppCache

```
CACHE MANIFEST
# v2
http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
assets/script/main.js
assets/style/main.css
assets/style/fonts/font.woff
assets/style/images/sprite.png
```

Der Browser checkt und verarbeitet das Manifest immer erst **nach Ende des Seitenladens**. Sprich, neue Dateien manifestieren sich erst **beim übernächsten Aufruf**.

---
### AppCache

![HTML5 AppCache Update Behavior](images/HTML5%20AppCache%20Update%20Behavior.png)
---
### AppCache

Ressourcen, die nicht im Manifest stehen, im HTML/CSS/JS aber referenziert werden, werden bei aktivem Offline-Modus nicht mehr geladen - auch dann nicht, wenn eine Onlineverbindung zu ihnen besteht. Abhilfe schafft der `NETWORK`-Eintrag:

```
CACHE MANIFEST
# v1
assets/foo.bar

NETWORK:
*
```
---
### AppCache

```
CACHE MANIFEST
# v1
assets/foo.bar

NETWORK:
*
```

Das funktioniert dummerweise nur mit der HTML-Datei selbst nicht!!! Sie ist der sogenannte "Masterindex", args...
---
### AppCache

Lösung: Ein nahezu leeres HTML Grundgerüst verwenden und die Inhalte nachladen:

* via XHR, oder
* via XHR + localStorage, oder
* via [HTML Imports](http://w3c.github.io/webcomponents/spec/imports/), oder
* via beidem (Featuredetection)
---
### AppCache + XHR

```html
<!DOCTYPE html>
<html manifest="offline.appcache">
<head></head>
<body>
    <script>(function(){
        var request = new XMLHttpRequest;
        request.open('GET', 'import.html', true);
        request.onload = function() {
            document.body.innerHTML = request.responseText;
        };
        request.send();
    }());</s​cript>
</body>
</html>
```

[Demo](demos/caching/appcache-xhr/)

---
### AppCache + XHR + localStorage

```js
(function(){
	var request = new XMLHttpRequest;
	request.open('GET', 'import.html', true);
	if(content = localStorage.getItem('import.html')) {
		document.body.innerHTML = content;
		request.onload = function() {
			localStorage.setItem('import.html', request.responseText);
		};
	} else {
		request.onload = function() {
			localStorage.setItem('import.html', request.responseText);
			document.body.innerHTML = request.responseText;
		};
	}
	request.send();
}());
```

[Demo](demos/caching/appcache-xhr-localstorage/)

---
### AppCache + HTML Imports

```html
<!DOCTYPE html>
<html manifest="offline.appcache">
<head>
    <link rel="import" href="import.html">
</head>
<body></body>
</html>
```

```html
<div id="content"><p>Hello World!</p></div>
<script>(function(){
	var importDoc = document.currentScript.ownerDocument,
		content = importDoc.querySelector('#content').innerHTML;
	if (document.readyState === 'interactive') {
		document.body.innerHTML = content;
	} else {
		document.addEventListener('DOMContentLoaded', function(){
			document.body.innerHTML = content;
		})
	}
}());</s​cript>
```

[Demo](demos/caching/appcache-imports/)
---
### AppCache + XHR + HTML Imports

```html
<!DOCTYPE html>
<html manifest="offline.appcache">
<head>
    <link rel="import" href="import.html">
</head>
<body>
    <script>(function(){
        if(!('import' in document.createElement('link'))){
			var request = new XMLHttpRequest;
			...
		}
    }());</s​cript>
</body>
</html>
```

[Demo](demos/caching/appcache-xhr-imports/)
---
### Web Components

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 2014* | &#10008; | 2014 | ? |

*= ab Chrome 31 in `about:flags` als Eintrag `Enable HTML Imports` freischaltbar

---
### Web Components

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| ? | 2014 | &#10008; | 2014 | ? |

---
### AppCache

Nachteile von AppCache:

* Änderungen erst beim übernächsten Besuch sichtbar
* Risiko einer Disparität von Frontend- und Backend-Code
* Kompletter Abbruch wenn eine im Manifest gelistete Datei nicht abrufbar ist (z.B. 404)
* Kompletter Abbruch bei Änderungen im Manifest während der Abarbeitung
* Referenzierende Datei lässt sich nicht ausklammern

---
### AppCache

Noch was? Jepp! Firefox jagt dem Benutzer Angst ein, indem er beim ersten Besuch danach fragt, ob die Seite Daten offline speichern darf:

![Firefox Sicherheitsabfrage](images/firefox-appcache.png)

Einzige Abhilfe: Serverseitiges Useragent-Sniffing :(

---
### AppCache

Weiterführende Literatur:

* [AppCache Facts](http://appcachefacts.info/)
* [Get off(line)](http://www.webdirections.org/blog/get-offline/)
* Artikel [Application Cache is a Douchebag](http://alistapart.com/article/application-cache-is-a-douchebag)
* Präsentation [Application Cache: Douchebag](https://speakerdeck.com/jaffathecake/application-cache-douchebag)
* [HTML Imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/)

---
### localStorage

Synchrone API zum Speichern von Key/Value-Paaren:

```js
localStorage.setItem('key','value');
var value = localStorage.getItem('key');

localStorage.removeItem('key');
localStorage.clear(); // Leert ihn komplett
```

Verarbeitet eigentlich nur Strings...

---
### localStorage

Kann via `JSON`-Codierung auch Arrays oder Objekte speichern:

```js
var arr = [0, 1, 2],
	obj = { 'key1': 0, 'key2': 0 };

localStorage.setItem('arr',JSON.stringify(arr));
localStorage.setItem('obj',JSON.stringify(obj));

arr = JSON.parse(localStorage.getItem('arr'));
obj = JSON.parse(localStorage.getItem('obj'));
```
---
### localStorage & JSON

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 8+ |

---
### localStorage & JSON

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | &#10004; | 9+ |

---
### localStorage

Kann via `base64`-Codierung auch Binärdaten speichern, z.B. von Bildern:

```js
var image = new Image();
image.onload = function() {
	var canvas = document.createElement('canvas');
	canvas.width = image.width;
	canvas.height = image.height;
	canvas.getContext('2d').drawImage(image, 0, 0);

	localStorage.setItem('image',canvas.toDataURL('image/jpeg'));

	var secondImage = new Image();
	secondImage.src = localStorage.getItem('image');
}
image.src = 'picture.jpg';
```
---
### Canvas

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 9+ |

---
### Canvas

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | &#10004; | 9+ |

---
## localStorage Quota

<div class="datatable"></div>

| Browser          | KB  |
|------------------|-------|
| Chrome 33        | 5.120 |
| Chrome Mobile 32 | 5.120 |
| Firefox 27       | 5.120 |
| IE 11            | 4.883 |
| Opera 19         | 5.120 |
| Mobile Safari 7  | 2.560 |
| Safari 7         | 2.560 |

[Quelle](http://www.stevesouders.com/blog/2014/02/11/measuring-localstorage-performance/)
---
### localStorage

Nicht nur nützlich fürs "Cache Pinning", sondern ideal zum Verringern von HTTP-Requests durch bedingtes Inlinen.

---
### localStorage

#### Erstbesuch

Es werden alle Dateien als `<style>`- und `<script>`-Blöcke ge-inlined
```html
<style data-id="a6g7h89f" data-modified="123456789">...</style>
```

---
#### Erstbesuch

Nach dem Seitenladen liest ein Script alle Blöcke einzeln aus

1. speichert sie im `localStorage` mit `data-id` als Key und dem Inhalt als Value
2. setzt einen Cookie mit `data-id` als Key und `data-modified` als Value
---
### localStorage

```js
document.addEventListener('DOMContentLoaded', function() {
	var items = document.querySelectorAll('style[data-id],script[data-id]');
	items = Array.prototype.slice.call(items,0);
	items.forEach(function (item) {
		var key = item.getAttribute('data-id'),
			timestamp = item.getAttribute('data-modified'),
			value = item.textContent;

		localStorage.removeItem(key);
		localStorage.setItem(key, value);
		if (localStorage.getItem(key)) {
			document.cookie = key + '=' + timestamp;
			console.log('Added/updated ' + key + ' to localStorage');
		}
	});
});
```
---
### localStorage

#### Nachfolgende Besuche

 - Existiert kein Cookie mit dem Key wird die Datei wieder ge-inlined
 - Existiert der Cookie, stimmt aber das Datum nicht mehr, wird die aktuelle Datei ge-inlined
 - Existiert der Cookie und stimmt auch das Datum, wird ein Script ausgegeben, das die Datei aus dem `localStorage` holt und ins DOM hängt
---
### localStorage

```php
foreach($files as $file) {
	$id = md5($file);
	if(!isset($_COOKIE[$id]) || $_COOKIE[$id] != filemtime($file)) {
		echo '<script data-id="'.$id.'"
		data-modified="'.filemtime($file).'">
		'.file_get_contents($file).'
		</s​cript>';
	}
	else {
		echo '<script>
			var script = document.createElement("script");
			script.textContent = localStorage.getItem("'.$id.'");
			document.body.appendChild(script);
		</s​cript>';
	}
}
```
---
### localStorage

Vorteile:

- Keine extra Requests für kritische Ressourcen
- Dennoch kein dauerhaftes Aufblähen des HTMLs
- Je mehr kleine Dateien, desto besser für spätere Updates
- Möglichkeiten für echte Delta-Updates via [Diff-Tools](https://github.com/paulgb/simplediff/)
- Kontrollierbarer als der AppCache

---
### localStorage

[Demo](demos/caching/localstorage/)
---
### localForage

Tipp: [localForage](https://github.com/mozilla/localForage) ist ein Tool von Mozilla, das die localStorage-API aufgreift und:

- mit Callbacks und/oder Promises asynchron macht
- das Speichern intern auf WebSQL, IndexedDB oder localStorage verteilt
- das Speichern von Objekten und Arrays ohne Umwandlung erlaubt

---
### Gruppenarbeit?

Lust die Demo um das Speichern von Bildern, und/oder localForage zu erweitern?