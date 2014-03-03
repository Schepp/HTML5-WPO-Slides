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
* Menü von Anfang an mit `transform: translateZ(0)` in eine eigene Compositing Layer Promoten
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

Startet eine CSS Animation, die auf `transform` oder `opacity` abzielt, löst der Browser das Element von der aktuellen Zeichenebene aus, und erzeugt in der GPU eine zweite Ebene mit dem Element. Sie wird "in eine eigene Layer promoted". Nach der Animation werden die Ebenen wieder vereint.
---
### Transform/Opacity Animationen

Eine promotete Ebene kann einzeln sehr effizient in der GPU transformiert oder durchsichtig gemacht werden, ohne dass der Rest der Seite angefasst werden muss. Und ohne dass die CPU etwas damit zu tun hat.

Zur Darstellung werden beide Ebenen per Compositing visuell verschmolzen.
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
### Compositing erzwingen

> * Menü von Anfang an mit `transform: translateZ(0)` in eine eigene Compositing Layer Promoten

`transform: translateZ(0)` oder `backface-visibility: hidden` zwingen ein Element immer in eine eigene Ebene.

Sinnvoll, wenn eine Layer später sowieso promoted wird.
---
### Compositing

> Eine promotete Ebene kann einzeln sehr effizient in der GPU transformiert [...] werden, [...] ohne dass die COU etwas damit zu tun hat.

Gut bei Blockaden des UI-Threads (z.B. durch JavaScript)! ([vorher](demos/mobile-rendering-performance/examples/loader/bad.html)/[nachher](demos/mobile-rendering-performance/examples/loader/bad.html))
---
### Weiterführende Literatur

* [Jankfree](http://jankfree.org/)
* [Web Page Design with the GPU in Mind](http://www.youtube.com/watch?v=8uAYE5G1gSs&index=22&list=PLZYZ2RjeQoPi_zyxLjCdxZi5s44WtICMG)
* [A developer's guide to rendering performance](http://vimeo.com/77591536)