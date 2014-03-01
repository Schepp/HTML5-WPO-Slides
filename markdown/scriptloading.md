## Scriptloading
---
### Defer
```html
<script src="independantscript.js" defer></s​cript>
```

Das `defer`-Attribut ist eine Erfindung von Microsoft und kann an `script`-Elemente angeheftet werden.

Dieses Script wird nicht mehr an Ort und Stelle ausgeführt, sondern erst wenn es heruntergeladen und das HTML-Dokument fertiggeparsed ist. **Es blockiert damit nicht mehr den HTML-Parser**.

Normalerweise blockiert der Parser, denn es könnte ja ein `document.write` im Script vorkommen. Bei `defer` wird jegliches `document.write` ignoriert.

---
### Defer
```html
<script src="independantscript.js" defer></s​cript>
```

`defer` funktioniert nur für extern referenziertes JavaScript. Inline-JavaScript wird immer an Ort und Stelle ausgeführt.

`defer` kann nicht mit dynamisch per JavaScript ins DOM eingehängten Scripten benutzt werden.

Ein in HTML mit `defer` ausgestattetes Script verzögert wie gehabt das `DOMContentLoaded`-Event und auch das globale `load`-Event.
---
### Defer

Der Browser führt alle mit `defer` markierten Scripte in der im Markup definierten Reihenfolge aus. Sie dürfen also Abhängigkeiten untereinander aufweisen:

```html
<script src="jquery.js" defer></s​cript>
<script src="jquery-plugin.js" defer></s​cript>
```

---
### Defer

Ein Mischmasch ist jedoch keine so gute Idee:

```html
<script src="jquery.js" defer></s​cript>
<script src="jquery-plugin.js"></s​cript>
```

---
### Defer

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 4+*/10+ |

*= bei IE < 10 noch hier und da <a href="https://github.com/h5bp/lazyweb-requests/issues/42">nicht ganz ideal</a>, weil die Reihenfolge "aufbricht", sobald ein Script frühzeitig anfängt, das DOM zu manipulieren.

Presto-Opera unterstützt das `defer`-Attribut nicht, Blink-Opera (15+) jedoch schon.

---
### Defer

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 3+ | &#10004; | &#10004; | &#10004; | 10+ |

Presto-Opera unterstützt das `defer`-Attribut nicht, Blink-Opera (16+) jedoch schon.
---
### Async
```html
<script src="independantscript.js" async></s​cript>
```

Das `async`-Attribut ist eine Erfindung von Mozilla und kann ebenfalls an `script`-Elemente angeheftet werden.

Dieses Script muss nicht mehr an Ort und Stelle, und auch nicht "in Reihe" ausgeführt werden, sondern kann ausgeführt werden, sobald es heruntergeladen ist.
**Es blockiert damit weder den HTML-Parser, noch anderes Javascript**.

Normalerweise werden Scripte zwar durchaus parallel geladen, dann aber in Reihe ausgeführt, da untereinander Abhängigkeiten bestehen könnten.
---
### Async
```html
<script src="independantscript.js" async></s​cript>
```

`async` funtioniert nur für extern referenziertes JavaScript. Inline-JavaScript wird immer in Reihe ausgeführt!

Ein in HTML mit `async` ausgestattetes Script verzögert nicht mehr das `DOMContentLoaded`-Event, wohl aber das globale `load`-Event.
---
### Async

Keine gute Idee:

```html
<script src="jquery.js" async></s​cript>
<script src="jquery-plugin.js" async></s​cript>
```

Da `jquery-plugin.js` sehr wahrscheinlich kleiner ist als `jquery.js` wäre es vorher runtergeladen und würde als erstes ausgeführt. Es würde Schiffbruch erleiden.
---
### Async

Besser:

```html
<script src="jquery-und-alle-jquery-plugins.js" async></s​cript>
<script src="von-jquery-vollkommen-unabhaengiges-script.js" async></s​cript>
```

Die Chancen für `async` steigen mit dem Grad, in dem wir uns von jQuery unabhängig machen (mehr zu dem Thema später).
---
### Async

Scripte werden von Haus asynchron ausgeführt, wenn Sie dynamisch ins DOM gehängt werden:

```js
(function() {
	var script = document.createElement('script');
	script.src = "file.js";
	document.body.appendChild(script);
})()
```

Firefox 3.6 und brauchte aufgrund eines Bugs die explizite Anweisung `script.async = true;`.

---
### Async

Soll ein dynamisch erzeugtes Script **explizit nicht** asynchron ausgeführt werden:

```js
(function() {
	var script = document.createElement('script');
	script.src = "file.js";
	script.async = false;
	document.body.appendChild(script);
})()
```
---
### Async

Vorsicht bei `async` und folgenden Konstruktionen:

```js
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded');
});
window.addEventListener('load', function() {
    console.log('load');
});
```

---
### Async

Besser abfragen, ob das wir das Event nicht vielleicht schon verpasst haben:

```js
if ( document.readyState === 'interactive' ) {
    console.log('DOMContentLoaded');
} else {
	document.addEventListener('DOMContentLoaded', function() {
		console.log('DOMContentLoaded');
	});
}
if ( document.readyState === 'complete' ) {
    console.log('load');
} else {
	window.addEventListener('load', function() {
		console.log('load');
	});
}
```

(oder jQuerys `$(document).ready()` & Co nutzen)
---
### Async

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 10+ |

Presto-Opera unterstützt das `async`-Attribut weder in HTML noch in dynamisch erzeugten Scripten.
Blink-Opera (15+) unterstützt es.

---
### Async

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 3+ | &#10004; | &#10004; | &#10004; | 10+ |

Presto-Opera unterstützt das `async`-Attribut weder in HTML noch in dynamisch erzeugten Scripten.
Blink-Opera (16+) unterstützt es.
---
### IE-Spezialtrick: Asynchrones Script-Parsing

Beim dynamischen Einfügen von Scripten ins DOM wird ein Script normalerweise erst in folgendem Augenblick heruntergeladen:

```js
document.body.appendChild(script);
```

IE (6+) lädt das Script allerdings schon in diesem Moment:

```js
script.src = "file.js";
```

Auf die Weise lässt sich in IE ein Script schon vorzeitig laden, so dass es bei Bedarf schneller zu Hand ist.
---
### Weiterführende Literatur

[HTML5 Rocks - Script Loading](http://www.html5rocks.com/en/tutorials/speed/script-loading/)
---
### Die Zukunft

Der geplante EcmaScript 6 Module Loader wird im Browser asynchron arbeiten (anders als z.B. in Node.js) und dabei trotzdem Modulabhängigkeiten sicherstellen, ähnlich wie es require.js & Co heute schon tun:

```js
/* mymodule.js */
export class q {
	constructor() {
		console.log('this is an es6 class!');
	}
}
```

```html
<script type="module">
	// loads the 'q' export from 'mymodule.js' in the same path as the page
	import { q } from 'mymodule';
	new q(); // -> 'this is an es6 class!';
</s​cript>
```

Siehe [ES6 Modules Polyfill](https://github.com/ModuleLoader/es6-module-loader)
---
### Die Zukunft

Die Web Components bringen ein Feature namens [HTML Imports](http://www.html5rocks.com/en/tutorials/webcomponents/imports/) mit, das ebenfalls asynchron sein, und Modulabhängigkeiten sicherstellen kann:

```html
<head>
    <link rel="import" href="flexslider.html" async>
    <link rel="import" href="fancybox.html" async>
</head>
```

```html
<!-- flexslider.html -->
<link rel="import" href="jquery.html">
<script src="js/flexslider.js"></s​cript>
```

```html
<!-- fancybox.html -->
<link rel="import" href="jquery.html">
<script src="js/jquery.fancybox.js"></s​cript>
```

```html
<!-- jquery.html -->
<script src="js/jquery.js"></s​cript>
```
