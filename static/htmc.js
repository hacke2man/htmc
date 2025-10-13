((
	r=/\$([a-zA-Z][a-zA-Z0-9_]*)/g,
	s=(inner)=>`((el,__i=0)=>{
${inner}
})`
)=>{elr=(el,i=0)=>{
	let o = `/*${el.tagName}*/`;
	if("svg"==el.tagName)
		o='(_=>0)'
	else if(el.tagName=="SCRIPT"&&el.getAttribute('type')&&el.getAttribute('type')=='text/htmc'){
		o+=`${el.innerText.replace(r,"$1.v")};__i++`;
	}else if(el.tagName=="TEMPLATE"&&el.getAttribute`for`){
		let c=el.getAttribute`for`;
		let m=[...c.matchAll(r)];
		let is=m.length>0;
		o+=s(`let ctr=document.createElement('${el.getAttribute('tag')||'div'}');ctr.loaded=1;el.after(ctr);
for(let attr of el.attributes)ctr.setAttribute(attr.name,attr.value);
${is?`el.L=cmp(_=>{`:'{'}dispose(ctr);ctr.innerHTML='';
for(${c.replace(r,"$1.v")}){
	let cl=el.content.cloneNode(1);
	let start = ctr.children.length;
	ctr.appendChild(cl);
	eval(elr(ctr,start))(ctr,start);
}${is?`},[${m.map(m=>m[1]).join`,`}]);`:'}'}`);
	}else{
		let inner='';
		for(let a of el.attributes)if(a.name.startsWith`run`){
			let m=[...a.value.matchAll(r)];
			let s=m.length;
			inner+=`${s?`el.L=cmp(_=>{`:'{'}
${a.value.replace(r,"$1.v")}
${s?`},[${m.map(m=>m[1]).join`,`}]);`:'}'}\n`;
		}else if(a.name.startsWith('on-')){
			inner+=`el.addEventListener('${a.name.slice(3)}',e=>{${a.value.replace(r,"$1.v")}});`
		}
		for(;i<el.children.length;i++){
			let __c=el.children[i];
			let out=elr(__c);
			if(!__c.loaded&&__c.tagName!='SCRIPT') {
				out=`\n${out}(el${i!=null?`.children[__i++]`:''});`;
			}
			if(__c.tagName=='TEMPLATE')out+='__i++';
			inner+=out
		}
		o+=s(inner);
	}
	return o;
}})()
class Sig extends EventTarget {
	#v;
	constructor(v){
		super();
		this.#v=v;
	}
	get v(){return this.#v}
	set v(v){
		if(this.#v===v)return;
		this.#v = v;
		this.up();
	}
	up(){this.dispatchEvent(new CustomEvent('change'))}
	sub(f){
		f();
		this.addEventListener('change', f);
		return _=>this.rmoveEventListener('change', f);
	}
}
class Cmp extends Sig{
	constructor (f, deps){
		super(f(...deps));
		this.ab = new AbortController();
		for(let dep of new Set([...deps]))if(dep instanceof Sig)
			dep.addEventListener('change', _=>this.v=f(...deps),{signal:this.ab.signal});
	}
}
dispose=el=>{
	el.L&&el.L.ab.abort();
	for(let c of el.children)dispose(c);
};
sig=_=>new Sig(_);
cmp=(f,deps)=>new Cmp(f,deps);
let get=async(u,props={})=>{
	let n=document.createRange()
		.createContextualFragment(await(await fetch(u)).text())
		.firstElementChild
	eval(`{${elr(n)}}`)(n);
	return n;
}
let htmc=(el,props={})=>{
	(typeof el=='string')&&(el=document.getElementById(el));
	eval(elr(el))(el);
}
