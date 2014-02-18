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
* Das spart im Schnitt 125 ms. bei der späteren Anfrage einer Ressource von diesem Host

Siehe `chrome://histograms/DNS`
 -> Sektion `DNS.PrefetchResolution`
---
<!-- .slide: data-background="images/backgrounds/hound.jpg" data-state="inverted" -->

### DNS-Prefetching






