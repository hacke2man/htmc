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
- copy htmc.js/htmc.min.js into your project.
- add it to your index

# Usage
see [example.html](static/example.html), and [foo.html](static/foo.html)

# Run Example
```sh
git clone https://github.com/hacke2man/htmc.git
cd htmc
pnpm install
pnpm run dev
```

# Credit
Signal Implementation
https://github.com/jsebrech/tiny-signals/
