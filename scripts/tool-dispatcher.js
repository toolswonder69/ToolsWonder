(function(){
	'use strict';

	var manifest = window.toolsManifest || [];

	function bySlug(slug){
		for (var i=0;i<manifest.length;i++) if (manifest[i].slug===slug) return manifest[i];
		return null;
	}

	function renderRelated(current){
		var rel = manifest.filter(function(t){return t.category===current.category && t.slug!==current.slug;}).slice(0,6);
		var el = document.getElementById('related-tools');
		if (!el) return;
		el.innerHTML = rel.map(function(t){return '<div><a href="'+t.slug+'.html">'+t.title+'</a></div>';}).join('');
	}

	function renderNotFound(root){
		root.innerHTML = '<div class="alert alert-warning">Tool not found.</div>';
	}

	function renderTool(root, tool){
		if (!window.ToolImpl || typeof window.ToolImpl.render !== 'function'){
			root.innerHTML = '<div class="alert alert-info">This tool is coming soon. Please check back later.</div>';
			return;
		}
		try {
			window.ToolImpl.render(root, tool);
		} catch (err) {
			var msg = (err && err.message) ? err.message : String(err);
			root.innerHTML = '<div class="alert alert-danger">Failed to load tool: '+ msg +'</div>';
		}
	}

	function init(){
		var root = document.getElementById('tool-root');
		if (!root) return;
		var slug = root.getAttribute('data-tool-slug');
		var tool = bySlug(slug);
		if (!tool) return renderNotFound(root);
		renderRelated(tool);
		renderTool(root, tool);
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();



