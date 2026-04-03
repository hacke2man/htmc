function htmc(comp) {
	if (Object.prototype.toString.call(comp) === "[object Array]")
		return comp.map(function(comp) {return htmc(comp)});
	if (typeof comp == 'function') return htmc(comp());
	if (comp instanceof Sig) {
		return (function(abort, prev) {
			var sub_abort = comp.sub(function() {
				var index = prev.D.indexOf(abort);
				prev.D.splice(index, 1);
				dispose(prev);

				var el = htmc(comp.v);
				el.D.push(abort)
				prev.parentNode.replaceChild(el, prev);
				prev = el;
			});
			abort = function() {
				sub_abort();
				comp.abort();
			}
			prev = htmc(comp.v);
			prev.D.push(abort);
			return prev;
		})()
	}
	if (typeof comp !== 'object') {
		var textnode = document.createTextNode(comp);
		textnode.D = [];
		return textnode;
	}
	var el = document.createElement(comp.$ || 'div');
	el.D = [];
	for(var k in comp) {
		if (['in','run','$'].indexOf(k) > -1) continue;
		(function(v,k) {
			var assign = function(v, k) {
				if (k.indexOf('on') === 0)
					el.addEventListener(k.slice(2), function(e){v(el,e)});
				else if (typeof v == 'object')
					for (var sk in v) el[k][sk] = v[sk];
				else if (typeof v != 'string' || k in el)
					el[k] = v;
				else el.setAttribute(k, v);
			}
			if (v instanceof Sig) {
				assign(v.v, k);
				let abort = v.sub(function() {assign(v.v, k)});
				el.D.push(function(){abort()});
			} else assign(v, k)
		})(comp[k],k)
	}
	if(comp.in !== undefined) {
		var nel = htmc(comp.in);
		htmc_append(el, nel);
	}
	if(comp.run) comp.run(el);
	return el;
}

function htmc_append(el, nel) {
	if (Object.prototype.toString.call(nel) === "[object Array]") {
		for (var child in nel) append(el, nel[child]);
	} else el.appendChild(nel);
}

function dispose(el) {
	if(el.D) for (var ak in el.D) el.D[ak]()
	if('childNodes' in el)
		for (var i = 0; i < el.childNodes.length; i++)
			dispose(el.childNodes[i])
}

function Sig(v, deps){
	this.ab = [];
	this.abort = function() {
		for (i in this.ab) this.ab[i]()
	}
	if (deps) {
		this._v = v();
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
		this._v = v;
		this.up();
	},
	up: function() {
		for (var i = 0; i < this._listeners.length; i++) {
			this._listeners[i](this._v);
		}
	},
	sub: function(callback) {
		var cb = function() { callback(this._v) };
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
