function page(url, state, nopush) {
	state===undefined&&(state={});
	if (url.indexOf('https') == 0) {
		location = url
		return;
	};
	if (!nopush) history.pushState(state, null, url);
	var path;
	var urlp = url.split(/\?(.*)/)[0];
	for (var route in routes) {
		if (route[route.length-1] === "*") {
			var trimroute = route.slice(0, route.length-2);
			if (urlp.indexOf(trimroute) === 0) path = route;
		} else if(route === urlp) path = route;
		if(path != undefined) break;
	}
	path = routes[path]? path:'/404';
	for (var i = 0; i < content.childNodes.length; i++)
		dispose(content.childNodes[i]);
	content.innerHTML = '';
	var elements = htmc(routes[path](state));
	if (Object.prototype.toString.call(elements) === "[object Array]")
		for (var i = 0; i < elements.length; i++)
			content.appendChild(elements[i]);
	else
		content.appendChild(elements);
	window.scrollTo(0,0);
}

addEventListener('popstate', function(e) {
	page(location.pathname, e.state, true);
})
