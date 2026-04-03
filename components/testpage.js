let tests = _=> {
	return {style: {
		display: 'grid',
		width: 'fit-content',
		'grid-template-columns': '1fr 1fr',
		gap: '.3rem',
	}, in: [
		testframe('/tests/basic'),
		testframe('/tests/reactiveStyle'),
	]};
}

let testframe = (url) => {
	let getContent = (poly, url) => {
		return `<html>
			<head>
				<script src='${poly? 'htmc.poly.js':'htmc.js'}'></script>
				<script src='/components/${url}.js'></script>
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
		{ style: 'display:flex; flex-direction:column', in: [
			{ $: 'a', href: `/test/norm/${url.slice('/tests/'.length)}`,
				in: 'norm ' + url.slice('/tests/'.length)
			},
			{ $: 'iframe', srcdoc: getContent(false, url)},
		]},
		{ style: 'display:flex; flex-direction:column', in: [
			{ $: 'a', href: `/test/poly/${url.slice('/tests/'.length)}`,
				in: 'poly ' + url.slice('/tests/'.length)
			},
			{ $: 'iframe', srcdoc: getContent(true, url)},
		]}
	];
}

