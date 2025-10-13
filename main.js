fs = require('node:fs');
index = fs.readFileSync('./static/example.html').toString();
htmc = fs.readFileSync('./static/htmc.js').toString();
htmc_min = fs.readFileSync('./static/htmc.min.js').toString();
component = fs.readFileSync('./static/foo.html').toString();
require('polka')()
	.get('/htmc.js', (req,res)=>res.end(htmc))
	.get('/htmc.min.js', (req,res)=>res.end(htmc_min))
	.get('/foo.html', (req,res)=>res.end(component))
	.get('/', (req,res)=>res.end(index))
	.listen(3000, _=>console.log(`running localhost:3000`));
