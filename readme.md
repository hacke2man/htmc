**CURRENTLY ALPHA - expect api changes**

```js
let page _=> {
	let counter = sig(0);
	return { tag: 'button',
		inner: sub(_=>counter.v, [counter]),
		oninput: _=>counter.v++
	};
};
```

# Run Example
```sh
git clone https://github.com/hacke2man/htmc.git
cd htmc
npm install
npm run dev
```

# Todo
 - [ ] testing
 - [ ] debug features

# Credit
Signal Implementation
https://github.com/jsebrech/tiny-signals/
