((
	sigregex = /\$([a-zA-Z][a-zA-Z0-9_]*)/g,
	sigScope = (
		code,
		matches = [...code.matchAll(sigregex)],
		isCmp = matches.length > 0,
	) => `${isCmp? `el.L=cmp(_=>{`:''}
${code}
${isCmp? `},[${matches.map(match => match[1]).join`,`}]);` : ''}`,
	scope = code => `((el,__i=0)=>{
${cleanSigRefs(code)}
})`,
	cleanSigRefs = code => code.replace(sigregex, "$1.v")
)=>{ elr = (el, i = 0) => {
	let name = el.tagName;
	let o = `/*${name}*/`;
	if ("svg" == name) {
		o = '(_=>0)'
	} else if (
		name == "SCRIPT" &&
		el.getAttribute`type` &&
		el.getAttribute`type` == 'text/htmc'
	) {
		o += `${cleanSigRefs(el.innerText)};__i++`;
	} else if(name=="TEMPLATE" && el.getAttribute`for`) {
		let header = el.getAttribute`for`;
		o += scope(`let ctr=document.createElement('${el.getAttribute`tag`||'div'}');ctr.loaded=1;el.after(ctr);
for(let attr of el.attributes)ctr.setAttribute(attr.name,attr.value);`
		+sigScope(`dispose(ctr);ctr.innerHTML='';
for(${cleanSigRefs(header)}){
	let cl=el.content.cloneNode(1);
	let start = ctr.children.length;
	ctr.appendChild(cl);
	eval(elr(ctr,start))(ctr,start);
}`));
	} else {
		let inner = '';
		for(let attr of el.attributes) {
			if(attr.name.startsWith`run`) {
				inner += cleanSigRefs(sigScope(attr.value))+';'
			} else if(attr.name.startsWith`on-`) {
				inner += `el.addEventListener('${attr.name.slice(3)}',e=>{${cleanSigRefs(attr.value)}});`
			}
		}
		for(; i < el.children.length; i++) {
			let child = el.children[i];
			let out = elr(child);
			let childName = child.tagName;
			if(!child.loaded && childName != 'SCRIPT') {
				out = `\n${out}(el${i != null? `.children[__i++]`:''});`;
			}
			if(childName == 'TEMPLATE') out += '__i++';
			inner += out
		}
		o += scope(inner);
	}
	return o;
}})()

class Sig extends EventTarget {
	#v;
	constructor(v) {
		super();
		this.#v = v;
	}
	get v() {
		return this.#v
	}
	set v(v) {
		if(this.#v === v) return;
		this.#v = v;
		this.up();
	}
	up() {
		this.dispatchEvent(new CustomEvent('change'))
	}
	sub(callback) {
		callback();
		this.addEventListener('change', callback);
		return _ => this.rmoveEventListener('change', callback);
	}
}

class Cmp extends Sig {
	constructor(f, deps) {
		super(f(...deps));
		this.ab = new AbortController();
		for(let dep of new Set([...deps])) {
			if(dep instanceof Sig) {
				dep.addEventListener(
					'change',
					_=>this.v = f(...deps),
					{signal: this.ab.signal}
				);
			}
		}
	}
}

dispose = el => {
	if(el.L) el.L.ab.abort();
	for(let c of el.children) dispose(c);
}

sig = _ => new Sig(_);
cmp = (f,deps) => new Cmp(f,deps);
let htmc = (el, props={}) => {
	if(typeof el == 'string') el = document.getElementById(el);
	eval(elr(el))(el);
}
