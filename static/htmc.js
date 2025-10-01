((
	r=/\$([a-zA-Z][a-zA-Z0-9_]*)/g,
	s=(f,i,inner)=>`{
let el=__j${f}${i!=null?`.children[__i${f}++]`:''};
let __j${1-f}=el;let __i${1-f}=0;
${inner}
}`
)=>{elr=(el,f=0,i=null)=>{
	let o = `/*${el.tagName}*/`;
	if(el.tagName=="SCRIPT"&&el.getAttribute('type')&&el.getAttribute('type')=='text/htmc'){
		o+=`__i${f}++;${el.innerText.replace(r,"$1.v")};`;
	}else if(el.tagName=="TEMPLATE"){
		let c=el.getAttribute`for`;
		let m=[...c.matchAll(r)];
		let is=m.length>0;
		o+=s(f,i,`let ctr=document.createElement('div');ctr.loaded=1;el.after(ctr);__i${f}++
${is?`el.L=cmp(_=>{`:'{'}dispose(ctr);ctr.innerHTML='';
for(${c.replace(r,"$1.v")}){
	let cl=el.content.cloneNode(1);
	for(let __i0=0;__i0<cl.children.length;__i0++){
		let __c=cl.children[__i0];let __j0=__c;eval(elr(__c));
	}
	ctr.appendChild(cl);
}${is?`},[${m.map(m=>m[1]).join`,`}])`:'}'}`);
	}else{
		let inner='';
		for(let a of el.attributes)if(a.name.startsWith`run`){
			let m=[...a.value.matchAll(r)];
			let s=m.length;
			inner+=`${s?`el.L=cmp(_=>{`:'{'}
${a.value.replace(r,"$1.v")}
${s?`},[${m.map(m=>m[1]).join``}])`:'}'}\n`;
		}else if(a.name.startsWith('on-')){
			inner+=`el.addEventListener('${a.name.slice(3)}',e=>{${a.value.replace(r,"$1.v")}});`
		}
		if(el.children.length>0){
			for(let i=0;i<el.children.length;i++){
				inner+=`\n${elr(el.children[i],1-f,i)}`;
			}
		}
		o+=s(f,i,inner);
	}
	return o;
}})()
addEventListener('DOMContentLoaded',_=>{
	let el=document.body;
	let __j0=el;
	let __i0=0;
	eval(elr(el));
})
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
let get=async(u,target,props={})=>{
	let n=document.createRange()
		.createContextualFragment(await(await fetch(u)).text())
		.firstElementChild
	let __j0=n;let __i0;
	eval(`{${elr(n)}}`);
	if(target){
		if(typeof target=='string')document.getElementById(target).replaceWith(n);
		else if(typeof target=='object'){target.replaceWith(n)}
	}else document.body.appendChild(n);
}
