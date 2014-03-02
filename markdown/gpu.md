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
### Renderingablauf

<video controls src="images/Nexus%207%20Scroll%20Screencapture.mp4" preload="none" poster="images/Nexus%207%20Scroll%20Screencapture.png" width="342" height="474"></video>
---
### Vorbereitendes Rendering

Einmal erledigt bereitet der Browser diejenigen Bereiche vor, die bei einem Scrollvorgang als
nächstes in den sichtbaren Bildausschnitt rücken würden.

Wie viel er vorbereitet hängt von der freien Speicherkapazität des jeweiligen Geräts ab.
---
### Renderingablauf

