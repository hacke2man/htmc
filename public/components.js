home = _ => {
	let num = sig(1);
	let countersList = sig([counters()]);
	countersList.sub(_=>console.log(countersList.v));
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
		sig(_=>({inner:countersList.v}), [countersList]),
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
		sig(_=>({inner:
			counters.v.map(count=>({tag: 'button',
				onclick: _=>count.v++,
				inner: count,
			}))
		}), [counters]),
	]};
}
