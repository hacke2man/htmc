let fs = require('node:fs');
let index = fs.readFileSync('components/index.html');

let testIndex = (poly, test) => {
	return `<!doctype html>
	<html>
		<head>
			<script src=/htmc${poly=='poly'?'.poly':''}.js></script>
			<script src=/components/tests/${test}.js></script>
		</head>
		<body></body>
		<script>
			document.body.append(htmc(test()));
		</script>
	</html>`;
};

require('polka')()
	.use(require('serve-static')('./'))
	.get('/test/**', (req,res)=>res.end(testIndex(req.params['**'], req.params['*'])))
	.get('*', (_,res)=>res.end(index))
	.listen(3000, _=>console.log(`running localhost:3000`));
