# HTML5 Days 2014
## Möglichkeiten und Fallstricke bei der Performanceoptimierung mit HTML5
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

* Im [aktuellen HTML5 Standard](http://www.whatwg.org/specs/web-apps/current-work/multipage/links.html#link-type-prefetch) definiert
* Angegebene Ressource wird bei eintretendem Leerlauf vorgeladen (und nur die)

| | Chrome | Safari | Firefox | IE
| ------------- | -------------
| prefetch | &#10008; (demnächst) | &#10008; | &#10004; | &#10004;
| next | &#10008; (demnächst) | &#10008; | &#10004; | &#10004;




