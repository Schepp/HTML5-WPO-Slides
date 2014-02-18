# HTML5 Days 2014
## Möglichkeiten und Fallstricke bei der Performance-Optimierung mit HTML5
-----
# HTML5, Stand heute
-----
## HTML5 Markup
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
| 4+ | &#10008; | &#10008; | 24+ | 11+ |

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
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js">
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
| &#10008; | 29+ | &#10008; | 24+ | 11+ |

[Testseite](http://prebrowsing.com/)
---
### Subresource

```html
<head>
	<link rel="subresource" href="veryimportant.js">
</head>
<body>
	...blah...blah...
	<script src="veryimportant.js">
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
| &#10008; | &#10004; | &#10008; | &#10008; | 11+ |
