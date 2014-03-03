## Perfekt auf die GPU zugeschnittenes Rendering
---
### GPU? Was ist das?

Ergänzend zum Hauptprozessor, der **C**entral **P**rocessing **U**nit, gibt es die **G**raphics **P**rocessing **U**nit, den Grafikprozessor. Manchmal auch General Processing Unit genannt, weil man der GPU auch andere Dinge als nur Grafik berechnen kann, z.B. via [WebCL](http://www.khronos.org/registry/webcl/specs/latest/1.0/) ([siehe auch](http://webcl.nokiaresearch.com/)).

![GPU](images/GPU-Die.png)
---
### GPU

![GPU](images/gflops-sp-625x436.png)

[Quelle](http://www.karlrupp.net/2013/06/cpu-gpu-and-mic-hardware-characteristics-over-time/)
---
### GPU

![GPU](images/gflops-per-watt-sp-625x436.png)

[Quelle](http://www.karlrupp.net/2013/06/cpu-gpu-and-mic-hardware-characteristics-over-time/)
---
### Renderingablauf

1. CPU: Layoutberechnung zur Ermittlung der Grundfläche
2. CPU: Einteilung in 256 x 256 Pixel große Kacheln
3. GPU: Bereitet leere Fläche mit ermittelten Ausmaßen vor
4. CPU: "Paintet" alle Kacheln innerhalb des Viewports
5. BUS: Fertige Kacheln wandern zur GPU (je 256 KB)
6. GPU: Tapeziert leere Fläche mit empfangenen Kacheln
---
<video src="images/Nexus%207%20Scroll%20Screencapture.mp4" preload="none" poster="images/Nexus%207%20Scroll%20Screencapture.png" width="342" height="474" controls loop></video>

[Demo](demos/mobile-rendering-performance/examples/scrolling/bad.html)
---

![Tiles](images/tiles.png)
---
### Vorbereitendes Rendering

Einmal erledigt bereitet der Browser diejenigen Bereiche vor, die bei einem Scrollvorgang als
nächstes in den sichtbaren Bildausschnitt rücken würden.

Wie viel er vorbereitet hängt von der freien Speicherkapazität des jeweiligen Geräts ab: Die Fläche eines Full-HD Bildschirms frisst 8 x 5 Kacheln = 10 MB.
---
![GPU](images/vorrendern.png)
---
### Vorbereitendes Rendering

Geht der Speicher zur Neige, verwirft der Browser entfernt liegende Kacheln zuerst, z.B. weggescrollte.

---
![GPU](images/surfacemapping.png)

Die GPU arbeitet intern mit texturierten 3D-Flächen

---
### Scrolling

Das Scrolling übernimmt nun komplett die GPU, in dem Sie die 3D-Fläche herumschiebt.

---
<video src="images/scrolling.mp4" preload="none" poster="images/scrolling.png" width="1280" height="720" controls loop></video>

---
### Scrolling

Vorteile

* 3D-Flächen Herumschieben ist eine Spezialität der GPU - es geht blitzschnell!
* Vor allem eine mobile CPU wäre überfordert und wird komplett entlastet.

---
### Scrolling

Nachteile auf Mobilgeräten

* Während des Scrollens nimmt die GPU keine Paint-Updates entgegen (Animated GIFs bleiben z.B. stehen)
* Da die CPU außen vor bleibt, empfängt sie keinerlei `onscroll`-Events von der GPU*

Kuriosum: Fixed positionierte Animated GIFs [werden weiterhin animiert](demos/mobile-rendering-performance/examples/scrolling-with-loader/)!

*= Chrome auf Android wählt einen Mittelweg und updated zwischendurch.
---
### Scrolling

> Da die CPU außen vor bleibt, empfängt sie keinerlei `onscroll`-Events von der GPU

Bei "klebenden" Menüs schafft die neue Eigenschaft `position: sticky` Abhilfe ([vorher](demos/mobile-rendering-performance/examples/position-sticky/bad/)/[nachher](demos/mobile-rendering-performance/examples/position-sticky/good/)). Unterstützen bisher nur die [Safaris](http://caniuse.com/css-sticky).

---
### Offcanvas Menüs

![GPU](images/offcanvas-menu.gif)
---
### Offcanvas Menüs

* Verstecktes Menü **niemals** auf `display: none` stellen, sonst kann es nicht vorgerendert werden.
* Menü ausschließlich mit `transform: translateX` bewegen
* Menü ausschließlich mit `transition` oder `animation` animieren
* Menü von Anfang an mit `backface-visibility: hidden` in eine eigene Compositing Layer promoten
---
### Transform

> Menü ausschließlich mit `transform: translateX` bewegen

Durch `transform: translateX` kann es bewegt werden, [ohne für den Rest der Seite](http://codepen.io/Schepp/pen/zafdj) einen "Reflow" auszulösen.
---
### Transform

* Mit `transform` veränderte Elemente [hinterlassen ihren ursprünglichen Footprint](http://codepen.io/Schepp/pen/zafdj) in der Seite.
* Mit `transform` veränderte Elemente erzeugen einen komplett [neuen Stacking Context](http://codepen.io/Schepp/pen/dxpFj)
---
### Transform/Opacity Animationen

> * Menü ausschließlich mit `transform: translateX` bewegen
* Menü ausschließlich mit `transition` oder `animation` animieren

---
### Transform/Opacity Animationen

Startet eine CSS Animation, die auf `transform`, `opacity` oder `filter` (außer dem Blur-Filter) abzielt, löst der Browser das Element von der aktuellen Zeichenebene aus, und erzeugt in der GPU eine zweite Ebene mit dem Element. Sie wird "in eine eigene Layer promoted".

Nach der Animation werden die Ebenen wieder vereint.
---
### Transform/Opacity Animationen

Eine promotete Ebene kann einzeln sehr effizient in der GPU transformiert oder durchsichtig gemacht werden, ohne dass der Rest der Seite angefasst werden muss. Und ohne dass die CPU etwas damit zu tun hat (siehe [vorher](demos/mobile-rendering-performance/examples/position-animation/bad.html)/[nachher](demos/mobile-rendering-performance/examples/position-animation/good.html).
---
### Compositing
---
> **Compositing** (englisch für Zusammensetzung, Mischung) ist ein Begriff aus der Video- und Filmtechnik und findet in der Postproduktion eines Filmes als visueller Effekt Anwendung. Im Compositing werden zwei oder mehr voneinander getrennt aufgenommene oder erstellte Elemente zu einem Bild zusammengeführt. In der Computergrafik versteht man unter Compositing das Zusammenfügen mehrerer hintereinanderliegender Schichten eines Volumens.

[Wikipedia](http://de.wikipedia.org/wiki/Compositing)
---
### Kein aktives Compositing

![No Compositing](images/The_CSS_and_GPU-074.jpg)
---
### Aktives Compositing

![No Compositing](images/The_CSS_and_GPU-075.jpg)
---
![No Compositing](images/devtools-composited-layers.png)
---
### Compositing erzwingen

> * Menü von Anfang an mit `backface-visibility: hidden` in eine eigene Compositing Layer promoten

`backface-visibility: hidden` und `transform: translateZ(0)` zwingen ein Element immer in eine eigene Ebene.

Sinnvoll, wenn eine Layer später sowieso promoted wird.
---
### Compositing

> Eine promotete Ebene kann einzeln sehr effizient in der GPU transformiert [...] werden, [...] ohne dass die CPU etwas damit zu tun hat.

Gut bei Blockaden des UI-Threads (z.B. durch JavaScript)! (siehe [vorher](demos/mobile-rendering-performance/examples/loaders/bad.html)/[nachher](demos/mobile-rendering-performance/examples/loaders/bad.html))
---
### Compositing

> Eine promotete Ebene kann einzeln sehr effizient in der GPU transformiert [...] werden, [...] ohne dass die CPU etwas damit zu tun hat.

Auch ein gutes Mittel gegen sogenannte "Paint Storms".

Beispielseite mit vielen "Paint Storms": [thenextweb.com](http://thenextweb.com/)
---
<video src="images/paint-storm.mp4" preload="none" poster="images/paint-storm.png" width="1240" height="720" controls loop></video>

---
### Compositing

**Nachteil:** Jede promotete Layer verbraucht zusätzlichen Speicher, und zwar mindestens `Pixel x Pixel x 4 Bytes` (bei Retina 4 mal so viel)
---
### Implizite Layer Promotion

* Elemente mit `position: fixed`*
* Elemente mit `overflow-scrolling: touch`
* Elemente, die gelayerte Elemente überlappen
* `html`/Root, Video, Canvas Elemente
* iFrames

*= in Chrome nur auf HiDPI-Displays, wegen Schriftglättung
---
### Position: fixed auf Chrome

> You might wonder why we don’t automatically promote fixed position elements. The answer is: we do for high DPI screens, but we don’t for low DPI because we lose sub-pixel antialiasing on text, and that’s not something we want to by default. On high DPI screens you can’t tell, so it’s safe there.

[Paul Lewis](http://benfrain.com/improving-css-performance-fixed-position-elements/)
---
### Union of Damaged Regions

Wenn der Chrome-Browser mehrere fixed positionierte Elemente auf einer Seite antrifft, fasst er sie ohne extra Eingriff [alle zu einer Layer zusammen](http://www.html5rocks.com/en/tutorials/speed/scrolling/).

Das kann dann [sehr schlecht enden, wenn die Elemente weit auseinander stehen](http://benfrain.com/improving-css-performance-fixed-position-elements/). Explizite Layer Promotion hilft.
---
### Silver Bullet?

```css
*, *:before, *:after {
    backface-visibility: hidden;
}
```

Niemals!
---
### Reflows vermeiden

Reflows kosten richtig viel Zeit, da das gesamte Layout **neu berechnet** und **gepainted** werden muss.
---
[Diese DOM-Methoden](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html), angewendet auf die angegebenen Elemente erzeugen einen Reflow:

* Elemente: `clientHeight`, `clientLeft`, `clientTop`, `clientWidth`, `focus()`, `offsetHeight`, `offsetLeft`, `offsetParent`, `offsetTop`, `offsetWidth`, `scrollHeight`, `scrollLeft`, `scrollTop`, `scrollWidth`
* Bilder: `height`, `width`
* window: `getComputedStyle()`, `scrollBy()`, `scrollTo()`, `scrollX`, `scrollY`
---
### Reflows vermeiden

```js
// Read
var h1 = element1.clientHeight;
// Write (invalidates layout)
element1.style.height = (h1 * 2) + 'px';

// Read (triggers layout)
var h2 = element2.clientHeight;
// Write (invalidates layout)
element2.style.height = (h2 * 2) + 'px';

// Read (triggers layout)
var h3 = element3.clientHeight;
// Write (invalidates layout)
element3.style.height = (h3 * 2) + 'px';
```

Schlecht!

---
### Reflows vermeiden

```js
// Read
var h1 = element1.clientHeight;
var h2 = element2.clientHeight;
var h3 = element3.clientHeight;

// Write (invalidates layout)
element1.style.height = (h1 * 2) + 'px';
element2.style.height = (h2 * 2) + 'px';
element3.style.height = (h3 * 2) + 'px';
```

Reads und Writes batchen: Perfekt!
---
### Reflows vermeiden

```js
// Read
var h1 = element1.clientHeight;

// Write
requestAnimationFrame(function() {
  element1.style.height = (h1 * 2) + 'px';
});

// Read
var h2 = element2.clientHeight;

// Write
requestAnimationFrame(function() {
  element2.style.height = (h2 * 2) + 'px';
});
```

Writes per [requestAnimationFrame](http://www.html5rocks.com/en/tutorials/speed/animations/) in die Zukunft verlegen: <3!
---
### Reflows begrenzen

Reflow lassen sich mit Hilfe von "[Layout Boundaries](http://wilsonpage.co.uk/introducing-layout-boundaries/)" begrenzen.

Layout Boundaries sind Elemente mit unverrückbarer Größe, die eine Reflow-Welle ähnlich wie ein Deich stoppen.
---
### Layout Boundaries

**Eingebettete SVGs** bilden Layout Boundaries oder Elemente...

* deren `display`weder auf `inline`, noch auf `inline-block`stehen
* deren `height` nicht in Prozent angegeben ist
* deren `height` gesetzt, aber nicht `auto` ist
* deren `width` gesetzt, aber nicht `auto` ist
* deren `overflow` gesetzt ist (`scroll`, `auto`, `hidden`)
* die kein Kindelement einer Tabelle sind
---
### Layout Boundaries

Tool zum Highlighten von Elementen mit "Layout Boundaries"-Potential:

[Boundarizr](https://github.com/paullewis/Boundarizr/)

---
### Paint Zeiten reduzieren

Nicht zu viele CSS3-Effekte einsetzen! [Speziell in Kombination werden sie teuer](demos/mobile-rendering-performance/examples/continous-paint/).

Auch wenn es anachronistisch klingt: Im Zweifel besser Bilder verwenden.
---
### Zukunft

[Die Browserhersteller arbeiten](http://aerotwist.com/blog/bye-bye-layer-hacks/) an einer neuen CSS-Eigenschaft namens [`will-change`](http://tabatkins.github.io/specs/css-will-change/), die den Browsern signalisiert, dass eine Eigenschaft sich um Lauf des Lebenszyklus' ändern wird:

```css
html {
	will-change: scroll-position;
}
.itemlist {
	will-change: contents, scroll-position;
}
.animated {
	will-change: transform, opacity;
}
```

---
### Weiterführende Literatur

* [Jankfree](http://jankfree.org/)
* [Scrolling Performance](http://www.html5rocks.com/en/tutorials/speed/scrolling/)
* [Web Page Design with the GPU in Mind](http://www.youtube.com/watch?v=8uAYE5G1gSs&index=22&list=PLZYZ2RjeQoPi_zyxLjCdxZi5s44WtICMG)
* [A developer's guide to rendering performance](http://vimeo.com/77591536)
* [Layout Boundaries](http://wilsonpage.co.uk/introducing-layout-boundaries/)
* [How (not) to trigger a layout in WebKit](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html)
* [requestAnimationFrame](http://www.html5rocks.com/en/tutorials/speed/animations/)