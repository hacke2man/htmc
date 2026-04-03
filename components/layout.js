let layout = _=> {
	return {
		in: [
			{style: 'display: flex; justify-content: space-between', in: [
				{ onclick: _=> page('/'), in: 'HTMC Example'},
				{style: 'display: flex', in: [
					{ onclick: _=> page('/testspage'), style: 'display: block', in: 'tests' }
				]}
			]},
			{run: el => content = el}
		],
	};
}
