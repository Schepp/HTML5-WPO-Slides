## jQuery durch native Techniken ersetzen
---
### jQuery-Selector

`var el = $('selector');`

```js
var $ = document.querySelectorAll.bind(document);

var el = $('#id')[0],
	els = $('.class');

els.forEach( function(el, index) {
	el.innerHTML = 'Number ' + (index + 1);
});
```
---
### jQuery-Events

`$('selector').on('click', handleEvent);`

```js
Element.prototype.on = Element.prototype.addEventListener;

$('selector')[0].on('click', handleEvent);
```
---
### jQuery-Events

`$('selector').on('click', 'a[href="#"]', handleEvent);`

```js
Element.prototype.on = function() {
	var args = arguments;
	if ( args.length <= 2 ) {
		this.addEventListener(args[0], args[1]);
	} else {
		this.addEventListener(args[0], function(e) {
			if ( e.target.matches(args[1] ) {
				args[2](e);
			}
		});
	}
};

$('selector')[0].on('click', 'a[href="#"]', handleEvent);
```
---
### jQuery-Events

`$('selector').on('touchstart click', 'a[href="#"]', handleEvent);`

```js
Element.prototype.on = function() {
	var args = arguments,
		that = this;
	args[0].split(' ').forEach( function(eventName) {
		if ( args.length <= 2 ) {
			that.addEventListener(eventName, args[1]);
		} else {
			that.addEventListener(eventName, function(e) {
				if ( e.target.matches(args[1] ) {
					args[2](e);
				}
			});
		}
	});
};

$('selector')[0].on('touchstart click', 'a[href="#"]', handleEvent);
```
---
### querySelectorAll & addEventListener & matches

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 9+ |

element.matches()/matchesSelector() [Doku](https://developer.mozilla.org/en-US/docs/Web/API/Element.matches) & [Supporttable](http://caniuse.com/matchesselector)

---
### querySelectorAll & addEventListener & matches

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 2.2+ | &#10004; | &#10004; | &#10004; | 9+ |

---
### jQuery-AJAX

`$.getJSON('/my/url', function(data) {});`

```js
var $getJSON = function( url, callback ) {
	var request = new XMLHttpRequest;
	request.open('GET', url, true);
	request.onload = function() {
	  if ( request.status >= 200 && request.status < 400 ){
		callback(JSON.parse(request.responseText));
	  } else {
		console.log('serverside error fetching ' + url);
	  }
	};
	request.onerror = function() {
		console.log('clientside error fetching ' + url);
	};
	request.send();
}

$getJSON('/my/url', function(data) {});
```
---
### XMLHttpRequest & JSON

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 8+ |

---
### XMLHttpRequest & JSON

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 2.1+ | &#10004; | &#10004; | &#10004; | 9+ |

---
### jQuery-Klassensetzen

`$('selector').addClass('classA classB');`

```js
['add', 'remove', 'toggle'].forEach(function (mode) {
	Element.prototype[mode + 'Class'] = function (classes) {
		var that = this;
    	classes.split(' ').forEach(function (currentclass) {
			that.classList[mode](currentclass);
		});
	};
});

var el = $('selector')[0];
el.addClass('classA classB');
```

[Demo](http://codepen.io/Schepp/pen/ArJqE)
---
### forEach & classList

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 10+ |

Can I use [classList](http://caniuse.com/classlist)

---
### forEach & classList

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 3+ | &#10004; | &#10004; | &#10004; | 10+ |

*= Android 2.x - 3.x können prinzipiell CSS Animationen, haben aber zahlreiche Bugs

Can I use [classList](http://caniuse.com/classlist)
---
### jQuery-Effekte

`$(el).slideDown();`

```css
el {
	display: none;
}
.slide {
	display: block;
	transition: max-height 300ms;
	overflow: hidden;
}
.slideDown {
	max-height: 500px;
}
```

```js
Element.prototype.slideDown = function() {
  this.style.display = '';
  this.addClass('slide slideDown');
};

el.slideDown();
```
---
### jQuery-Effekte

`$(el).slideUp();`

```css
.slide {
	display: block;
	transition: max-height 300ms;
	overflow: hidden;
}
.slideUp {
	max-height: 0;
}
```

```js
Element.prototype.slideUp = function() {
  this.on('transitionEnd', function(e) {
  	e.target.style.display = 'none';
  });
  this.addClass('slide slideUp');
};
el.slideUp();
```
---
### jQuery-Effekte

`$(el).fadeIn();`

```css
el {
	display: none;
}
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}
.fadeIn {
	display: block;
	animation: fadeIn 300ms;
}
```

```js
Element.prototype.fadeIn = function() {
  this.addClass('fadeIn');
};

el.fadeIn();
```
---
### jQuery-Effekte

`$('<el/>').appendTo('body').fadeIn();`

```css
@keyframes fadeIn {
	from { opacity: 0; }
	to { opacity: 1; }
}
el {
	animation: fadeIn 300ms;
}
```

```js
var el = document.createElement('el');
el.innerHTML('Elementinhalt');
document.body.appendChild(el);
```
---
### jQuery-Effekte

`$(el).fadeOut(300, function() { $(this).remove(); });`

```css
@keyframes fadeOut {
	from { opacity: 1; }
	to { opacity: 0; }
}
.fadeOut {
	animation: fadeOut 300ms;
}
```

```js
Element.prototype.remove = function() {
	this.parentNode.removeChild(this);
};
Element.prototype.fadeOut = function() {
  this.on('animationend', function(e) {
  	e.target.remove();
  });
  this.classList.add('fadeOut');
};
el.fadeOut();
```
---
### jQuery-Effekte

[Demo A](http://codepen.io/Schepp/pen/kvJti)

[Demo B](http://codepen.io/Schepp/pen/LcIyn)

[Demo C](http://codepen.io/Schepp/pen/uaqGx)

---
### Animations & Transitions

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 10+ |

Can I use [CSS Animation](http://caniuse.com/css-animation) / [CSS Transition](http://caniuse.com/css-transition) / [classList](http://caniuse.com/classlist)

---
### Animations & Transitions

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 4+* | &#10004; | &#10004; | &#10004; | 10+ |

*= Android 2.x - 3.x können prinzipiell CSS Animationen, haben aber zahlreiche Bugs

Can I use [CSS Animation](http://caniuse.com/css-animation) / [CSS Transition](http://caniuse.com/css-transition) / [classList](http://caniuse.com/classlist)

---
### Gruppenarbeit?

Lasst uns jQuery nachbauen! z.B.:

- $('selector')
- children(), find(), each(), is()
- css() mit einer Eigenschaft, oder mit Eigenschaften-Map
- add-/remove-/toggleClass()
- fadeIn/-Out/slideDown/-Up()
- on() mit Event Delegation
- **Bonus**: Methoden arbeiten mit Arrays, $()[0] überflüssig
- **Bonus**: Es sollen $() koexisitiert mit $.getJson()

---
### Weiterführende Literatur

* [I know jQuery. Now what?](http://remysharp.com/2013/04/19/i-know-jquery-now-what/)
* [You might not need jQuery](http://youmightnotneedjquery.com/)
