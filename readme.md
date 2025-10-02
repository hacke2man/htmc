# CURRENTLY ALPHA - expect api changes

# Usage
copy htmc.js/htmc.min.js into repo.
```html
<script src='chosen path'></script>
<body>
	<script type='text/htmc'>
		//this is run within a function scope.
		foo = 'bar'; //you can still set globals like this
		let bar = 'foo'; //this is not a global
		let count = sig(0); //this is a signal
		console.log(count.v, $count); //accessing signal values can be done both ways
		count.sub(_=>console.log($count)); //subscribe to changes
		let baz = sig(0);
		let sum = cmp(_=>$count+$baz, [bar,baz]); //computed signals
	</script>
	<div run="el.innerText='foo'"></div>
	<!-- the $ symbol turns the code into a cmp -->
	<div run="el.innerText=$sum"></div>
	<button
		run="el.innerText=$count"
		on-click="$count+=1"
	></button>
	<!-- get replaces a id/html element with the html content at a given path -->
	<!-- replaced element is in its own scope -->
	<!-- the last obj is passed as props var -->
	<slot run="get('/foo.html',el,{bar:'baz'})"></slot>
</body>
```

# Run Example
```sh
git clone https://github.com/hacke2man/htmc.git
cd htmc
pnpm install
pnpm run dev
```
Read example index.html, component.html for demonstration

# Ideas
- parse template content once
- recommended init sequence
-

# Credit
Signal Implementation
https://github.com/jsebrech/tiny-signals/
