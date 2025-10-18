require('polka')()
	.use(require('serve-static')('./public'))
	.listen(3000, _=>console.log(`running localhost:3000`));
