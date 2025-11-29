let fs = require('node:fs');
let index = fs.readFileSync('public/index.html');
require('polka')()
	.use(require('serve-static')('./public'))
	.get('*', (_,res)=>res.end(index))
	.listen(3000, _=>console.log(`running localhost:3000`));
