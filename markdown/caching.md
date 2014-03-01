## Klügeres Caching via APIs
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

[Guy Podjarny - Mobile Browser Cache Sizes](http://www.guypo.com/uncategorized/mobile-browser-cache-sizes-round-2/)

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

Einzige Abhilfe: Serverseitiges Useragent-Sniffing

---
### AppCache

Weiterführende Literatur:

* [AppCache Facts](http://appcachefacts.info/)
* [Get off(line)](http://www.webdirections.org/blog/get-offline/)
* Artikel [Application Cache is a Douchebag](http://alistapart.com/article/application-cache-is-a-douchebag)
* Präsentation [Application Cache: Douchebag](https://speakerdeck.com/jaffathecake/application-cache-douchebag)
* [HTML Imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/)