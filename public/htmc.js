htmc = (comp) => {
	if (Array.isArray(comp)) return comp.map(comp => htmc(comp));
	if (typeof comp == 'function') return htmc(comp());
	if (comp instanceof Sig) {
		let abort, prev;
		let create = _=>{
			let el = htmc(comp.v);
			if(prev) {
				if (prev.children)
					for (let c of prev.children) dispose(c);
				prev.D.push(abort);
				prev.replaceWith(el);
			}
			prev = el;
		}
		abort = comp.sub(create);
		return create(), prev;
	}
	if (typeof comp != 'object') {
		let el = document.createTextNode(comp);
		el.D = [];
		return el;
	}
	let el = document.createElement(comp.tag || 'div');
	el.D = [];
	for(let [k, v] of Object.entries(comp)) {
		if (['inner','run'].includes(k)) continue;
		let assign = _=> {
			k.startsWith('on')?
				el.addEventListener(k.slice(2), e=>v(el,e)):
			typeof v.v == 'string'?
				el.setAttribute(k, v.v) :
			typeof v.v == 'object'?
				Object.assign(el[k], v.v) :
				el[k] = v.v
		}
		if (v instanceof Sig) el.D.push(v.sub(_=>assign()));
		else assign();
	}
	if(comp.inner!=undefined) {
		let nel = htmc(comp.inner, el);
		Array.isArray(nel)? el.append(...nel):el.append(nel);
	}
	if(comp.run) comp.run(el);
	return el;
}

class Sig extends EventTarget {
	constructor(v, deps) {
		super();
		if(deps) {
			this._v = v();
			this.ab = new AbortController();
			for(let dep of deps)
				dep.addEventListener(
					'change', _=>this.v = v(),
					{signal: this.ab.signal}
				);
		} else {
			this._v = v;
		}
	}
	get v() { return this._v }
	set v(v) {
		if(this._v === v) return;
		this._v = v;
		this.up();
	}
	up() { this.dispatchEvent(new CustomEvent('change')); }
	sub(callback) {
		this.addEventListener('change', _=>callback(this._v));
		return _ => this.removeEventListener('change', callback);
	}
	toString() { return this._v.toString(); }
	valueOf() { return this._v; }
}
sig = (v,deps) => new Sig(v,deps);

dispose = el => {
	if(el.D) el.D.forEach(rm=>rm());
	if('childNodes' in el) for(let c of el.childNodes) dispose(c);
}
