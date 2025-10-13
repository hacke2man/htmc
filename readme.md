**CURRENTLY ALPHA - expect api changes**

```html
<div>
  <script type="text/htmc">
    let counter = sig(0);
  </script>
  <button
    run="el.innerHTML=$counter"
    on-click="$counter++"
  ></button>
</div>
```

# Setup
- serve htmc.js/htmc.min.js
```html
<script src="*your_route*"></script>
<script>addEventListener('DOMContentLoaded', _=>htmc('app'))</script>
<body id='app'></body>
```

# Usage
see [usage.html](static/usage.html), and [foo.html](static/foo.html)

# Run Example
```sh
git clone https://github.com/hacke2man/htmc.git
cd htmc
npm install
npm run dev
```

# Credit
Signal Implementation
https://github.com/jsebrech/tiny-signals/
