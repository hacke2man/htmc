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
				prev.D = pushitem(prev.D, abort);
				prev.replaceWith(el);
			}
			prev = el;
			return el;
		}
		abort = comp.sub(create);
		return create();
	}
	if (typeof comp != 'object') {
		let textnode = document.createTextNode(comp);
		return textnode;
	}
	let el = document.createElement(comp.tag || 'div');
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
		if (v instanceof Sig) el.D = pushitem(el.D, v.sub(_=>assign()));
		else assign();
	}
	if(comp.inner!=undefined) {
		let nel = htmc(comp.inner, el);
		Array.isArray(nel)? el.append(...nel):el.append(nel);
	}
	if(comp.run) comp.run(el);
	return el;
}

let pushitem = (items, newitem) => items ? (items.push(newitem), items) : [newitem];

class Sig extends EventTarget {
	constructor(v) {
		super();
		this._v = v;
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
sig = _ => new Sig(_);

class Cmp extends Sig {
	constructor(f, deps) {
		super(f());
		this.ab = new AbortController();
		for(let dep of deps) if(dep instanceof Sig)
			dep.addEventListener(
				'change', _=>this.v = f(),
				{signal: this.ab.signal}
			);
	}
}
cmp = (f,deps) => new Cmp(f,deps);

dispose = el => {
	if(el.D) el.D.forEach(rm=>rm());
	if('childNodes' in el) for(let c of el.childNodes) dispose(c);
}
