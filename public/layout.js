let layout = _=> {
	return {
		inner: [
			{style: 'display: flex; justify-content: space-between', inner: [
				{ onclick: _=> page('/'), inner: 'HTMC Example'},
				{style: 'display: flex', inner: [
					{ onclick: _=> page('/testspage'), style: 'display: block', inner: 'tests' }
				]}
			]},
			{run: el => content = el}
		],
	};
}
