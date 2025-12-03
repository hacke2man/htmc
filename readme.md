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

# Usage
```js
htmc("hi"); // text node: hi

htmc({inner:"hi"}); // <div>hi</div>

htmc({
	inner:[ "hi", {inner:"bye"} ]
}); // <div>hi<div>bye</div></div>

htmc({ tag: "button", // works for any element type
	onclick: () => console.log("here"), // attaches as event listener
	run: () => console.log("mounted"), // run function is ran right before htmc returns the element
});

htmc({style: {
	width: "100%",
	height: "20rem",
	fontSize: "1.2rem",
}}); // objects are assigned with Object.assign

htmc({tag: "input", type: "text", class: "txtbox" placeholder: "name"}) // all other attrs work aswell

let count = sig(0);
htmc(count); //non objects signals are treated as strings

let page = sig({inner: "home"}); // signals are interpreted as a component when used in ones place
htmc(page);

page.v = { // this will update the html element to this component
	inner: count, // the text node will be replaced whenever count is updated
	onclick: () => count.v++,
};

page.v = ["hi", "bye"]; // don't use arrays directly inside a rendered signal
page.v = {inner: ["hi", "bye"] }; // this is fine though

let hide = sig(false);
page.v = {
	hidden: hide, // works with attributes
	inner: "hi",
	onclick: () => hide.v = true,
};
page.v.hidden = false;
page.up(); // manually call up if you don't assign to v

let computed = sig(() => count.v*2, [count]); //signals can be computed from other signals if you pass a function and a array of depended signals
```

# Todo
 - [x] router extention
 - [ ] lazy loader extention
 - [ ] debug features
 - [ ] testing

# Credit
Signal Implementation
https://github.com/jsebrech/tiny-signals/
