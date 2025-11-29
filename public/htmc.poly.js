function htmc(comp) {
	if (Object.prototype.toString.call(comp) === "[object Array]")
		return comp.map(function(comp) {return htmc(comp)});
	if (typeof comp == 'function') return htmc(comp());
	if (comp instanceof Sig) {
		return (function(abort, prev, create) {
			create = function() {
				var el = htmc(comp.v);
				if(prev) {
					if (prev.childNodes)
						for (var c in prev.childNodes)
							dispose(prev.childNodes[c]);
					prev.D.push(abort);
					prev.parentNode.replaceChild(el, prev);
				}
				prev = el;
			}
			abort = comp.sub(create);
			return create(), prev;
		})()
	}
	if (typeof comp !== 'object') {
		var textnode = document.createTextNode(comp);
		textnode.D = [];
		return textnode;
	}
	var el = document.createElement(comp.tag || 'div');
	el.D = [];
	for(var k in comp) {
		if (['inner','run'].indexOf(k) > -1) continue;
		(function(v,k) {
			var assign = function() {
				if (k.indexOf('on') === 0)
					el.addEventListener(k.slice(2), function(e){v(el,e)});
				else if (typeof v == 'object')
					for (var sk in v) el[k][sk] = v[sk];
				else if (typeof v != 'string') el[k] = v;
				else el.setAttribute(k, v);
			}
			if (v instanceof Sig) {
				var abort = v.sub(function() {assign()});
				el.D.up(function(){abort()});
			} else assign()
		})(comp[k],k)
	}
	if(comp.inner !== undefined) {
		var nel = htmc(comp.inner, el);
		if (Object.prototype.toString.call(nel) === "[object Array]") {
			for (var child of nel) el.appendChild(child);
		} else el.appendChild(nel);
	}
	if(comp.run) comp.run(el);
	return el;
}

function dispose(el) {
	if(el.D) for (var ak in el.D) el.D[ak]()
	if('childNodes' in el)
		for (var i = 0; i < el.childNodes.length; i++)
			dispose(el.childNodes[i])
}

function Sig(v, deps){
	if (deps) {
		this._v = v();
		this.ab = [];
		for (var i = 0; i < deps.length; i++) {
			var dep = deps[i];
			if (dep instanceof Sig) {
				this.ab.push(dep.sub(function() {
					this.v = v();
				}.bind(this)));
			}
		}
	} else {
		this._v = v;
	}
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
	sub: function(cb) {
		this._listeners.push(cb);
		var self = this;
		return function() {
			var index = self._listeners.indexOf(cb);
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

function sig(v, deps){return new Sig(v, deps)}
