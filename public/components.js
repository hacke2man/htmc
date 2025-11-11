home = _ => {
	let num = sig(1);
	let countersList = sig([counters()]);
	return { inner:[
		{ tag:'button',
			onclick: el =>
				countersList.v = [...countersList.v, counters()],
			inner:'add',
		},
		{ tag:'button',
			onclick: el => countersList.v.length > 0 ?
				countersList.v = [...countersList.v].slice(0, countersList.v.length-1):[],
			inner:'min',
		},
		{ tag:'div', inner:esub(_=>countersList.v, [countersList]) }
	]};
}

counters = _ => {
	let count = sig(0);
	let counters = sig([count]);
	return { inner: [
		{ tag:'button',
			onclick: _=> counters.v = [...counters.v, count],
			inner:'add',
		},
		{ tag:'button',
			onclick: _=> counters.v = [...counters.v].slice(0, counters.v.length-1),
			inner:'min',
		},
		{ inner: esub(_=>counters.v.map(count=>(
			{tag:'button',
				inner: esub(_=>count.v, [count]),
				onclick: e=>count.v++,
			}
		)), [counters]) },
	]};
}
