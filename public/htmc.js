htmc = comp => {
	if (Array.isArray(comp)) return comp.map(comp => htmc(comp));
	if (typeof comp == 'function') return htmc(comp());
	if (comp instanceof Sig) {
		let abort, prev;
		let update = _=> {
			prev.D.splice(prev.D.indexOf(abort), 1);
			dispose(prev);

			let el = htmc(comp.v);
			el.D.push(abort);
			prev.replaceWith(el);
			prev = el;
		}
		let sub_abort = comp.sub(update);
		abort = _=> {
			sub_abort();
			if (comp.ab) comp.ab.abort();
		}
		prev = htmc(comp.v);
		prev.D.push(abort);
		return prev;
	}
	if (typeof comp != 'object') {
		let el = document.createTextNode(comp);
		el.D = [];
		return el;
	}
	let el = document.createElement(comp.$ || 'div');
	el.D = [];
	for(let [k, v] of Object.entries(comp)) {
		if (['in','run','$'].includes(k)) continue;
		let assign = v => {
			k.startsWith('on')?
				el.addEventListener(k.slice(2), e=>v(el,e)) :
				typeof v == 'string'?
				el.setAttribute(k, v) :
				typeof v == 'object'?
				Object.assign(el[k], v) :
				el[k] = v;
		}
		if (v instanceof Sig) {
			el.D.push(v.sub(_=>assign(v.v)));
			assign(v.v);
		} else assign(v);
	}
	if('in' in comp) {
		let nel = htmc(comp.in);
		htmc_append(el, nel);
	}
	comp.run&&comp.run(el);
	return el;
}

let htmc_append = (el, nel) => {
	if (Array.isArray(nel)) {
		for (let child of nel) htmc_append(el, child);
	} else el.append(nel);
}

class Sig extends EventTarget {
	constructor(v, deps) {
		super();
		if(deps) {
			this._v = v();
			this.ab = new AbortController();
			for(let dep of deps)
				dep.sub(_=>this.v = v(), {signal: this.ab.signal});
		} else this._v = v;
	}
	get v() { return this._v }
	set v(v) {
		this._v = v;
		this.up();
	}
	up() { this.dispatchEvent(new CustomEvent('change')); }
	sub(callback, op = {}) {
		let cb = _=>callback(this._v);
		this.addEventListener('change', cb, op);
		return _=> this.removeEventListener('change', cb);
	}
	toString() { return this._v.toString(); }
	valueOf() { return this._v; }
}
sig = (v,deps) => new Sig(v,deps);

dispose = el => {
	if(el.D) el.D.forEach(rm=>rm());
	if('childNodes' in el) for(let c of el.childNodes) dispose(c);
}
