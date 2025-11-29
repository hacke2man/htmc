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
	<script src='text/javascript'>
		let app = document.getElementById('app');
		app.append(htmc(page()));
	</script>
</head>
<body>
	<div id=app></div>
</body>
```

# Todo
 - [ ] testing
 - [ ] debug features

# Credit
Signal Implementation
https://github.com/jsebrech/tiny-signals/
