((
	refregex = /\$([a-zA-Z][a-zA-Z0-9_]*)/g,
	scope = inner => `((el,__i=0)=>{
${inner}
})`,
	cleanSigRefs = code => code.replace(refregex, "$1.v")
)=>{ elr = (el, i = 0) => {
	let o = `/*${el.tagName}*/`;
	if ("svg" == el.tagName) {
		o = '(_=>0)'
	} else if (
		el.tagName == "SCRIPT" &&
		el.getAttribute('type') &&
		el.getAttribute('type') == 'text/htmc'
	) {
		o += `${cleanSigRefs(el.innerText)};__i++`;
	} else if (el.tagName=="TEMPLATE" && el.getAttribute`for`){
		let header = el.getAttribute`for`;
		let matches = [...header.matchAll(refregex)];
		let isCmp = matches.length>0;
		o += scope(`let ctr=document.createElement('${el.getAttribute('tag')||'div'}');ctr.loaded=1;el.after(ctr);
for(let attr of el.attributes)ctr.setAttribute(attr.name,attr.value);
${isCmp?`el.L=cmp(_=>{`:'{'}dispose(ctr);ctr.innerHTML='';
for(${cleanSigRefs(header)}){
	let cl=el.content.cloneNode(1);
	let start = ctr.children.length;
	ctr.appendChild(cl);
	eval(elr(ctr,start))(ctr,start);
}${ isCmp? `},[${matches.map(match => match[1]).join`,`}]);`:'}' }`);
	} else {
		let inner = '';
		for(let attr of el.attributes) {
			if(attr.name.startsWith`run`) {
				let matches = [...attr.value.matchAll(refregex)];
				let isCmp = matches.length;
				inner += `${isCmp?`el.L=cmp(_=>{`:'{'}
${cleanSigRefs(attr.value)}
${isCmp?`},[${matches.map(match => match[1]).join`,`}]);`:'}'}\n`;
			} else if(attr.name.startsWith('on-')) {
				inner += `el.addEventListener('${attr.name.slice(3)}',e=>{${cleanSigRefs(attr.value)}});`
			}
		}
		for(; i < el.children.length; i++) {
			let child = el.children[i];
			let out = elr(child);
			if(!child.loaded && child.tagName != 'SCRIPT') {
				out = `\n${out}(el${i != null? `.children[__i++]`:''});`;
			}
			if(child.tagName == 'TEMPLATE') out += '__i++';
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
