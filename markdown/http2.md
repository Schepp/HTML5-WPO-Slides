## SPDY aka HTTP/2

<small>(17)</small>
---
### Eigenschaften von SPDY

* Für alle Webtechnologien vollkommen transparent
* Baut nur eine Verbindung zum Server auf
* Multiplexed alle Dateitransfers durch die eine Verbindung (ähnlich wie MHTML)
* Server und Client steuern, was wann durch die Verbindung geht
* Header Kompression und Senden von Header-Diffs
* Ermöglicht proaktives serverseitiges Pushing
* Abbrüche zwischendrin sind möglich
* Sendet Binärdaten: Kompakter & weniger fehleranfällig

---
### Prioritized Streams

Der Client kann bestimmte Ressourcen mit höherer Priorität anfordern

---
### Header Kompression

> Google observed an ~88% reduction in the size of request headers and an ~85% reduction in the size of response headers after enabling compression. This amounted to a saving of between 45 and 1142 ms in the overall page load time.

[Quelle](http://blog.teamtreehouse.com/making-the-web-faster-with-spdy)
---
### Encryption

Die Browser supporten nur verschlüsseltes SPDY:

* um Proxies davon abzuhalten, in den Datenstrom einzugreifen
* um das Sicherheitslevel im Netz zu erhöhen (flankierend zu [CSP](http://www.html5rocks.com/en/tutorials/security/content-security-policy/) & Co)

---
### Aushandlung via HTTPS

Läuft vollautomatisch!

---
### Aushandlung via HTTP
```
GET /page HTTP/1.1
Host: server.example.com
Connection: Upgrade, HTTP2-Settings
Upgrade: HTTP/2.0
HTTP2-Settings: (SETTINGS payload in Base64)
```
```
HTTP/1.1 200 OK 3
Content-length: 243
Content-type: text/html
(... HTTP 1.1 response ...)
```
```
HTTP/1.1 101 Switching Protocols 4
Connection: Upgrade
Upgrade: HTTP/2.0
(... HTTP 2.0 response ...)
```
[Quelle](http://chimera.labs.oreilly.com/books/1230000000545/ch12.html#HTTP2_UPGRADE)
---
### SPDY Push

<iframe width="420" height="315" src="//www.youtube.com/embed/4Ai_rrhM8gA" frameborder="0" allowfullscreen></iframe>
---
### Hinfällige Konzepte

* Image Spriting
* Concatenation
* Inline Resources
* Domain Sharding

---
### Serverside
> SPDY clients consume one worker instead of six

[Quelle](http://www.neotys.com/blog/performance-of-spdy-enabled-web-servers/)
---
### Serverside

|                                                         | HTTP                                     | HTTPS                                    |SPDY                                     |
|---------------------------------------------------------|------------------------------------------|------------------------------------------|-----------------------------------------|
| Maximum pages/s                                         | 16.3 pages/s at 120 users                | 15.9 pages/s at 120 users                | 98 pages/s at 777 users                 |
| Page response time at 100 users                         | 1.1s                                     | 1.3s                                     | 1.1s                                    |
| Page response time at 120 users                         | 1.4 s                                    | 1.5s                                     | 1.1s                                    |
| Page response time at 200 users                         | 7.1s                                     | 7.8s                                     | 1.1s                                    |
| Page response time at 777 users                         | 70.2s                                    | 72s                                      | 2.7s                                    |
| First error                                             | 405 Users                                | 225 Users                                | 884 Users                               |

[Quelle](http://www.neotys.com/blog/performance-of-spdy-enabled-web-servers/)
---
### CPU-Auslastung

![CPU Idle Times](images/spdy-linu-cpu-idle)

[Quelle](http://www.neotys.com/blog/performance-of-spdy-enabled-web-servers/)
### Speicherverbrauch

| System Memory | 01:00    | 02:00    | Difference = Consumed Memory |
|---------------|----------|----------|------------------------------|
| HTTP          | 3,357 MB | 3,416 MB | 59 MB                        |
| HTTPS         | 3,500 MB | 3,579 MB | 79 MB                        |
| SPDY          | 3,607 MB | 3,631 MB | 24 MB                        |

[Quelle](http://www.neotys.com/blog/performance-of-spdy-enabled-web-servers/)
---
### SPDY

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10008; | &#10004; | 11+* |

*= nur IE11 auf Windows 8+

[Can I Use](http://caniuse.com/spdy)
---
### SPDY

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 3+ | 33+ | &#10008; | 24+ | 11+? (WP8.1) |

[Can I Use](http://caniuse.com/spdy)
---
### SPDY

Serverunterstützung

* [mod_spdy](https://developers.google.com/speed/spdy/mod_spdy/) für Apache
* [ngx_http_spdy_module](http://nginx.org/en/docs/http/ngx_http_spdy_module.html) für NGINX
* [Eingebautes SPDY](http://wiki.eclipse.org/Jetty/Feature/SPDY) in Jetty

---
### Seiten, die SPDY nutzen

* Google
* Facebook
* WordPress.com

---
### Zukunft

* [HTTP/3](http://www.mnot.net/blog/2014/01/30/http2_expectations) mit weiteren Features wie z.B. DNS-Push
* [QUIC](http://blog.chromium.org/2013/06/experimenting-with-quic.html)

---
### Weiterführende Literatur

* [High Performance Networking](http://chimera.labs.oreilly.com/books/1230000000545/ch12.html#HTTP2_UPGRADE)
* [Making The Web Faster With SPDY](http://blog.teamtreehouse.com/making-the-web-faster-with-spdy)
* [SPDYCheck.org](http://spdycheck.org/)
* [Evaluating the Performance of SPDY-enabled Web Servers](http://www.neotys.com/blog/performance-of-spdy-enabled-web-servers/)