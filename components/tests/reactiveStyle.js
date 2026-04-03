let test = _ => {
	let hidden = sig(false);
	return { in: [
		{in: 'toggle', onclick: _=> hidden.v = !hidden.v },
		{ style: sig(_=>({
			display: hidden.v? 'block':'none'
		}), [hidden]), in: 'visable' },
	]}
}
