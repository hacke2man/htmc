function htmc(comp, parent) {
	if (Object.prototype.toString.call(comp) === "[object Array]")
		return comp.map(function(comp) {return htmc(comp, parent)});
	if (typeof comp == 'function') return comp(parent);
	if (['string','number'].indexOf(typeof comp)!=-1) {
		var textnode = document.createTextNode(comp);
		parent.appendChild(textnode);
		return textnode;
	}
	var el = document.createElement(comp.tag || 'div');
	for(var k in comp) {
		if (['inner','run'].indexOf(k) > -1) continue;
		(function(v,k) {
			if (k.indexOf('on') === 0) {
				el.addEventListener(k.slice(2), function(e){v(el,e)});
			} else if (v instanceof Sig) {
				var abort = v.sub(_=>{
					if (typeof v.v == 'string') {
						el.setAttribute(k,v.v)
					} else if (typeof v.v == 'object') {
						for (var sk in v) el[k][sk] = v[sk];
					} else {
						el[k] = v.v
					}
				});
				el.D = pushitem(el.D, function(){abort()});
			} else if (typeof v == 'object') {
				for (var sk in v) el[k][sk] = v[sk];
			} else if (typeof v != 'string') {
				el[k] = v;
			} else {
				el.setAttribute(k, v);
			}
		})(comp[k],k)
	}
	parent.appendChild(el);
	if(comp.inner) htmc(comp.inner, el);
	if(comp.run) comp.run(el);
	return el;
}

function pushitem(items, newitem) {
	return items ? items.push(newitem) : [newitem];
}

function sub(callback, deps) {
	return function(el) {
		var computed = cmp(function() {
			for (var i = 0; i < el.childNodes.length; i++) dispose(el.childNodes[i]);
			el.innerHTML = '';
			htmc(callback(el), el);
		}, deps);
		el.D = pushitem(el.D, function(){return computed.abort()});
	}
}

function dispose(el) {
	if(el.D) for (var ak in el.D) el.D[ak]()
	if('childNodes' in el)
		for (var i = 0; i < el.childNodes.length; i++)
			dispose(el.childNodes[i])
}

function Sig(v){
	this._v = v;
	this._listeners = [];
}

Sig.prototype = {
	get v() { return this._v; },
	set v(v) {
		if (this._v === v) return;
		this._v = v;
		this.up();
	},
	up: function() {
		for (var i = 0; i < this._listeners.length; i++) {
			this._listeners[i](this._v);
		}
	},
	sub: function(callback) {
		callback(this._v);
		this._listeners.push(callback);
		var self = this;
		return function() {
			var index = self._listeners.indexOf(callback);
			if (index > -1) self._listeners.splice(index, 1);
		};
	},
	toString: function() {
		return this._v.toString();
	},
	valueOf: function() {
		return this._v;
	}
};

function Cmp(f, deps) {
	Sig.call(this, f());
	this.ab = [];
	var self = this;
	for (var i = 0; i < deps.length; i++) {
		var dep = deps[i];
		if (dep instanceof Sig) {
			this.ab.push(dep.sub(function() {
				self.v = f();
			}));
		}
	}
}

Cmp.prototype = Object.create(Sig.prototype);
Cmp.prototype.constructor = Cmp;
Cmp.prototype.abort = function() {
	for (var i = 0; i < this.ab.length; i++) {
		if (typeof this.ab[i] === 'function') this.ab[i]();
	}
};

function sig(v){return new Sig(v);}
function cmp(v, deps){return new Cmp(v, deps);}
