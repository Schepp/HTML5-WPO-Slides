## Vorladen, Vorrendern & Nachladen

<small>(32)</small>
---
### Prefetching

```html
<link rel="next" href="./gallery.html">
<link rel="prefetch" href="./js/image-carousel.js">
<link rel="prefetch" href="./images/picture-1.jpg">
<link rel="prefetch" href="./images/picture-2.jpg">
```

* Die angegebene Ressource wird bei eintretendem Leerlauf vorgeladen
* In der Ressource verlinkte Subressourcen werden nicht beachtet (z.B. in HTML oder CSS)
* Chrome und IE11 machen bis zu 10 Requests parallel, Firefox nur einen
* Ideal zum Vorbereiten der nächsten Seite (Cache-Header nicht vergessen!)

---
### Prefetching

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004;* | &#10008; | &#10004; | 11+ |

*= Aktuell nur via `--prerender=enabled` Start-Parameter
Soll demnächst offiziell freigeschaltet werden

[Testseite](http://prebrowsing.com/)

---
### Prefetching

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 4+ | &#10008; | &#10008; | 24+ | 11+? (WP8.1) |

[Testseite](http://prebrowsing.com/)

---
### DNS-Prefetching

```html
<link rel="dns-prefetch" href="//ajax.googleapis.com">
```

* Der angegebene Hostname wird so schnell wie möglich per DNS-Abfrage aufgelöst und gecached
* Das spart auf dem Desktop im Schnitt 125 ms. bei der späteren Anfrage einer Ressource von diesem Host
* Auf mobilen Devices spart es deutlich mehr Zeit

Für durchschnittliche DNS-Zeiten, siehe `chrome://histograms/DNS`
 -> Sektion `DNS.PrefetchResolution`
---
### DNS-Prefetching

Gut zum Vorbereiten des Browsers auf externe JavaScript-Libraries:

```html
<head>
	<link rel="dns-prefetch" href="//ajax.googleapis.com">
</head>
<body>
	...blah...blah...
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></s​cript>
</body>
```

---
### DNS-Prefetching

Hilfreich bei externen Webfonts, sofern diese erst im Stylesheet referenziert werden:

```html
<head>
	<link rel="stylesheet" href="styles.css">
	<link rel="dns-prefetch" href="//fonts.googleapis.com">
</head>
```

```css
@import url(//fonts.googleapis.com/css?family=Open+Sans);
```

(Noch besser ist es, Webfonts gar nicht via CSS zu importieren)
---
### DNS-Prefetching

Hilfreich bei weiterleitungen:

```html
<link rel="dns-prefetch" href="//mobil.zeit.de">
```

http://www.zeit.de/index -> Weiterleitung -> http://mobil.zeit.de/index

(Noch besser ist es, auf Weiterleitungen zu verzichten)
---
### DNS-Prefetching

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10008; | &#10004; | 11+ |

[Testseite](http://prebrowsing.com/)

---
### DNS-Prefetching

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10008; | 29+ | &#10008; | 24+ | 11+? (WP8.1) |

[Testseite](http://prebrowsing.com/)
---
### Subresource

```html
<head>
	<link rel="subresource" href="veryimportant.js">
</head>
<body>
	...blah...blah...
	<script src="veryimportant.js"></s​cript>
</body>
```

* Die angegebene Ressource wird früh beim Preparser registriert
* Der Preparser kann sie vorladen, abhängig von ihrer vermuteten Rolle im "Critical Path"
* Erlaubt den Spagat aus "JavaScript nicht-blockierend im Fuß" + frühes Signalisieren an den Preparser
---
### Subresource

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10008; | &#10008; | 11+ |

---
### Subresource

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10008; | &#10004; | &#10008; | &#10008; | 11+? (WP8.1) |
---
### Prerender

```html
<link rel="prerender" href="probable-next-page.html">
```

* Kann in jeder Seite nur einmal verwendet werden
* Öffnet eine unsichtbare Browser-Instanz und rendert die angegebene Seite darin
* Surft der Besucher dann zu dieser Seite weiter, ist sie sofort da

---
### Prerender

<a href="https://salzundbrot.com">![Prerender Example](images/prerender-example.png)</a>

---
### Prerender

Aktives Prerender wird im Chrome Task Manager (Shift + Esc) angezeigt:

![Chrome](images/prerender.png)
---
### Prerender

Folgende Bedingungen müssen erfüllt sein:

* Der Browser hält gerade keine andere Seite via "prerender" vor
* Die Ziel-URL fordert nicht zum Download auf
* Die Ziel-URL erzeugt keine `alerts` oder neue Fenster
* Die Ziel-URL ist nicht passwortgeschützt (HTTP Auth)
* Es befinden sich weder HTML5 Video/Audio noch Flash in der zu rendernden Seite
* Der Browser befindet sich nicht im Inkognito-Modus
* Die Developer Tools sind **nicht** geöffnet
---
### Prerender

Achtung beim Zählen von Seitenaufrufen!

* Am besten nicht per Bild, sondern per JavaScript
* Vor dem Tracken die **Page Visibility API** befragen
* Falls die Seite geprerendert wird, auf einen Sichtbarkeitswechsel horchen:

```js
if (document.visibilityState == 'prerender') {
  document.addEventListener('visibilitychange', handleVisibilityChange, false);
}
```

Wird von Google Analytics & Co schon lange beachtet
---
### Prerender

Achtung bei zeitbasierten JavaScript-Methoden!

* `requestAnimationFrame` statt `setTimeout` oder `setInterval`
* CSS-basierte Animationen statt JavsScript-basierte

Diese Techniken werden in Hintergrund-Tabs pausiert und fressen dann keine Ressourcen.
---
### Prerender

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10008; | &#10008; | 11+ |

---
### Prerender

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10008; | &#10008; | &#10008; | &#10008; | 11+? (WP8.1) |

Bei Mobilgeräten gibt es den Interessenskonflikt, dass man gleichzeitig den Datenverbrauch gering halten möchte. Dementsprechend bleibt `prerender` in Chrome abgeschaltet.
---
### HTTP Header

Alle `<link>`-Anweisungen sollen sich zukünftig auch in HTTP-Header verlagern lassen:

```
HTTP/1.1 200 OK
Date: Thu, 26 Jul 2012 22:27:21 GMT
Server: Apache
Content-Location: foo.html
Vary: negotiate,Accept-Encoding
Last-Modified: Thu, 26 Jul 2012 20:55:56 GMT
Accept-Ranges: bytes
Content-Length: 675
Expires: Thu, 02 Aug 2012 22:27:21 GMT
Link: <js/nextpage.js>; rel=prefetch
Link: <js/logic.js>; rel=subresource
Content-Type: text/html; charset=utf-8
```

Wird aktuell nur von Firefox unterstützt.

---
### Lazyload

```html
<head>
     <link rel="stylesheet" src="styles.css">
     <link rel="stylesheet" src="animations.css" lazyload>
 </head>
 <body>
    <img src="logo.png">
    <img src="header.png">
    <img src="additionalImages1.png" lazyload>
    <img src="additionalImages2.png" lazyload>
 </body>
```

* Eine mit `lazyload` ausgezeichnete Ressource wird im Ladevorgang hinten angestellt
* Eine mit `lazyload` ausgezeichnete Ressource blockiert nicht mehr das globale `load`-Event
---
### Lazyload

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10008; | &#10008; | &#10008; | 11+ |

---
### Lazyload

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10008; | &#10008; | &#10008; | &#10008; | 11+? (WP8.1) |
---
### Postpone

```html
<img src="image.png" postpone>
```

Eine mit `postpone` ausgezeichnete Ressource wird erst geladen, sobald sie sichtbar wird:

* Sei es durch explizites Einblenden (z.B. via `display` != `none`) im Sichtbereich
* Oder durch ein in-den-Sichtbereich-Scrollen

Eine mit `postpone` ausgezeichnete Ressource blockiert ebenfalls nicht mehr das globale `load`-Event
---
### Postpone

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10008; | &#10008; | &#10008; | &#10008; |

---
### Postpone

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10008; | &#10008; | &#10008; | &#10008; | &#10008; |
---
### Lazyload & Postpone

`lazyload` und `postpone` können an folgende Element-Typen angeheftet werden:

* img
* audio
* video
* script
* link
* embed
* iframe
* object
---
### Lazyload & Postpone

* `lazyload`- und `postpone`-behaftete Elemente blockieren das globale `load`-Event nicht.
* Sind alle mit `lazyload` ausgezeichneten Elemente geladen, wird ein globales `lazyload`-Event gefeuert
* `lazyload`- und `postpone`-behaftete Elemente feuern nach wie vor individuelle, eigene `load`-Events
---
### XHR zum Vorladen verwenden?

Nope! XHR-Calls sollten nicht für das Vorladen kritischer Ressourcen genutzt werden, da sie eine [deutlich geringere Priorität genießen](https://docs.google.com/presentation/d/18zlAdKAxnc51y_kj-6sWLmnjl6TLnaru_WH0LJTjP-o/present#slide=id.g11c7a3308_2_0) als via `<link>` deklarierte Ressourcen.
---
### Die Zukunft

Für die nahe Zukunft sind folgende zusätzliche Link-Anweisungen geplant:

* `<link rel="preconnect">` öffnet frühzeitig eine TCP-Verbindung zu dem angegebenen Host, um den sogenannten [TCP-Slow-Start](http://www.igvita.com/2011/10/20/faster-web-vs-tcp-slow-start/) zu verstecken.
* `<link rel="preload">` ist eine Kombination aus subresource & prefetch mit "content awareness".

Siehe Diskussion auf [lists.w3.org](http://lists.w3.org/Archives/Public/public-web-perf/2013Nov/0083.html)
---
### Die Zukunft

Der geplante EcmaScript 6 Module Loader wird dem Browser möglicherweise ebenfalls Hinweise bzgl. zu ladender JavaScript-Module geben:

```html
<script type="module">
	// loads the 'q' export from 'mymodule.js' in the same path as the page
	import { q } from 'mymodule';
</s​cript>
```

Siehe [ES6 Modules Polyfill](https://github.com/ModuleLoader/es6-module-loader)