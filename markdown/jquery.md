## jQuery durch native Techniken ersetzen
---
### jQuery-Selector

`var el = $('selector');`

```js
var $ = document.querySelectorAll.bind(document);

var el = $('selector')[0];
```
---
### jQuery-Events

`$('selector').on('click', handleEvent);`

```js
Element.prototype.on = Element.prototype.addEventListener;

var el = $('selector')[0];
el.on('click', handleEvent);
```
---
### querySelectorAll & addEventListener

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 9+ |

Can I use [CSS Animation](http://caniuse.com/css-animation) / [CSS Transition](http://caniuse.com/css-transition) / [classList](http://caniuse.com/classlist)

---
### querySelectorAll & addEventListener

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

[Demo A](http://codepen.io/Schepp/pen/ArJqE);
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
| 3.0*/4+ | &#10004; | &#10004; | &#10004; | 10+ |

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
  this.on('transitionend', function(e) {
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

[Demo A](http://codepen.io/Schepp/pen/kvJti);
[Demo B](http://codepen.io/Schepp/pen/LcIyn);
[Demo C](http://codepen.io/Schepp/pen/uaqGx);

---
### Animations, Transitions, forEach & classList

Desktop:

| ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/safari.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| &#10004; | &#10004; | &#10004; | 10+ |

Can I use [CSS Animation](http://caniuse.com/css-animation) / [CSS Transition](http://caniuse.com/css-transition) / [classList](http://caniuse.com/classlist)

---
### Animations, Transitions & classList

Mobile:

| ![Chrome](images/browserlogos/android.png) | ![Chrome](images/browserlogos/chrome.png) | ![Safari](images/browserlogos/ios.png) | ![Firefox](images/browserlogos/firefox.png) | ![IE](images/browserlogos/ie.png) |
| ------------- | ------------- | ------------- | ------------- | ------------- |
| 3.0*/4+ | &#10004; | &#10004; | &#10004; | 10+ |

*= Android 2.x - 3.x können prinzipiell CSS Animationen, haben aber zahlreiche Bugs

Can I use [CSS Animation](http://caniuse.com/css-animation) / [CSS Transition](http://caniuse.com/css-transition) / [classList](http://caniuse.com/classlist)
