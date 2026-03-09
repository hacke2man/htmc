let fs = require('node:fs');
let index = fs.readFileSync('public/index.html');
let testIndex = (poly, test) => {
	return `
<!doctype html>
<html>
	<head>
		<script src=/htmc${poly=='poly'?'.poly':''}.js></script>
		<script src=/tests/${test}></script>
	</head>
	<body>
		<div id=app></div>
		<script>
			app = document.getElementById('app');
			app.append(htmc(test()));
		</script>
	</body>
</html>
	`;
};
require('polka')()
	.use(require('serve-static')('./public'))
	.get('/test/**', (req,res)=>res.end(testIndex(req.params['**'], req.params['*'])))
	.get('*', (_,res)=>res.end(index))
	.listen(3000, _=>console.log(`running localhost:3000`));
