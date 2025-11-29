function page(url, state={}, nopush) {
	if (!nopush) history.pushState(state, null, url);
	var path;
	var [urlp] = url.split(/\?(.*)/s);
	for (var route in routes) {
		if (route[route.length-1] === "*") {
			route = route.slice(0, route.length-2);
			if (urlp.indexOf(route) === 0) path = route;
		} else if(route === urlp) path = route;
	}
	path = routes[path]? path:'/404';
	content.innerHTML = '';
	content.appendChild(htmc(routes[path](state)));
}

addEventListener('popstate', function(e) {
	page(location.pathname, e.state, true);
})
