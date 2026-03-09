let test = _ => {
	let hidden = sig(false);
	return { inner: [
		{inner: 'toggle', onclick: _=> hidden.v = !hidden.v },
		{ style: sig(_=>({
			display: hidden.v? 'block':'none'
		}), [hidden]), inner: 'visable' },
	]}
}
