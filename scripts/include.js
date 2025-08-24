// Dynamically include header and footer on every page

(function () {
	function include(selector, url, after) {
		var container = document.querySelector(selector);
		if (!container) return;
		if (location.protocol === 'file:') {
			// Fallback minimal markup when opened directly without a server
			if (selector === '#site-header') {
				container.innerHTML = '<header class="border-bottom bg-light"><div class="container py-2 d-flex justify-content-between align-items-center"><a class="navbar-brand fw-semibold" href="' + (window.location.pathname.indexOf('/tools/')!==-1?'../index.html':'index.html') + '">Multi-Tools</a><input id="global-search" class="form-control" placeholder="Search tools" style="max-width:260px"></div></header>';
				if (typeof after === 'function') after();
				return;
			}
			if (selector === '#site-footer') {
				container.innerHTML = '<footer class="border-top mt-5"><div class="container py-3 small text-muted">&copy; <span id="year"></span> Multi-Tools</div></footer>';
				if (typeof after === 'function') after();
				return;
			}
		}
		fetch(url, { cache: 'no-cache' })
			.then(function (res) { return res.text(); })
			.then(function (html) {
				container.innerHTML = html;
				if (typeof after === 'function') after();
			})
			.catch(function () { /* no-op */ });
	}

	function resolve(path) {
		var p = window.location.pathname;
		// When inside /tools/, step up one level for components
		if (p.indexOf('/tools/') !== -1 || /\/tools\//.test(p)) return '../' + path;
		return path;
	}

	include('#site-header', resolve('components/header.html'), function () {
		var y = document.getElementById('year');
		if (y) y.textContent = new Date().getFullYear();
		var globalSearch = document.getElementById('global-search');
		if (globalSearch) {
			globalSearch.addEventListener('input', function (e) {
				var evt = new CustomEvent('tools:search', { detail: e.target.value });
				document.dispatchEvent(evt);
			});
		}

		// Fix home links when inside tools/
		var isInTools = /\/tools\//.test(window.location.pathname);
		if (isInTools) {
			var homeLinks = document.querySelectorAll('[data-home-link="true"]');
			homeLinks.forEach(function(a){ a.setAttribute('href','../index.html'); });
		}
	});

	include('#site-footer', resolve('components/footer.html'));
})();


