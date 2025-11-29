**CURRENTLY ALPHA - expect api changes**

```js
let page _=> {
	let counter = sig(0);
	return { tag: 'button',
		inner: counter,
		oninput: _=>counter.v++
	};
};
```

# Setup
```html
<head>
	<script src=htmc.js></script>
	<script src=page.js></script>
</head>
<body>
	<div id=app></div>
	<script type='text/javascript'>
		let app = document.getElementById('app');
		app.append(htmc(page()));
	</script>
</body>
```

# Todo
 - [ ] router extention
 - [ ] lazy loader extention
 - [ ] debug features
 - [ ] testing

# Credit
Signal Implementation
https://github.com/jsebrech/tiny-signals/
