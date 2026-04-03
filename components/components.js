home = _ => {
	let num = sig(1);
	let countersList = sig([counters()]);
	countersList.sub(_=>console.log(countersList.v));
	return { in:[
		{ $:'button',
			onclick: el =>
				countersList.v = [...countersList.v, counters()],
			in:'add',
		},
		{ $:'button',
			onclick: el => countersList.v.length > 0 ?
				countersList.v = [...countersList.v].slice(0, countersList.v.length-1):[],
			in:'min',
		},
		sig(_=>({in:countersList.v}), [countersList]),
	]};
}

counters = _ => {
	let count = sig(0);
	let counters = sig([count]);
	return { in: [
		{ $:'button',
			onclick: _=> counters.v = [...counters.v, count],
			in:'add',
		},
		{ $:'button',
			onclick: _=> counters.v = [...counters.v].slice(0, counters.v.length-1),
			in:'min',
		},
		sig(_=>({in:
			counters.v.map(count=>({$: 'button',
				onclick: _=>count.v++,
				in: count,
			}))
		}), [counters]),
	]};
}
