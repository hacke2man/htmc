function page(url, state = {}, nopush) {
	/^http/.test(url) && (location = url);
	nopush || history.pushState(state, null, url);

	var path = url == '/'? '/':'/404';
	url = url.split(/\/?(\?.*)?$/)[0];

	routes[url] && (path = url);
	while (path == '/404' && url != '') {
		routes[url + '/*'] && (path = url + '/*');
		url = url.split(/\/[^\/]*$/)[0];
	}

	for (let child of content.childNodes)
		dispose(child);

	content.innerHTML = '';
	content.appendChild(htmc(routes[path](state)));

	window.scrollTo(0,0);
}

addEventListener('popstate', function(e) {
	page(location.pathname, e.state, true)
})
