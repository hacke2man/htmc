let tests = _=> {
	return {style: {
		display: 'grid',
		width: 'fit-content',
		'grid-template-columns': '1fr 1fr',
		gap: '.3rem',
	}, inner: [
		testframe('/tests/basic.js'),
		testframe('/tests/reactiveStyle.js'),
	]};
}

let testframe = (url) => {
	let getContent = (poly, url) => {
		return `<html>
			<head>
				<script src='${poly? 'htmc.poly.js':'htmc.js'}'></script>
				<script src='${url}'></script>
			</head>
			<body>
				<div id='app'></div>
			</body>
			<script>
				let app = document.getElementById('app');
				app.append(htmc(test));
			</script>
		</html>`;
	}
	return [
		{ style: 'display:flex; flex-direction:column', inner: [
			{ tag: 'a', href: `/test/norm/${url.slice('/tests/'.length)}`,
				inner: 'norm ' + url.slice('/tests/'.length)
			},
			{ tag: 'iframe', srcdoc: getContent(false, url)},
		]},
		{ style: 'display:flex; flex-direction:column', inner: [
			{ tag: 'a', href: `/test/poly/${url.slice('/tests/'.length)}`,
				inner: 'poly ' + url.slice('/tests/'.length)
			},
			{ tag: 'iframe', srcdoc: getContent(true, url)},
		]}
	];
}

