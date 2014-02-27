## jQuery durch native Techniken ersetzen
---
### Effekte

```js
$(el).fadeIn();
```
=
```css
@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

.fadeIn {
	display: block;
	animation: fadeIn 300ms;
}
```
```js
el.classList.add('fadeIn');
```