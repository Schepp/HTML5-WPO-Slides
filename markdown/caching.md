## Klügeres Caching via APIs
---
### Application Cache

* Eines der prominentesten neuen Features von HTML5
* Offline Speichern beliebig vieler Ressourcen
* Erlaubt es, zusammen mit Webstorage, WebSQL oder IndexedDB, eine Webanwendung offlinefähig zu machen
---
### Application Cache

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 10+ |

---
### Application Cache

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 2.1+ | &#10004; | &#10004; | &#10004; | 10+ |

---
### Application Cache

Leider das Enfant Terrible von HTML5:

> The Application Cache has skills we need, but if you asked him to paint your bathroom he'd somehow manage to flood your kitchen and break your TV in the process, and he wouldn't care.

[Jack Archibald](http://alistapart.com/article/application-cache-is-a-douchebag)
---
### Application Cache

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
### Application Cache

```html
<html manifest="offline.appcache">
```

Leider wird immer auch die referenzierende HTML-Datei offline gespeichert!

Der Browser stellt also in Zukunft immer dieselben Inhalte dar, sofern diese wie üblich im HTML stecken.

**WTF?**
---
### Application Cache

Weil die HTML-Datei mitgespeichert wird, bringt es auch nichts, wenn man mit klassischen Cachebusting-Methoden Updates erzwingen will:

```html
<html manifest="offline.appcache?v=2">
```

Die Änderungen passiert online und nicht offline beim User. Bringt also nichts!
---
### Application Cache

Die einzige Möglichkeit, den Browser zum aktualisieren von Ressourcen zu bewegen, ist die Manifestdatei inhaltlich zu verändern, z.B. durch eine integrierte Versionsnummer:

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
### Application Cache

**Achtung:** Niemals Far-Future Cache Header für die Manifest-Datei setzen, weil man sonst keine Möglichkeit mehr hat, Dateien zu aktualisieren.

Der Besucher bliebe in der Vergangenheit gefangen.

---
### Application Cache

```
CACHE MANIFEST
# v2
http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
assets/script/main.js
assets/style/main.css
assets/style/fonts/font.woff
assets/style/images/sprite.png
```

Der Browser checkt das Manifest immer unmittelbar nach Ende des Seitenladens. Sprich, neue Dateien manifestieren sich erst **beim übernächsten Aufruf**.

---
### Application Cache

Noch was? Jepp! Firefox jagt dem Benutzer Angst ein, indem er beim ersten Besuch danach fragt, ob die Seite Daten offline speichern darf:

![Firefox Sicherheitsabfrage](images/firefox-appcache.png)

---
### Application Cache

Weiterführende Literatur:

* [AppCache Facts](http://appcachefacts.info/)
* Artikel [Application Cache is a Douchebag](http://alistapart.com/article/application-cache-is-a-douchebag)
* Präsentation [Application Cache: Douchebag](https://speakerdeck.com/jaffathecake/application-cache-douchebag)