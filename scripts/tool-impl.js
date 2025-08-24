(function(){
	'use strict';

	function el(tag, attrs, children){
		var e = document.createElement(tag);
		if (attrs) Object.keys(attrs).forEach(function(k){
			if (k === 'class') e.className = attrs[k];
			else if (k === 'text') e.textContent = attrs[k];
			else e.setAttribute(k, attrs[k]);
		});
		(children||[]).forEach(function(c){ if(typeof c==='string'){e.appendChild(document.createTextNode(c));} else if(c){ e.appendChild(c); }});
		return e;
	}

	function mount(root, content){
		root.innerHTML = '';
		root.appendChild(content);
	}

	// Helpers used by multiple tools
	function copyButton(getText){
		var b = el('button', { class: 'btn btn-outline-secondary btn-sm', type: 'button', text: 'Copy' });
		b.addEventListener('click', function(){
			if (navigator.clipboard) {
				navigator.clipboard.writeText(getText()).then(function(){
					b.textContent = 'Copied!';
					setTimeout(function(){ b.textContent = 'Copy'; }, 1200);
				});
			}
		});
		return b;
	}

	function download(filename, content){
		var blob = new Blob([content], {type:'text/plain;charset=utf-8'});
		var url = URL.createObjectURL(blob);
		var a = document.createElement('a');
		a.href = url; a.download = filename; a.click();
		setTimeout(function(){ URL.revokeObjectURL(url); }, 800);
	}

	function readFileAsDataURL(file, cb){
		var fr = new FileReader();
		fr.onload = function(){ cb(null, fr.result); };
		fr.onerror = function(){ cb(new Error('Failed to read file')); };
		fr.readAsDataURL(file);
	}

	function readImage(file, cb){
		readFileAsDataURL(file, function(err, url){
			if (err) return cb(err);
			var img = new Image();
			img.onload = function(){ cb(null, img); };
			img.onerror = function(){ cb(new Error('Invalid image')); };
			img.src = url;
		});
	}

	function renderWordCounter(root){
		var ta = el('textarea', { class: 'form-control', rows: '8', placeholder: 'Type or paste text here...' });
		var stats = el('div', { class: 'mt-3 row g-3' });
		var items = [
			{label:'Words', id:'words'},
			{label:'Characters', id:'chars'},
			{label:'Characters (no spaces)', id:'chars-ns'},
			{label:'Sentences', id:'sentences'}
		];
		items.forEach(function(it){
			var col = el('div', { class: 'col-6 col-md-3' }, [
				el('div', { class: 'card text-center' }, [
					el('div', { class: 'card-body' }, [
						el('div', { class: 'small text-muted' , text: it.label }),
						el('div', { class: 'fs-5 fw-semibold', id: it.id }, ['0'])
					])
				])
			]);
			stats.appendChild(col);
		});
		function update(){
			var text = ta.value || '';
			var words = (text.trim().match(/\b\w+\b/g) || []).length;
			var chars = text.length;
			var charsNs = text.replace(/\s/g,'').length;
			var sentences = (text.match(/([.!?]+)(\s|$)/g) || []).length;
			document.getElementById('words').textContent = String(words);
			document.getElementById('chars').textContent = String(chars);
			document.getElementById('chars-ns').textContent = String(charsNs);
			document.getElementById('sentences').textContent = String(sentences);
		}
		ta.addEventListener('input', update);
		var layout = el('div', {}, [ ta, stats ]);
		mount(root, layout);
	}

	function renderCaseConverter(root){
		var ta = el('textarea', { class: 'form-control', rows: '8', placeholder: 'Type or paste text here...' });
		var btns = el('div', { class: 'mt-3 d-flex flex-wrap gap-2' });
		var variants = [
			['UPPERCASE', function(s){return s.toUpperCase();}],
			['lowercase', function(s){return s.toLowerCase();}],
			['Title Case', function(s){return s.toLowerCase().replace(/\b\w/g, function(m){return m.toUpperCase();});}],
			['Sentence case', function(s){return s.toLowerCase().replace(/(^|[.!?]\s+)([a-z])/g, function(a,b,c){return b + c.toUpperCase();});}]
		];
		variants.forEach(function(v){
			var b = el('button', { class: 'btn btn-outline-primary btn-sm' , type:'button', text: v[0]});
			b.addEventListener('click', function(){ ta.value = v[1](ta.value||''); ta.dispatchEvent(new Event('input')); });
			btns.appendChild(b);
		});
		mount(root, el('div', {}, [ ta, btns ]));
	}

	function renderPercentageCalculator(root){
		var a = el('input', { class: 'form-control', type: 'number', placeholder: 'Value' });
		var b = el('input', { class: 'form-control', type: 'number', placeholder: 'Percent %' });
		var out = el('div', { class: 'fs-5 fw-semibold mt-3', text: 'Result: 0' });
		function calc(){
			var va = parseFloat(a.value||'0');
			var vb = parseFloat(b.value||'0');
			var r = (va * vb) / 100;
			out.textContent = 'Result: ' + (isFinite(r) ? r.toString() : '0');
		}
		[a,b].forEach(function(i){ i.addEventListener('input', calc); });
		mount(root, el('div', { class: 'row g-2' }, [
			el('div', { class: 'col-12 col-md-6' }, [a]),
			el('div', { class: 'col-12 col-md-6' }, [b]),
			el('div', { class: 'col-12' }, [out])
		]));
	}

	function renderTemperatureConverter(root){
		var c = el('input', { class: 'form-control', type: 'number', placeholder: 'Celsius' });
		var f = el('input', { class: 'form-control', type: 'number', placeholder: 'Fahrenheit' });
		function link(){
			var active = document.activeElement === c ? 'c' : (document.activeElement === f ? 'f' : null);
			if(active==='c'){
				var v = parseFloat(c.value||'');
				if (!isNaN(v)) f.value = (v * 9/5 + 32).toFixed(2);
			} else if(active==='f'){
				var v2 = parseFloat(f.value||'');
				if (!isNaN(v2)) c.value = ((v2 - 32) * 5/9).toFixed(2);
			}
		}
		[c,f].forEach(function(i){ i.addEventListener('input', link); });
		mount(root, el('div', { class: 'row g-2' }, [
			el('div', { class: 'col-12 col-md-6' }, [c]),
			el('div', { class: 'col-12 col-md-6' }, [f])
		]));
	}

	function renderMD5(root){
		function md5(str){
			return CryptoJS.MD5(str).toString();
		}
		var i = el('input', { class: 'form-control', placeholder: 'Enter text' });
		var o = el('input', { class: 'form-control mt-2', readonly: 'readonly', placeholder: 'MD5 hash will appear here' });
		i.addEventListener('input', function(){ o.value = md5(i.value||''); });
		mount(root, el('div', {}, [i,o]));
	}

	// Additional tools
	function renderSHA256(root){
		var i = el('input', { class: 'form-control', placeholder: 'Enter text' });
		var o = el('input', { class: 'form-control mt-2', readonly: 'readonly', placeholder: 'SHA-256 hash will appear here' });
		i.addEventListener('input', function(){ o.value = CryptoJS.SHA256(i.value||'').toString(); });
		mount(root, el('div', {}, [i,o]));
	}

	function renderURLCoder(root){
		var ta = el('textarea', { class: 'form-control', rows: '6', placeholder: 'Enter text or URL' });
		var btns = el('div', { class: 'mt-3 d-flex gap-2 flex-wrap' });
		var out = el('textarea', { class: 'form-control mt-2', rows: '6', readonly: 'readonly', placeholder: 'Result here' });
		var enc = el('button', { class: 'btn btn-primary btn-sm', type: 'button', text: 'Encode' });
		var dec = el('button', { class: 'btn btn-outline-primary btn-sm', type: 'button', text: 'Decode' });
		enc.addEventListener('click', function(){ out.value = encodeURIComponent(ta.value||''); });
		dec.addEventListener('click', function(){ try{ out.value = decodeURIComponent(ta.value||''); }catch(e){ out.value = 'Invalid input'; } });
		btns.appendChild(enc); btns.appendChild(dec); btns.appendChild(copyButton(function(){return out.value;}));
		mount(root, el('div', {}, [ ta, btns, out ]));
	}

	// Image tools
	function renderImageConvert(root, mime, ext){
		var inp = el('input', { class: 'form-control', type: 'file', accept: 'image/*' });
		var btn = el('button', { class: 'btn btn-primary btn-sm mt-2', text: 'Convert' });
		var dl = el('a', { class: 'btn btn-success btn-sm mt-2 ms-2 disabled', href: '#', text: 'Download ' + ext.toUpperCase() });
		var canvas = document.createElement('canvas');
		btn.addEventListener('click', function(){
			var f = inp.files && inp.files[0];
			if (!f) { alert('Choose an image'); return; }
			readImage(f, function(err, img){
				if (err) { alert('Invalid image'); return; }
				canvas.width = img.width; canvas.height = img.height;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
				canvas.toBlob(function(blob){
					var url = URL.createObjectURL(blob);
					dl.href = url; dl.download = 'converted.' + ext; dl.classList.remove('disabled');
				}, mime, mime === 'image/jpeg' ? 0.92 : 0.92);
			});
		});
		mount(root, el('div', {}, [ inp, btn, dl ]));
	}
	function renderImageToPNG(root){ renderImageConvert(root, 'image/png', 'png'); }
	function renderImageToJPG(root){ renderImageConvert(root, 'image/jpeg', 'jpg'); }
	function renderWebPToPNG(root){ renderImageConvert(root, 'image/png', 'png'); }

	function renderImageResizer(root){
		var inp = el('input', { class: 'form-control', type: 'file', accept: 'image/*' });
		var w = el('input', { class: 'form-control mt-2', type: 'number', placeholder: 'Width' });
		var h = el('input', { class: 'form-control mt-2', type: 'number', placeholder: 'Height' });
		var keep = el('input', { class: 'form-check-input', type: 'checkbox', id: 'keep-ar' });
		var keepL = el('label', { class: 'form-check-label ms-2', for: 'keep-ar', text: 'Maintain aspect ratio' });
		var btn = el('button', { class: 'btn btn-primary btn-sm mt-2', text: 'Resize' });
		var dl = el('a', { class: 'btn btn-success btn-sm mt-2 ms-2 disabled', href: '#', text: 'Download PNG' });
		var canvas = document.createElement('canvas');
		btn.addEventListener('click', function(){
			var f = inp.files && inp.files[0]; if (!f) { alert('Choose an image'); return; }
			readImage(f, function(err, img){
				if (err) { alert('Invalid image'); return; }
				var targetW = parseInt(w.value||img.width,10);
				var targetH = parseInt(h.value||img.height,10);
				if (keep.checked) {
					var ratio = Math.min(targetW / img.width, targetH / img.height);
					targetW = Math.round(img.width * ratio);
					targetH = Math.round(img.height * ratio);
				}
				canvas.width = targetW; canvas.height = targetH;
				canvas.getContext('2d').drawImage(img, 0, 0, targetW, targetH);
				canvas.toBlob(function(b){ var url = URL.createObjectURL(b); dl.href = url; dl.download='resized.png'; dl.classList.remove('disabled'); }, 'image/png');
			});
		});
		mount(root, el('div', {}, [ inp, w, h, el('div',{class:'form-check mt-2'},[keep, keepL]), btn, dl ]));
	}

	function renderImageCompressor(root){
		var inp = el('input', { class: 'form-control', type: 'file', accept: 'image/*' });
		var q = el('input', { class: 'form-control mt-2', type: 'number', step: '0.05', placeholder: 'Quality (0-1)' }); q.value='0.7';
		var btn = el('button', { class: 'btn btn-primary btn-sm mt-2', text: 'Compress' });
		var dl = el('a', { class: 'btn btn-success btn-sm mt-2 ms-2 disabled', href: '#', text: 'Download JPG' });
		var canvas = document.createElement('canvas');
		btn.addEventListener('click', function(){
			var f=inp.files && inp.files[0]; if(!f){ alert('Choose an image'); return; }
			readImage(f, function(err, img){ if(err){ alert('Invalid image'); return; }
				canvas.width = img.width; canvas.height = img.height; canvas.getContext('2d').drawImage(img,0,0);
				var quality = Math.min(Math.max(parseFloat(q.value||'0.7'),0),1);
				canvas.toBlob(function(b){ var url=URL.createObjectURL(b); dl.href=url; dl.download='compressed.jpg'; dl.classList.remove('disabled'); }, 'image/jpeg', quality);
			});
		});
		mount(root, el('div',{},[ inp, q, btn, dl ]));
	}

	function renderImageToBase64(root){
		var inp = el('input',{class:'form-control',type:'file',accept:'image/*'});
		var out = el('textarea',{class:'form-control mt-2',rows:'8',readonly:'readonly',placeholder:'Data URL will appear here'});
		inp.addEventListener('change', function(){ var f=inp.files&&inp.files[0]; if(!f) return; readFileAsDataURL(f, function(err, url){ out.value = url || ''; }); });
		mount(root, el('div',{},[inp,out,copyButton(function(){return out.value;})]));
	}

	// Simple numeric-input image cropper
	function renderImageCropper(root){
		var inp = el('input', { class:'form-control', type:'file', accept:'image/*' });
		var x = el('input', { class:'form-control mt-2', type:'number', placeholder:'x' });
		var y = el('input', { class:'form-control mt-2', type:'number', placeholder:'y' });
		var w = el('input', { class:'form-control mt-2', type:'number', placeholder:'width' });
		var h = el('input', { class:'form-control mt-2', type:'number', placeholder:'height' });
		var btn = el('button', { class:'btn btn-primary btn-sm mt-2', text:'Crop' });
		var dl = el('a', { class:'btn btn-success btn-sm mt-2 ms-2 disabled', href:'#', text:'Download PNG' });
		var canvas = document.createElement('canvas');
		btn.addEventListener('click', function(){
			var f = inp.files && inp.files[0]; if(!f){ alert('Choose image'); return; }
			readImage(f, function(err, img){ if(err){ alert('Invalid image'); return; }
				var sx = Math.max(0, parseInt(x.value||'0',10));
				var sy = Math.max(0, parseInt(y.value||'0',10));
				var sw = Math.max(1, parseInt(w.value||String(img.width - sx),10));
				var sh = Math.max(1, parseInt(h.value||String(img.height - sy),10));
				canvas.width = sw; canvas.height = sh;
				canvas.getContext('2d').drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
				canvas.toBlob(function(b){ var url=URL.createObjectURL(b); dl.href=url; dl.download='cropped.png'; dl.classList.remove('disabled'); }, 'image/png');
			});
		});
		mount(root, el('div',{},[inp, x, y, w, h, btn, dl]));
	}

	// Grammar checker using LanguageTool public API
	function renderGrammarChecker(root){
		var ta = el('textarea',{class:'form-control',rows:'8',placeholder:'Enter text'});
		var btn = el('button',{class:'btn btn-primary btn-sm mt-2',text:'Check grammar'});
		var out = el('div',{class:'mt-3'});
		btn.addEventListener('click', function(){
			out.textContent = 'Checking...';
			fetch('https://api.languagetool.org/v2/check', {
				method:'POST', headers:{'Content-Type':'application/x-www-form-urlencoded'},
				body: new URLSearchParams({ language:'en-US', text: ta.value||'' }).toString()
			})
			.then(function(r){ return r.json(); })
			.then(function(j){
				if (!j || !j.matches) { out.textContent = 'No issues found.'; return; }
				var list = el('ul',{class:'list-unstyled m-0'});
				j.matches.slice(0,50).forEach(function(m){ list.appendChild(el('li',{class:'mb-2'},[ el('strong',{text:m.message||'Issue'}), document.createTextNode(' (at '+m.offset+')') ])); });
				out.innerHTML=''; out.appendChild(list);
			})
			.catch(function(){ out.textContent='Service unavailable.'; });
		});
		mount(root, el('div',{},[ta,btn,out]));
	}

	// Plagiarism checker placeholder with helper links
	function renderPlagiarismChecker(root){
		var ta=el('textarea',{class:'form-control',rows:'8',placeholder:'Paste a sentence or paragraph'});
		var help=el('div',{class:'mt-2 small text-muted',text:'Direct plagiarism scanning requires a server API. Use the quick web search links below to check sentences manually.'});
		var out=el('div',{class:'mt-2'});
		var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Create search links'});
		btn.addEventListener('click',function(){ var lines=(ta.value||'').split(/\.|\n/).map(function(s){return s.trim();}).filter(function(s){return s.length>3;}).slice(0,5); out.innerHTML=''; lines.forEach(function(s){ var a=el('a',{href:'https://www.google.com/search?q='+encodeURIComponent('"'+s+'"'),target:'_blank',text:'Search: '+(s.length>60?s.slice(0,60)+'...':s)}); out.appendChild(el('div',{},[a])); }); });
		mount(root, el('div',{},[ta,help,btn,out]));
	}

	// SEO/API tools
	function renderPageSpeed(root){
		var url=el('input',{class:'form-control',placeholder:'Enter URL (https://...)'});
		var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Run Test'});
		var out=el('pre',{class:'mt-3 p-3 bg-light rounded',style:'white-space:pre-wrap'});
		btn.addEventListener('click',function(){
			out.textContent='Running...';
			var u=(url.value||'').trim();
			fetch('https://www.googleapis.com/pagespeedonline/v5/runPagespeed?category=PERFORMANCE&url='+encodeURIComponent(u))
			.then(function(r){return r.json();}).then(function(j){
				try{ var score = j.lighthouseResult.categories.performance.score; out.textContent='Performance Score: '+Math.round(score*100)+'\n\n'+JSON.stringify(j.loadingExperience||{},null,2); }
				catch(e){ out.textContent = JSON.stringify(j,null,2); }
			}).catch(function(){ out.textContent='Unable to fetch PageSpeed (network/CORS).'; });
		});
		mount(root, el('div',{},[url,btn,out]));
	}

	function renderMobileFriendly(root){
		var url=el('input',{class:'form-control',placeholder:'Enter URL'});
		var info=el('div',{class:'small text-muted mt-2',text:'Google Mobile-Friendly Test API requires an API key. Use the button below to open the test in a new tab.'});
		var a=el('a',{class:'btn btn-primary btn-sm mt-2 disabled',href:'#',text:'Open Mobile-Friendly Test',target:'_blank'});
		url.addEventListener('input',function(){ var u=(url.value||'').trim(); if(/^https?:\/\//.test(u)){ a.href='https://search.google.com/test/mobile-friendly?url='+encodeURIComponent(u); a.classList.remove('disabled'); } else { a.classList.add('disabled'); }});
		mount(root, el('div',{},[url,info,a]));
	}

	function renderGoogleIndexChecker(root){
		var url=el('input',{class:'form-control',placeholder:'Enter a page URL'});
		var a=el('a',{class:'btn btn-primary btn-sm mt-2 disabled',href:'#',text:'Search on Google',target:'_blank'});
		url.addEventListener('input',function(){ var u=(url.value||'').trim(); if(/^https?:\/\//.test(u)){ a.href='https://www.google.com/search?q='+encodeURIComponent('site:'+u); a.classList.remove('disabled'); } else { a.classList.add('disabled'); }});
		mount(root, el('div',{},[url,a]));
	}

	function renderDomainAuthority(root){
		var domain=el('input',{class:'form-control',placeholder:'Enter domain (example.com)'});
		var info=el('div',{class:'small text-muted mt-2',text:'Domain Authority requires third-party APIs (e.g., Moz). Use the link below.'});
		var a=el('a',{class:'btn btn-primary btn-sm mt-2 disabled',href:'#',text:'Open Moz Link Explorer',target:'_blank'});
		domain.addEventListener('input',function(){ var d=(domain.value||'').trim().replace(/^https?:\/\//,''); if(d){ a.href='https://analytics.moz.com/pro/link-explorer/overview?site='+encodeURIComponent(d); a.classList.remove('disabled'); } else { a.classList.add('disabled'); }});
		mount(root, el('div',{},[domain,info,a]));
	}

	function renderBacklinkChecker(root){
		var domain=el('input',{class:'form-control',placeholder:'Enter domain (example.com)'});
		var info=el('div',{class:'small text-muted mt-2',text:'Backlink data requires third-party services. Use the external tools below.'});
		var wrap=el('div',{class:'mt-2 d-flex gap-2 flex-wrap'});
		var moz=el('a',{class:'btn btn-outline-primary btn-sm disabled',href:'#',text:'Moz',target:'_blank'});
		var ahrefs=el('a',{class:'btn btn-outline-primary btn-sm disabled',href:'#',text:'Ahrefs',target:'_blank'});
		var semrush=el('a',{class:'btn btn-outline-primary btn-sm disabled',href:'#',text:'Semrush',target:'_blank'});
		wrap.appendChild(moz); wrap.appendChild(ahrefs); wrap.appendChild(semrush);
		domain.addEventListener('input',function(){ var d=(domain.value||'').trim().replace(/^https?:\/\//,''); var ok=!!d; function set(a,href){ if(ok){ a.href=href; a.classList.remove('disabled'); } else { a.classList.add('disabled'); a.href='#'; } } set(moz,'https://analytics.moz.com/pro/link-explorer/overview?site='+encodeURIComponent(d)); set(ahrefs,'https://ahrefs.com/backlink-checker?target='+encodeURIComponent(d)); set(semrush,'https://www.semrush.com/analytics/backlinks/overview/?query='+encodeURIComponent(d)); });
		mount(root, el('div',{},[domain,info,wrap]));
	}

	// SEO text utilities
	function renderKeywordDensity(root){
		var ta=el('textarea',{class:'form-control',rows:'8',placeholder:'Paste text'});
		var term=el('input',{class:'form-control mt-2',placeholder:'Keyword'});
		var out=el('div',{class:'mt-2'});
		function calc(){
			var text=(ta.value||'').toLowerCase();
			var words=(text.match(/\b\w+\b/g)||[]);
			var total=words.length;
			var key=(term.value||'').toLowerCase().trim();
			var count=key?words.filter(function(w){return w===key;}).length:0;
			out.textContent = key?('Count: '+count+' | Density: '+(total?((count/total*100).toFixed(2)+'%'):'0%')):('Total words: '+total);
		}
		[ta,term].forEach(function(x){x.addEventListener('input',calc);});
		calc();
		mount(root, el('div',{},[ta,term,out]));
	}

	function renderMetaTagGenerator(root){
		var title=el('input',{class:'form-control',placeholder:'Page title'});
		var desc=el('input',{class:'form-control mt-2',placeholder:'Description'});
		var url=el('input',{class:'form-control mt-2',placeholder:'URL'});
		var out=el('textarea',{class:'form-control mt-3',rows:'10',readonly:'readonly'});
		function gen(){ var t=title.value||''; var d=desc.value||''; var u=url.value||''; out.value=[
			'<title>'+t+'</title>',
			'<meta name="description" content="'+d+'">',
			'<meta property="og:title" content="'+t+'">',
			'<meta property="og:description" content="'+d+'">',
			'<meta property="og:url" content="'+u+'">',
			'<meta name="twitter:card" content="summary_large_image">'
		].join('\n'); }
		[title,desc,url].forEach(function(x){x.addEventListener('input',gen);}); gen();
		mount(root, el('div',{},[title,desc,url,out,copyButton(function(){return out.value;})]));
	}

	function renderSitemapGenerator(root){
		var ta=el('textarea',{class:'form-control',rows:'8',placeholder:'Enter one URL per line'});
		var out=el('textarea',{class:'form-control mt-2',rows:'10',readonly:'readonly'});
		var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Generate XML'});
		btn.addEventListener('click',function(){ var urls=(ta.value||'').split(/\r?\n/).map(function(u){return u.trim();}).filter(Boolean); var xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+ urls.map(function(u){return '  <url><loc>'+u+'</loc></url>';}).join('\n')+'\n</urlset>'; out.value=xml; });
		mount(root, el('div',{},[ta,btn,out]));
	}

	function renderRobotsGenerator(root){
		var host=el('input',{class:'form-control',placeholder:'Sitemap URL (optional)'});
		var out=el('textarea',{class:'form-control mt-2',rows:'10',readonly:'readonly'});
		function gen(){ var lines=['User-agent: *','Allow: /']; var sm=host.value.trim(); if(sm) lines.push('Sitemap: '+sm); out.value=lines.join('\n'); }
		host.addEventListener('input',gen); gen();
		mount(root, el('div',{},[host,out,copyButton(function(){return out.value;})]));
	}

	// ===== Missing tool implementations to prevent undefined errors =====
	function renderCharacterCounter(root){ var ta=el('textarea',{class:'form-control',rows:'8',placeholder:'Type...'}); var out=el('div',{class:'mt-2'}); function upd(){ out.textContent = 'Characters: ' + (ta.value||'').length; } ta.addEventListener('input',upd); upd(); mount(root, el('div',{},[ta,out])); }

	function renderJSONFormatter(root){ var ta=el('textarea',{class:'form-control',rows:'10',placeholder:'Paste JSON'}); var out=el('pre',{class:'mt-3 p-3 bg-light rounded',style:'white-space:pre-wrap'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Format'}); var btn2=el('button',{class:'btn btn-outline-primary btn-sm mt-2 ms-2',text:'Minify'}); btn.addEventListener('click',function(){ try{ out.textContent=JSON.stringify(JSON.parse(ta.value||'{}'),null,2);}catch(e){ out.textContent='Invalid JSON';}}); btn2.addEventListener('click',function(){ try{ out.textContent=JSON.stringify(JSON.parse(ta.value||'{}'));}catch(e){ out.textContent='Invalid JSON';}}); mount(root, el('div',{},[ta,btn,btn2,out])); }

	function renderHTMLToMarkdown(root){ var ta=el('textarea',{class:'form-control',rows:'10',placeholder:'<h1>HTML</h1>'}); var out=el('textarea',{class:'form-control mt-3',rows:'10',readonly:'readonly'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Convert'}); btn.addEventListener('click',function(){ if(window.TurndownService){ var t=new TurndownService(); out.value=t.turndown(ta.value||''); } else { out.value=ta.value; } }); mount(root, el('div',{},[ta,btn,out])); }

	function renderMarkdownToHTML(root){ var ta=el('textarea',{class:'form-control',rows:'10',placeholder:'# Markdown'}); var out=el('div',{class:'mt-3 p-3 border rounded bg-white'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Convert'}); btn.addEventListener('click',function(){ out.innerHTML = (window.marked ? window.marked.parse(ta.value||'') : ta.value); }); mount(root, el('div',{},[ta,btn,out])); }

	function renderCSSMinifier(root){ var ta=el('textarea',{class:'form-control',rows:'10',placeholder:'/* CSS */'}); var out=el('textarea',{class:'form-control mt-3',rows:'10',readonly:'readonly'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Minify'}); btn.addEventListener('click',function(){ out.value=(ta.value||'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s+/g,' ').replace(/\s*([{};:,>])\s*/g,'$1').trim(); }); mount(root, el('div',{},[ta,btn,out])); }

	function renderJSMinifier(root){ var ta=el('textarea',{class:'form-control',rows:'10',placeholder:'// JavaScript'}); var out=el('textarea',{class:'form-control mt-3',rows:'10',readonly:'readonly'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Minify'}); btn.addEventListener('click',function(){ out.value=(ta.value||'').replace(/\/\*[\s\S]*?\*\//g,'').replace(/(^|[^:])\/\/.*$/gm,'$1').replace(/\s+/g,' ').replace(/\s*([{};:,()>\[\]=+\-*/])\s*/g,'$1').trim(); }); mount(root, el('div',{},[ta,btn,out])); }

	function renderSQLFormatter(root){ var ta=el('textarea',{class:'form-control',rows:'10',placeholder:'SELECT * FROM table'}); var out=el('pre',{class:'mt-3 p-3 bg-light rounded',style:'white-space:pre-wrap'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Format'}); btn.addEventListener('click',function(){ out.textContent = (window.sqlFormatter?window.sqlFormatter.format(ta.value||''):ta.value); }); mount(root, el('div',{},[ta,btn,out])); }

	function renderColorPicker(root){ var inp=el('input',{class:'form-control form-control-color',type:'color',value:'#4f46e5'}); var hex=el('input',{class:'form-control mt-2',readonly:'readonly'}); var rgb=el('input',{class:'form-control mt-2',readonly:'readonly'}); function upd(){ hex.value=inp.value; var v=inp.value; var r=parseInt(v.substr(1,2),16),g=parseInt(v.substr(3,2),16),b=parseInt(v.substr(5,2),16); rgb.value='rgb('+r+', '+g+', '+b+')'; } inp.addEventListener('input',upd); upd(); mount(root, el('div',{},[inp,hex,rgb,copyButton(function(){return hex.value;})])); }

	function renderBase64(root){ var ta=el('textarea',{class:'form-control',rows:'6',placeholder:'Text'}); var out=el('textarea',{class:'form-control mt-2',rows:'6',readonly:'readonly'}); var enc=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Encode'}); var dec=el('button',{class:'btn btn-outline-primary btn-sm mt-2 ms-2',text:'Decode'}); enc.addEventListener('click',function(){ try{ out.value=btoa(unescape(encodeURIComponent(ta.value||''))); }catch(e){ out.value='Invalid input'; } }); dec.addEventListener('click',function(){ try{ out.value=decodeURIComponent(escape(atob(ta.value||''))); }catch(e){ out.value='Invalid Base64'; } }); mount(root, el('div',{},[ta,enc,dec,out])); }

	function renderIPGeolocation(root){
		var out=el('pre',{class:'p-3 bg-light rounded',style:'white-space:pre-wrap'});
		out.textContent='Loading...';
		mount(root, out);
		function show(j){ out.textContent=JSON.stringify(j,null,2); }
		function tryIpApi(){
			return fetch('https://ipapi.co/json/')
				.then(function(r){ if(!r.ok) throw new Error('ipapi'); return r.json(); })
				.then(function(j){ if(!j || j.error) throw new Error('ipapi data'); show(j); });
		}
		function tryIpWho(){
			return fetch('https://ipwho.is/')
				.then(function(r){ if(!r.ok) throw new Error('ipwho'); return r.json(); })
				.then(function(j){ if(j && (j.success===undefined || j.success===true)) show(j); else throw new Error('ipwho data'); });
		}
		function tryIpifyThenIpWho(){
			return fetch('https://api.ipify.org?format=json')
				.then(function(r){ if(!r.ok) throw new Error('ipify'); return r.json(); })
				.then(function(a){ return fetch('https://ipwho.is/'+a.ip); })
				.then(function(r){ if(!r.ok) throw new Error('ipwho by ip'); return r.json(); })
				.then(function(j){ show(j); });
		}
		function tryIpifyThenIpApi(){
			return fetch('https://api.ipify.org?format=json')
				.then(function(r){ if(!r.ok) throw new Error('ipify'); return r.json(); })
				.then(function(a){ return fetch('https://ipapi.co/'+a.ip+'/json/'); })
				.then(function(r){ if(!r.ok) throw new Error('ipapi by ip'); return r.json(); })
				.then(function(j){ if(!j || j.error) throw new Error('ipapi by ip data'); show(j); });
		}
		function finalIpOnly(){
			return fetch('https://api.ipify.org?format=json')
				.then(function(r){ return r.json(); })
				.then(function(a){ show({ ip: a.ip, note: 'Fallback: only public IP available (geo API blocked)' }); });
		}
		tryIpApi()
			.catch(function(){ return tryIpWho(); })
			.catch(function(){ return tryIpifyThenIpWho(); })
			.catch(function(){ return tryIpifyThenIpApi(); })
			.catch(function(){ return finalIpOnly(); })
			.catch(function(){ out.textContent='Unable to fetch IP info. Check network/CORS and try again.'; });
	}

	function renderIPTracker(root){
		// Simple alias to geolocation lookup so the tool renders useful info
		return renderIPGeolocation(root);
	}

	function numberInput(ph){ return el('input',{class:'form-control',type:'number',placeholder:ph}); }
	function renderAgeCalculator(root){ var d=el('input',{class:'form-control',type:'date'}); var out=el('div',{class:'mt-2'}); d.addEventListener('input',function(){ if(!d.value){ out.textContent=''; return;} var dob=new Date(d.value); var now=new Date(); var y=now.getFullYear()-dob.getFullYear(); var m=now.getMonth()-dob.getMonth(); if(m<0||(m===0&&now.getDate()<dob.getDate())) y--; out.textContent='Age: '+y+' years'; }); mount(root, el('div',{},[d,out])); }
	function renderBMI(root){ var h=numberInput('Height (cm)'); var w=numberInput('Weight (kg)'); var out=el('div',{class:'mt-2'}); function calc(){ var hm=(parseFloat(h.value||'0')/100); var ww=parseFloat(w.value||'0'); var bmi=ww/(hm*hm||1); var cat=bmi<18.5?'Underweight':bmi<25?'Normal':bmi<30?'Overweight':'Obese'; out.textContent='BMI: '+(isFinite(bmi)?bmi.toFixed(2):'0')+' ('+cat+')'; } [h,w].forEach(function(i){i.addEventListener('input',calc);}); mount(root, el('div',{},[h,w,out])); }
	function renderLoanEMI(root){ var p=numberInput('Principal'); var r=numberInput('Annual Interest %'); var n=numberInput('Tenure (months)'); var out=el('div',{class:'mt-2'}); function calc(){ var P=parseFloat(p.value||'0'); var R=(parseFloat(r.value||'0')/12)/100; var N=parseInt(n.value||'0',10); var emi=(P*R*Math.pow(1+R,N))/(Math.pow(1+R,N)-1||1); out.textContent='EMI: '+(isFinite(emi)?emi.toFixed(2):'0'); } [p,r,n].forEach(function(i){i.addEventListener('input',calc);}); mount(root, el('div',{},[p,r,n,out])); }
	function renderDiscountCalculator(root){ var price=numberInput('Original price'); var disc=numberInput('Discount %'); var out=el('div',{class:'mt-2'}); function calc(){ var pr=parseFloat(price.value||'0'); var d=parseFloat(disc.value||'0'); var save=pr*d/100; out.textContent='You save '+save.toFixed(2)+' | Final '+(pr-save).toFixed(2); } [price,disc].forEach(function(i){i.addEventListener('input',calc);}); mount(root, el('div',{},[price,disc,out])); }
	function renderCurrencyConverter(root){ var from=el('input',{class:'form-control',placeholder:'From (USD)'}); var to=el('input',{class:'form-control mt-2',placeholder:'To (EUR)'}); var amount=numberInput('Amount'); amount.value='1'; var out=el('div',{class:'mt-2'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Convert'}); btn.addEventListener('click',function(){ var f=(from.value||'USD').toUpperCase(); var t=(to.value||'EUR').toUpperCase(); fetch('https://api.exchangerate.host/convert?from='+f+'&to='+t+'&amount='+(amount.value||1)).then(function(r){return r.json();}).then(function(j){ out.textContent=(j&&j.result)?(j.result.toFixed(4)+' '+t):'Conversion failed'; }).catch(function(){ out.textContent='Failed to fetch rates'; }); }); mount(root, el('div',{},[from,to,amount,btn,out])); }
	function renderTimeZoneConverter(root){ var time=el('input',{class:'form-control',type:'datetime-local'}); var to=el('input',{class:'form-control mt-2',placeholder:'Target TZ (e.g., UTC)'}); var out=el('div',{class:'mt-2'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Convert'}); btn.addEventListener('click',function(){ try{ var d=new Date(time.value); var fmt=new Intl.DateTimeFormat('en-US',{timeZone:(to.value||'UTC'),hour12:false,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}); out.textContent=fmt.format(d);}catch(e){ out.textContent='Invalid time zone'; } }); mount(root, el('div',{},[time,to,btn,out])); }
	function renderBinaryToDecimal(root){ var i=el('input',{class:'form-control',placeholder:'Binary 1010'}); var o=el('input',{class:'form-control mt-2',readonly:'readonly',placeholder:'Decimal'}); i.addEventListener('input',function(){ var s=(i.value||'').replace(/[^01]/g,''); o.value=s?parseInt(s,2):''; }); mount(root, el('div',{},[i,o])); }
	function renderTipCalculator(root){ var bill=numberInput('Bill'); var pct=numberInput('Tip %'); var out=el('div',{class:'mt-2'}); function calc(){ var b=parseFloat(bill.value||'0'); var p=parseFloat(pct.value||'0'); var tip=b*p/100; out.textContent='Tip '+tip.toFixed(2)+' | Total '+(b+tip).toFixed(2);} [bill,pct].forEach(function(x){x.addEventListener('input',calc);}); mount(root, el('div',{},[bill,pct,out])); }

	function select(map, def){ var s=el('select',{class:'form-select'}); Object.keys(map).forEach(function(k){ s.appendChild(el('option',{value:k,text:k})); }); s.value=def; return s; }
	function renderUnitConverter(root,units){ var val=numberInput('Value'); var from=select(units,Object.keys(units)[0]); var to=select(units,Object.keys(units)[1]||Object.keys(units)[0]); var out=el('input',{class:'form-control mt-2',readonly:'readonly'}); function conv(){ var v=parseFloat(val.value||'0'); var base=v*units[from.value]; var res=base/units[to.value]; out.value=isFinite(res)?String(res):''; } [val,from,to].forEach(function(x){x.addEventListener('input',conv);}); mount(root, el('div',{},[val,el('div',{class:'d-flex gap-2 mt-2'},[from,to]),out])); }
	function renderLengthConverter(root){ renderUnitConverter(root, {'m':1,'km':1000,'cm':0.01,'mm':0.001,'mi':1609.344,'yd':0.9144,'ft':0.3048,'in':0.0254}); }
	function renderWeightConverter(root){ renderUnitConverter(root, {'kg':1,'g':0.001,'lb':0.45359237,'oz':0.0283495231}); }
	function renderSpeedConverter(root){ renderUnitConverter(root, {'m/s':1,'km/h':0.277778,'mph':0.44704,'kn':0.514444}); }
	function renderVolumeConverter(root){ renderUnitConverter(root, {'l':1,'ml':0.001,'m3':1000,'gal':3.78541,'qt':0.946353}); }
	function renderDataStorageConverter(root){ renderUnitConverter(root, {'B':1,'KB':1024,'MB':1048576,'GB':1073741824,'TB':1099511627776}); }
	function renderEnergyConverter(root){ renderUnitConverter(root, {'J':1,'kJ':1000,'cal':4.184,'kcal':4184,'Wh':3600,'kWh':3600000}); }
	function renderPressureConverter(root){ renderUnitConverter(root, {'Pa':1,'kPa':1000,'bar':100000,'atm':101325,'psi':6894.76}); }
	function renderFuelEfficiencyConverter(root){ var val=numberInput('Value'); var from=select({'km/l':1,'l/100km':-1,'mpg':0.425144},'km/l'); var to=select({'km/l':1,'l/100km':-1,'mpg':0.425144},'mpg'); var out=el('input',{class:'form-control mt-2',readonly:'readonly'}); function conv(){ var v=parseFloat(val.value||'0'); var res=v; if(from.value==='l/100km'){ res=100/v; } else if(to.value==='l/100km'){ res=100/v; } else if(from.value==='km/l'&&to.value==='mpg'){ res=v*2.35215; } else if(from.value==='mpg'&&to.value==='km/l'){ res=v*0.425144; } out.value=isFinite(res)?String(res):'';} [val,from,to].forEach(function(x){x.addEventListener('input',conv);}); mount(root, el('div',{},[val,el('div',{class:'d-flex gap-2 mt-2'},[from,to]),out])); }
	function renderAngleConverter(root){ renderUnitConverter(root, {'deg':1,'rad':Math.PI/180,'grad':0.9}); }

	function renderPasswordGenerator(root){ var len=numberInput('Length'); len.value='16'; var upper=el('input',{class:'form-check-input',type:'checkbox',id:'pgU'}); upper.checked=true; var lower=el('input',{class:'form-check-input',type:'checkbox',id:'pgL'}); lower.checked=true; var num=el('input',{class:'form-check-input',type:'checkbox',id:'pgN'}); num.checked=true; var sym=el('input',{class:'form-check-input',type:'checkbox',id:'pgS'}); var out=el('input',{class:'form-control mt-2',readonly:'readonly'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Generate'}); btn.addEventListener('click',function(){ var l=Math.max(4,parseInt(len.value||'16',10)); var chars=''; if(upper.checked) chars+='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; if(lower.checked) chars+='abcdefghijklmnopqrstuvwxyz'; if(num.checked) chars+='0123456789'; if(sym.checked) chars+='!@#$%^&*()_+{}[]<>?'; var r=''; for(var i=0;i<l;i++) r+=chars.charAt(Math.floor(Math.random()*chars.length)); out.value=r; }); mount(root, el('div',{},[len,el('div',{class:'form-check mt-2'},[upper,el('label',{class:'form-check-label ms-2',for:'pgU',text:'A-Z'})]),el('div',{class:'form-check'},[lower,el('label',{class:'form-check-label ms-2',for:'pgL',text:'a-z'})]),el('div',{class:'form-check'},[num,el('label',{class:'form-check-label ms-2',for:'pgN',text:'0-9'})]),el('div',{class:'form-check'},[sym,el('label',{class:'form-check-label ms-2',for:'pgS',text:'!@#$%'})]),btn,out,copyButton(function(){return out.value;})])); }
	function renderRandomString(root){ var len=numberInput('Length'); len.value='12'; var out=el('input',{class:'form-control mt-2',readonly:'readonly'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Generate'}); btn.addEventListener('click',function(){ var l=parseInt(len.value||'12',10); var c='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; var r=''; for(var i=0;i<l;i++) r+=c.charAt(Math.floor(Math.random()*c.length)); out.value=r; }); mount(root, el('div',{},[len,btn,out,copyButton(function(){return out.value;})])); }
	function renderRandomNumber(root){ var min=numberInput('Min'); var max=numberInput('Max'); var out=el('div',{class:'mt-2 fw-semibold'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Roll'}); btn.addEventListener('click',function(){ var a=parseInt(min.value||'0',10), b=parseInt(max.value||'100',10); if(b<a){ var t=a;a=b;b=t;} out.textContent=String(Math.floor(Math.random()*(b-a+1))+a); }); mount(root, el('div',{},[min,max,btn,out])); }
	function renderCoinFlip(root){ var btn=el('button',{class:'btn btn-primary',text:'Flip'}); var out=el('div',{class:'mt-3 display-6'}); btn.addEventListener('click',function(){ out.textContent=Math.random()<0.5?'Heads':'Tails'; }); mount(root, el('div',{},[btn,out])); }
	function renderDiceRoller(root){ var count=numberInput('Dice count'); count.value='1'; var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Roll'}); var out=el('div',{class:'mt-2'}); btn.addEventListener('click',function(){ var c=parseInt(count.value||'1',10); var vals=[]; for(var i=0;i<c;i++) vals.push(1+Math.floor(Math.random()*6)); out.textContent='Rolls: '+vals.join(', ')+' | Sum: '+vals.reduce(function(a,b){return a+b;},0); }); mount(root, el('div',{},[count,btn,out])); }
	function renderEmojiKeyboard(root){ var list='😀😁😂🤣😃😄😅😆😉😊😍😘🤗🤔😐😑😴😎😢😭😡👍👎🙏🔥🎉✨✅❌💡🔗📌📝💻📱🧠'.split(''); var box=el('div',{class:'d-flex flex-wrap gap-2'}); list.forEach(function(ch){ var b=el('button',{class:'btn btn-light border',type:'button',text:ch}); b.addEventListener('click',function(){ navigator.clipboard&&navigator.clipboard.writeText(ch); b.classList.add('btn-success'); setTimeout(function(){b.classList.remove('btn-success');},800); }); box.appendChild(b); }); mount(root, box); }
	function renderTwitterCharCounter(root){ var ta=el('textarea',{class:'form-control',rows:'6',placeholder:'Tweet text'}); var out=el('div',{class:'mt-2'}); function upd(){ out.textContent=(ta.value||'').length+'/280'; } ta.addEventListener('input',upd); upd(); mount(root, el('div',{},[ta,out])); }
	function renderBarcode(root){ var i=el('input',{class:'form-control',placeholder:'Text'}); var svg=el('svg',{class:'mt-3'}); function draw(){ svg.innerHTML=''; if(window.JsBarcode && i.value){ JsBarcode(svg, i.value, {format:'CODE128'}); } } i.addEventListener('input',draw); mount(root, el('div',{},[i,svg])); }
	function renderMemeGenerator(root){ var inp=el('input',{class:'form-control',type:'file',accept:'image/*'}); var top=el('input',{class:'form-control mt-2',placeholder:'Top text'}); var bottom=el('input',{class:'form-control mt-2',placeholder:'Bottom text'}); var canvas=el('canvas',{class:'mt-3 img-fluid'}); function draw(img){ var ctx=canvas.getContext('2d'); canvas.width=img.width; canvas.height=img.height; ctx.drawImage(img,0,0); ctx.fillStyle='white'; ctx.strokeStyle='black'; ctx.lineWidth=4; ctx.font=Math.floor(canvas.width/10)+'px Impact, Arial Black, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='top'; ctx.strokeText(top.value.toUpperCase(), canvas.width/2, 10); ctx.fillText(top.value.toUpperCase(), canvas.width/2, 10); ctx.textBaseline='bottom'; ctx.strokeText(bottom.value.toUpperCase(), canvas.width/2, canvas.height-10); ctx.fillText(bottom.value.toUpperCase(), canvas.width/2, canvas.height-10); } [inp,top,bottom].forEach(function(x){ x.addEventListener('input',function(){ var f=inp.files&&inp.files[0]; if(!f) return; readImage(f,function(err,img){ if(!err) draw(img); }); }); }); mount(root, el('div',{},[inp,top,bottom,canvas])); }
	function renderResumeBuilder(root){ var name=el('input',{class:'form-control',placeholder:'Your Name'}); var email=el('input',{class:'form-control mt-2',placeholder:'Email'}); var summary=el('textarea',{class:'form-control mt-2',rows:'4',placeholder:'Summary'}); var exp=el('textarea',{class:'form-control mt-2',rows:'6',placeholder:'Experience (one per line)'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Export PDF'}); btn.addEventListener('click',function(){ var doc=new window.jspdf.jsPDF(); doc.setFontSize(16); doc.text(name.value||'',10,15); doc.setFontSize(10); doc.text(email.value||'',10,22); doc.setFontSize(12); doc.text('Summary',10,32); doc.setFontSize(10); doc.text((summary.value||'').split('\n'),10,38); doc.setFontSize(12); doc.text('Experience',10,68); doc.setFontSize(10); doc.text((exp.value||'').split('\n'),10,74); doc.save('resume.pdf'); }); mount(root, el('div',{},[name,email,summary,exp,btn])); }
	function renderInvoiceGenerator(root){ var client=el('input',{class:'form-control',placeholder:'Client Name'}); var items=el('textarea',{class:'form-control mt-2',rows:'6',placeholder:'Items (name,qty,price) per line'}); var out=el('div',{class:'mt-3'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Generate'}); btn.addEventListener('click',function(){ var lines=(items.value||'').split(/\r?\n/).filter(Boolean); var total=0; var tbl=el('table',{class:'table table-sm'},[ el('thead',{},[ el('tr',{},[el('th',{text:'Item'}),el('th',{text:'Qty'}),el('th',{text:'Price'}),el('th',{text:'Amount'})]) ]), el('tbody') ]); lines.forEach(function(l){ var p=l.split(','); var name=p[0]||''; var qty=parseFloat(p[1]||'1'); var price=parseFloat(p[2]||'0'); var amt=qty*price; total+=amt; tbl.querySelector('tbody').appendChild(el('tr',{},[el('td',{text:name}),el('td',{text:String(qty)}),el('td',{text:String(price)}),el('td',{text:amt.toFixed(2)})])); }); out.innerHTML=''; out.appendChild(el('h6',{text:client.value||'Invoice'})); out.appendChild(tbl); out.appendChild(el('div',{class:'fw-semibold',text:'Total: '+total.toFixed(2)})); }); mount(root, el('div',{},[client,items,btn,out])); }
	function renderBusinessNameGenerator(root){ var topic=el('input',{class:'form-control',placeholder:'Keyword'}); var out=el('ul',{class:'mt-2'}); function gen(){ var k=(topic.value||'Nova').trim(); var suffix=['Labs','Hub','Works','Forge','Nest','Studio','Stack','Flow','Craft','Core']; out.innerHTML=''; suffix.forEach(function(s){ out.appendChild(el('li',{text:k+' '+s})); }); } topic.addEventListener('input',gen); gen(); mount(root, el('div',{},[topic,out])); }
	function renderLottery(root){ var count=numberInput('How many numbers'); count.value='6'; var max=numberInput('Max number'); max.value='49'; var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Generate'}); var out=el('div',{class:'mt-2'}); btn.addEventListener('click',function(){ var c=parseInt(count.value||'6',10); var m=parseInt(max.value||'49',10); var set=new Set(); while(set.size<c){ set.add(1+Math.floor(Math.random()*m)); } out.textContent=Array.from(set).sort(function(a,b){return a-b;}).join(', '); }); mount(root, el('div',{},[count,max,btn,out])); }
	function renderPlanner(root){ var out=el('table',{class:'table table-bordered'}); var days=['Mon','Tue','Wed','Thu','Fri','Sat','Sun']; var thead=el('thead',{},[el('tr',{},days.map(function(d){return el('th',{text:d});}))]); var tbody=el('tbody'); for(var r=0;r<8;r++){ var tr=el('tr'); for(var c=0;c<7;c++){ tr.appendChild(el('td',{text:''})); } tbody.appendChild(tr);} out.appendChild(thead); out.appendChild(tbody); mount(root, out); }
	function renderYouTubeThumb(root){ var i=el('input',{class:'form-control',placeholder:'YouTube URL or ID'}); var img=el('img',{class:'img-fluid mt-3',alt:'Thumbnail'}); function idFrom(u){ var m=u.match(/[?&]v=([^&]+)/)||u.match(/youtu\.be\/([^?]+)/)||u.match(/^([\w-]{11})$/); return m?m[1]:'';} i.addEventListener('input',function(){ var id=idFrom(i.value||''); img.src=id?('https://img.youtube.com/vi/'+id+'/maxresdefault.jpg'):''; }); mount(root, el('div',{},[i,img])); }
	function renderAddressGenerator(root){ var cities=['Springfield','Riverton','Lakeside','Greendale','Fairview']; var streets=['Main St','Oak Ave','Pine Rd','Maple Dr','Cedar Ln']; var btn=el('button',{class:'btn btn-primary btn-sm',text:'Generate'}); var out=el('div',{class:'mt-2'}); btn.addEventListener('click',function(){ var addr=(1+Math.floor(Math.random()*9999))+' '+streets[Math.floor(Math.random()*streets.length)]+', '+cities[Math.floor(Math.random()*cities.length)]+', '+(10000+Math.floor(Math.random()*89999)); out.textContent=addr; }); mount(root, el('div',{},[btn,out])); }
	function renderElectricBill(root){ var units=numberInput('Units (kWh)'); var rate=numberInput('Rate per kWh'); rate.value='0.12'; var fixed=numberInput('Fixed charge'); fixed.value='5'; var out=el('div',{class:'mt-2'}); [units,rate,fixed].forEach(function(x){ x.addEventListener('input',function(){ var u=parseFloat(units.value||'0'); var r=parseFloat(rate.value||'0'); var f=parseFloat(fixed.value||'0'); out.textContent='Estimated bill: '+(u*r+f).toFixed(2); }); }); mount(root, el('div',{},[units,rate,fixed,out])); }
	function renderLeapYear(root){ var year=numberInput('Year'); var out=el('div',{class:'mt-2'}); year.addEventListener('input',function(){ var y=parseInt(year.value||'0',10); var leap=(y%4===0 && (y%100!==0 || y%400===0)); out.textContent=leap?'Leap year':'Not a leap year'; }); mount(root, el('div',{},[year,out])); }
	function renderNameNumerology(root){ var i=el('input',{class:'form-control',placeholder:'Enter name'}); var out=el('div',{class:'mt-2'}); i.addEventListener('input',function(){ var s=(i.value||'').toUpperCase().replace(/[^A-Z]/g,''); var map='ABCDEFGHIJKLMNOPQRSTUVWXYZ'; var sum=0; for(var k=0;k<s.length;k++){ sum+=(map.indexOf(s[k])%9)+1; } out.textContent='Numerology number: '+((sum%9)||9); }); mount(root, el('div',{},[i,out])); }

	function renderQRCode(root){ var i=el('input',{class:'form-control',placeholder:'Text or URL'}); var box=el('div',{class:'mt-3 d-flex justify-content-center'}); var qDiv=el('div'); box.appendChild(qDiv); function draw(){ qDiv.innerHTML=''; if(window.QRCode && i.value){ new QRCode(qDiv,{text:i.value,width:200,height:200}); } } i.addEventListener('input',draw); mount(root, el('div',{},[i,box])); }

	function renderGIFMaker(root){ var inp=el('input',{class:'form-control',type:'file',accept:'image/*',multiple:'multiple'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Create GIF'}); var dl=el('a',{class:'btn btn-success btn-sm mt-2 ms-2 disabled',href:'#',text:'Download GIF'}); btn.addEventListener('click',function(){ if(!window.GIF){ alert('GIF library missing'); return;} var files=Array.prototype.slice.call(inp.files||[]); if(!files.length){ alert('Select images'); return;} var gif=new GIF({workers:2,workerScript:window.__GIF_WORKER__||'',quality:10}); var loaded=0; files.forEach(function(f){ readImage(f,function(err,img){ if(!err){ var c=document.createElement('canvas'); c.width=img.width; c.height=img.height; c.getContext('2d').drawImage(img,0,0); gif.addFrame(c,{delay:300}); } loaded++; if(loaded===files.length){ gif.on('finished',function(b){ var url=URL.createObjectURL(b); dl.href=url; dl.download='animated.gif'; dl.classList.remove('disabled'); }); gif.render(); } }); }); }); mount(root, el('div',{},[inp,btn,dl])); }

	function renderScreenshotToPDF(root){ var inp=el('input',{class:'form-control',type:'file',accept:'image/*'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Convert to PDF'}); var dl=el('a',{class:'btn btn-success btn-sm mt-2 ms-2 disabled',href:'#',text:'Download PDF'}); btn.addEventListener('click',function(){ var f=inp.files&&inp.files[0]; if(!f){ alert('Choose image'); return;} readImage(f,function(err,img){ if(err){ alert('Invalid image'); return;} var pdf=new window.jspdf.jsPDF({unit:'px',format:[img.width,img.height]}); pdf.addImage(img,'PNG',0,0,img.width,img.height); var blob=pdf.output('blob'); var url=URL.createObjectURL(blob); dl.href=url; dl.download='image.pdf'; dl.classList.remove('disabled'); }); }); mount(root, el('div',{},[inp,btn,dl])); }

	function renderTextToSpeech(root){
		var ta=el('textarea',{class:'form-control',rows:'6',placeholder:'Text to speak'}); ta.value='Hello! This is a test.';
		var voiceSel=el('select',{class:'form-select mt-2'});
		var rate=el('input',{class:'form-range mt-2',type:'range',min:'0.5',max:'2',step:'0.1'}); rate.value='1';
		var pitch=el('input',{class:'form-range',type:'range',min:'0',max:'2',step:'0.1'}); pitch.value='1';
		var speakBtn=el('button',{class:'btn btn-primary btn-sm mt-2 me-2',text:'Speak'});
		var stopBtn=el('button',{class:'btn btn-outline-secondary btn-sm mt-2',text:'Stop'});
		if(!window.speechSynthesis){ mount(root, el('div',{class:'alert alert-warning',text:'Speech synthesis not supported in this browser.'})); return; }
		function loadVoices(){ var voices=speechSynthesis.getVoices(); voiceSel.innerHTML=''; voices.forEach(function(v,i){ var opt=document.createElement('option'); opt.value=String(i); opt.textContent=v.name+' ('+v.lang+')'; voiceSel.appendChild(opt); }); }
		loadVoices(); speechSynthesis.onvoiceschanged=loadVoices;
		function speak(){ var u=new SpeechSynthesisUtterance(ta.value||''); var vs=speechSynthesis.getVoices(); var idx=parseInt(voiceSel.value||'0',10); if(vs[idx]) u.voice=vs[idx]; u.rate=parseFloat(rate.value||'1'); u.pitch=parseFloat(pitch.value||'1'); speechSynthesis.cancel(); speechSynthesis.speak(u); }
		speakBtn.addEventListener('click',function(){ if(speechSynthesis.getVoices().length===0){ setTimeout(speak, 250); } else { speak(); } });
		stopBtn.addEventListener('click',function(){ speechSynthesis.cancel(); });
		var controls=el('div',{},[voiceSel, el('label',{class:'form-label mt-2',text:'Rate'}), rate, el('label',{class:'form-label',text:'Pitch'}), pitch, el('div',{},[speakBtn, stopBtn])]);
		mount(root, el('div',{},[ta,controls]));
	}

	function renderSpeechToText(root){ var out=el('textarea',{class:'form-control',rows:'6',placeholder:'Transcription'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Start'}); var rec; btn.addEventListener('click',function(){ var SR=window.SpeechRecognition||window.webkitSpeechRecognition; if(!SR){ out.value='Speech recognition not supported.'; return;} if(!rec){ rec=new SR(); rec.continuous=true; rec.onresult=function(e){ var s=''; for(var i=e.resultIndex;i<e.results.length;i++){ s+=e.results[i][0].transcript; } out.value=s; }; } rec.start(); }); mount(root, el('div',{},[btn,out])); }

	function renderHTACCESS(root){ var from=el('input',{class:'form-control',placeholder:'From path (e.g., /old)'}); var to=el('input',{class:'form-control mt-2',placeholder:'To URL (e.g., https://example.com/new)'}); var code=el('textarea',{class:'form-control mt-2',rows:'8',readonly:'readonly'}); function gen(){ var f=from.value||'/old'; var t=to.value||'https://example.com/new'; code.value='RewriteEngine On\nRedirect 301 '+f+' '+t; } [from,to].forEach(function(x){x.addEventListener('input',gen);}); gen(); mount(root, el('div',{},[from,to,code,copyButton(function(){return code.value;})])); }

	function renderFancyText(root){ var ta=el('textarea',{class:'form-control',rows:'6',placeholder:'Enter text'}); var out=el('div',{class:'mt-3 row g-2'}); var maps=[['Bold',function(s){return s.replace(/[A-Z]/g,function(c){return String.fromCodePoint(c.charCodeAt(0)-65+0x1D400);}).replace(/[a-z]/g,function(c){return String.fromCodePoint(c.charCodeAt(0)-97+0x1D41A);});}],['Italic',function(s){return s.replace(/[A-Z]/g,function(c){return String.fromCodePoint(c.charCodeAt(0)-65+0x1D434);}).replace(/[a-z]/g,function(c){return String.fromCodePoint(c.charCodeAt(0)-97+0x1D44E);});}]]; function upd(){ out.innerHTML=''; maps.forEach(function(m){ var v=m[1](ta.value||''); out.appendChild(el('div',{class:'col-12'},[ el('div',{class:'card'},[ el('div',{class:'card-body'},[ el('div',{class:'small text-muted',text:m[0]}), el('div',{class:'mt-1'},[document.createTextNode(v)]), copyButton(function(){return v;}) ]) ]) ])); }); } ta.addEventListener('input',upd); upd(); mount(root, el('div',{},[ta,out])); }

	function renderRandomText(root){ var p=numberInput('Paragraphs'); p.value='1'; var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Generate'}); var out=el('div',{class:'mt-2'}); function lipsum(){ return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer vitae.'; } btn.addEventListener('click',function(){ var n=parseInt(p.value||'1',10); out.innerHTML=''; for(var i=0;i<n;i++){ out.appendChild(el('p',{},[lipsum()])); } }); mount(root, el('div',{},[p,btn,out])); }

	// Expose implementation router
	window.ToolImpl = {
		render: function(root, tool){
			switch (tool.slug) {
				case 'word-counter': return renderWordCounter(root);
				case 'character-counter': return renderCharacterCounter(root);
				case 'case-converter': return renderCaseConverter(root);
				case 'url-encoder-decoder': return renderURLCoder(root);
				case 'json-formatter': return renderJSONFormatter(root);
				case 'html-to-markdown': return renderHTMLToMarkdown(root);
				case 'markdown-to-html': return renderMarkdownToHTML(root);
				case 'css-minifier': return renderCSSMinifier(root);
				case 'js-minifier': return renderJSMinifier(root);
				case 'sql-formatter': return renderSQLFormatter(root);
				case 'color-picker': return renderColorPicker(root);
				case 'grammar-checker': return renderGrammarChecker(root);
				case 'plagiarism-checker': return renderPlagiarismChecker(root);
				case 'base64-encoder-decoder': return renderBase64(root);
				case 'ip-address-lookup': return renderIPGeolocation(root);
				case 'percentage-calculator': return renderPercentageCalculator(root);
				case 'age-calculator': return renderAgeCalculator(root);
				case 'bmi-calculator': return renderBMI(root);
				case 'loan-emi-calculator': return renderLoanEMI(root);
				case 'discount-calculator': return renderDiscountCalculator(root);
				case 'scientific-calculator': {
					var i=el('input',{class:'form-control',placeholder:'Expression (e.g., sin(0.5)+2^3)'}); var out=el('div',{class:'mt-2'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Evaluate'});
					btn.addEventListener('click',function(){ try{ var res=Function('with(Math){return '+i.value+'}'); out.textContent=String(res()); }catch(e){ out.textContent='Error'; } });
					return mount(root, el('div',{},[i,btn,out]));
				}
				case 'currency-converter': return renderCurrencyConverter(root);
				case 'time-zone-converter': return renderTimeZoneConverter(root);
				case 'binary-to-decimal': return renderBinaryToDecimal(root);
				case 'tip-calculator': return renderTipCalculator(root);
				case 'length-converter': return renderLengthConverter(root);
				case 'weight-converter': return renderWeightConverter(root);
				case 'speed-converter': return renderSpeedConverter(root);
				case 'temperature-converter': return renderTemperatureConverter(root);
				case 'volume-converter': return renderVolumeConverter(root);
				case 'data-storage-converter': return renderDataStorageConverter(root);
				case 'energy-converter': return renderEnergyConverter(root);
				case 'pressure-converter': return renderPressureConverter(root);
				case 'fuel-efficiency-converter': return renderFuelEfficiencyConverter(root);
				case 'angle-converter': return renderAngleConverter(root);
				case 'md5-generator': return renderMD5(root);
				case 'sha256-generator': return renderSHA256(root);
				case 'password-generator': return renderPasswordGenerator(root);
				case 'random-string-generator': return renderRandomString(root);
				case 'url-shortener': return renderURLShortener(root);
				case 'ip-geolocation': return renderIPGeolocation(root);
				case 'ssl-certificate-checker': return renderSSLChecker(root);
				case 'whois-lookup': return renderWhois(root);
				case 'http-headers-checker': return renderHeadersChecker(root);
				case 'privacy-policy-generator': {
					var name=el('input',{class:'form-control',placeholder:'Website name'}); var email=el('input',{class:'form-control mt-2',placeholder:'Contact email'}); var out=el('textarea',{class:'form-control mt-2',rows:'10',readonly:'readonly'}); function gen(){ out.value='Privacy Policy for '+(name.value||'My Site')+'\n\nWe value your privacy. Contact: '+(email.value||'contact@example.com')+'.'; } [name,email].forEach(function(x){x.addEventListener('input',gen);}); gen(); return mount(root, el('div',{},[name,email,out]));
				}
				case 'youtube-thumbnail-downloader': return renderYouTubeThumb(root);
				case 'instagram-photo-downloader': return renderInstagramDownloader(root);
				case 'twitter-video-downloader': return renderTwitterDownloader(root);
				case 'facebook-video-downloader': return renderFacebookDownloader(root);
				case 'tiktok-video-downloader': return renderTikTokDownloader(root);
				case 'youtube-tags-extractor': return renderYouTubeTags(root);
				case 'hashtag-generator': { var topic=el('input',{class:'form-control',placeholder:'Topic'}); var out=el('div',{class:'mt-2'}); function gen(){ var t=(topic.value||'tech'); var tags=['#'+t,'#'+t+'Tips','#'+t+'Life','#'+t+'Daily','#'+t+'Pro','#'+t+'News','#'+t+'2025']; out.textContent=tags.join(' ');} topic.addEventListener('input',gen); gen(); return mount(root, el('div',{},[topic,out])); }
				case 'social-post-generator': { var topic2=el('input',{class:'form-control',placeholder:'Topic'}); var out2=el('div',{class:'mt-2'}); function gen2(){ var t=(topic2.value||'productivity'); out2.innerHTML='<p>✅ Quick tip on '+t+': stay consistent and track progress daily.</p><p>💬 What works for you?</p>'; } topic2.addEventListener('input',gen2); gen2(); return mount(root, el('div',{},[topic2,out2])); }
				case 'emoji-keyboard': return renderEmojiKeyboard(root);
				case 'twitter-character-counter': return renderTwitterCharCounter(root);
				case 'barcode-generator': return renderBarcode(root);
				case 'meme-generator': return renderMemeGenerator(root);
				case 'resume-builder': return renderResumeBuilder(root);
				case 'invoice-generator': return renderInvoiceGenerator(root);
				case 'business-name-generator': return renderBusinessNameGenerator(root);
				case 'lottery-number-generator': return renderLottery(root);
				case 'coin-flip': return renderCoinFlip(root);
				case 'random-number-generator': return renderRandomNumber(root);
				case 'dice-roller': return renderDiceRoller(root);
				case 'internet-speed-test': return renderInternetSpeed(root);
				case 'daily-planner': return renderPlanner(root);
				case 'wedding-invitation-generator': { var names=el('input',{class:'form-control',placeholder:'Couple names'}); var date=el('input',{class:'form-control mt-2',type:'date'}); var out=el('div',{class:'card mt-3'},[el('div',{class:'card-body'},[el('div',{class:'h5',text:'You are invited!'}), el('div',{class:'mt-2',id:'inviteText'})])]); function upd(){ out.querySelector('#inviteText').textContent=(names.value||'A & B')+' invite you on '+(date.value||'DATE'); } [names,date].forEach(function(x){x.addEventListener('input',upd);}); upd(); return mount(root, el('div',{},[names,date,out])); }
				case 'story-plot-generator': { var g=el('input',{class:'form-control',placeholder:'Genre'}); var out=el('p',{class:'mt-2'}); function gen(){ var genre=(g.value||'mystery'); out.textContent='In a small town, a reluctant hero uncovers a '+genre+' conspiracy that changes everything.'; } g.addEventListener('input',gen); gen(); return mount(root, el('div',{},[g,out])); }
				case 'ebook-creator': return renderEbookCreator(root);
				case 'ai-chatbot-demo': { var ta=el('textarea',{class:'form-control',rows:'6',placeholder:'Say hi...'}); var out=el('div',{class:'mt-2'}); ta.addEventListener('input',function(){ var s=(ta.value||'').toLowerCase(); out.textContent = s.indexOf('hello')!==-1?'Hello! How can I help?': s.indexOf('help')!==-1?'Try our tools on the left.':'🤖'; }); return mount(root, el('div',{},[ta,out])); }
				case 'ip-address-tracker': return renderIPTracker(root);
				case 'fake-address-generator': return renderAddressGenerator(root);
				case 'electric-bill-calculator': return renderElectricBill(root);
				case 'leap-year-checker': return renderLeapYear(root);
				case 'name-numerology': return renderNameNumerology(root);
				case 'image-to-png': return renderImageToPNG(root);
				case 'image-to-jpg': return renderImageToJPG(root);
				case 'image-resizer': return renderImageResizer(root);
				case 'image-compressor': return renderImageCompressor(root);
				case 'image-cropper': return renderImageCropper(root);
				case 'image-to-base64': return renderImageToBase64(root);
				case 'webp-to-png': return renderWebPToPNG(root);
				case 'gif-maker': return renderGIFMaker(root);
				case 'qr-code-generator': return renderQRCode(root);
				case 'screenshot-to-pdf': return renderScreenshotToPDF(root);
				case 'meta-tag-generator': return renderMetaTagGenerator(root);
				case 'keyword-density-checker': return renderKeywordDensity(root);
				case 'sitemap-generator': return renderSitemapGenerator(root);
				case 'robots-txt-generator': return renderRobotsGenerator(root);
				case 'xml-sitemap-validator': return renderXMLSitemapValidator(root);
				case 'page-speed-checker': return renderPageSpeed(root);
				case 'mobile-friendly-test': return renderMobileFriendly(root);
				case 'google-index-checker': return renderGoogleIndexChecker(root);
				case 'domain-authority-checker': return renderDomainAuthority(root);
				case 'backlink-checker': return renderBacklinkChecker(root);
				case 'text-to-speech': return renderTextToSpeech(root);
				case 'speech-to-text': return renderSpeechToText(root);
				case 'fancy-text-generator': return renderFancyText(root);
				case 'random-text-generator': return renderRandomText(root);
				case 'htaccess-redirect-generator': return renderHTACCESS(root);
			}
			var coming = el('div', { class: 'alert alert-info' }, ['This tool is coming soon.']);
			mount(root, coming);
		}
	};

	function renderURLShortener(root){
		var input=el('input',{class:'form-control',placeholder:'Paste a long URL (https://...)'});
		var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Shorten'});
		var out=el('input',{class:'form-control mt-2',readonly:'readonly',placeholder:'Short URL will appear here'});
		var copy=copyButton(function(){return out.value;}); copy.className='btn btn-outline-secondary btn-sm mt-2 ms-2';
		var note=el('div',{class:'small text-muted mt-2',text:'Powered by is.gd public API'});
		btn.addEventListener('click',function(){
			var u=(input.value||'').trim();
			if(!/^https?:\/\//i.test(u)){ out.value='Enter a valid http(s) URL'; return; }
			fetch('https://is.gd/create.php?format=simple&url='+encodeURIComponent(u))
				.then(function(r){ if(!r.ok) throw new Error('API error'); return r.text(); })
				.then(function(t){ out.value=t; })
				.catch(function(){ out.value='Shortening failed (network/CORS).'; });
		});
		mount(root, el('div',{},[input,btn,out,copy,note]));
	}

	function renderSSLChecker(root){
		var input=el('input',{class:'form-control',placeholder:'Domain (example.com)'});
		var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Check SSL'});
		var out=el('pre',{class:'mt-2 p-3 bg-light rounded',style:'white-space:pre-wrap'});
		var note=el('div',{class:'small text-muted mt-2',text:'Powered by SSL Labs API (via CORS proxy).'});
		function proxiedJson(url){ var proxy='https://api.allorigins.win/raw?url='+encodeURIComponent(url); return fetch(proxy).then(function(r){ if(!r.ok) throw new Error('Network'); return r.json(); }); }
		function start(host){ var base='https://api.ssllabs.com/api/v3/analyze?publish=off&all=done&host='+encodeURIComponent(host); var tries=0,max=20; out.textContent='Starting analysis for '+host+'...\n'; (function poll(){ tries++; proxiedJson(base).then(function(j){ if(!j||!j.status) throw new Error('Invalid response'); out.textContent='Status: '+j.status+'\n'+JSON.stringify(j,null,2); if(j.status==='READY'||j.status==='ERROR') return; if(tries<max) setTimeout(poll,5000); }).catch(function(){ if(tries<max) setTimeout(poll,5000); else out.textContent='Unable to fetch SSL info (network/CORS).'; }); })(); }
		btn.addEventListener('click',function(){ var d=(input.value||'').trim().replace(/^https?:\/\//,''); if(!d){ out.textContent='Enter a domain'; return;} start(d); });
		mount(root, el('div',{},[input,btn,out,note]));
	}

	function renderWhois(root){ var input=el('input',{class:'form-control',placeholder:'Domain (example.com)'}); var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Open WHOIS'}); btn.addEventListener('click',function(){ var d=(input.value||'').trim(); if(!d){ return; } window.open('https://who.is/whois/'+encodeURIComponent(d),'_blank'); }); mount(root, el('div',{},[input,btn])); }
	function renderHeadersChecker(root){
		var input=el('input',{class:'form-control',placeholder:'Enter URL (https://...)'});
		var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Check Headers'});
		var out=el('div',{class:'mt-3'});
		var note=el('div',{class:'small text-muted mt-2',text:'Best-effort via public CORS proxies; some servers block proxies.'});

		function showHeaders(resp){
			var list=[]; resp.headers.forEach(function(v,k){ list.push({k:k,v:v}); });
			list.sort(function(a,b){ return a.k.localeCompare(b.k); });
			if(list.length===0){ out.innerHTML='<div class="alert alert-warning">No readable headers (proxy or server stripped them).</div>'; return; }
			var tbl=document.createElement('table'); tbl.className='table table-sm';
			var thead=document.createElement('thead'); thead.innerHTML='<tr><th>Header</th><th>Value</th></tr>'; tbl.appendChild(thead);
			var tbody=document.createElement('tbody');
			list.forEach(function(p){ var tr=document.createElement('tr'); var td1=document.createElement('td'); td1.textContent=p.k; var td2=document.createElement('td'); td2.textContent=p.v; tr.appendChild(td1); tr.appendChild(td2); tbody.appendChild(tr); });
			tbl.appendChild(tbody);
			out.innerHTML=''; out.appendChild(tbl);
		}

		function proxyFetch(url){
			var targets=[
				'https://cors.isomorphic-git.org/' + url,
				'https://api.allorigins.win/raw?url=' + encodeURIComponent(url)
			];
			var i=0; out.innerHTML='<div class="text-muted">Fetching headers...</div>';
			function next(){
				if(i>=targets.length){ out.innerHTML='<div class="alert alert-danger">Unable to fetch headers (network/CORS). Try a different URL or use a server proxy.</div>'; return; }
				fetch(targets[i], { method:'GET' })
					.then(function(r){ showHeaders(r); })
					.catch(function(){ i++; next(); });
			}
			next();
		}

		btn.addEventListener('click', function(){
			var u=(input.value||'').trim();
			if(!/^https?:\/\//i.test(u)){ out.innerHTML='<div class="alert alert-warning">Enter a valid http(s) URL</div>'; return; }
			proxyFetch(u);
		});

		mount(root, el('div',{},[input,btn,note,out]));
	}

function renderInstagramDownloader(root){
	var input=el('input',{class:'form-control',placeholder:'Paste Instagram post URL (public)'});
	var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Fetch Media'});
	var out=el('div',{class:'mt-3'});
	var note=el('div',{class:'small text-muted mt-2',text:'Uses public OG tags via CORS proxy; works only for some public posts.'});

	function fetchHtml(url){ var proxy='https://api.allorigins.win/raw?url='+encodeURIComponent(url); return fetch(proxy).then(function(r){ if(!r.ok) throw new Error('Network'); return r.text(); }); }
	function extractOg(html){ var d=document.implementation.createHTMLDocument('x'); d.documentElement.innerHTML=html; var meta=d.querySelector('meta[property="og:image"]'); return meta&&meta.getAttribute('content'); }

	btn.addEventListener('click',function(){ var u=(input.value||'').trim(); if(!/^https?:\/\//i.test(u)){ out.innerHTML='<div class="alert alert-warning">Enter a valid post URL</div>'; return; } out.innerHTML='<div class="text-muted">Fetching...</div>'; fetchHtml(u).then(function(html){ var img=extractOg(html); if(img){ out.innerHTML='<a class="btn btn-success btn-sm" href="'+img+'" target="_blank" rel="noopener">Open Image</a>'; } else { out.innerHTML='<div class="alert alert-danger">Could not extract media (private/CORS).</div>'; } }).catch(function(){ out.innerHTML='<div class="alert alert-danger">Request blocked by CORS or invalid URL.</div>'; }); });

	mount(root, el('div',{},[input,btn,note,out]));
}

function renderTwitterDownloader(root){
	var input=el('input',{class:'form-control',placeholder:'Paste X/Twitter post URL (public)'});
	var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Fetch Media'});
	var out=el('div',{class:'mt-3'});
	var note=el('div',{class:'small text-muted mt-2',text:'Attempts to extract media via oEmbed/OG tags using CORS proxy; many posts won\'t allow it.'});

	function fetchRaw(url){ var proxy='https://api.allorigins.win/raw?url='+encodeURIComponent(url); return fetch(proxy).then(function(r){ if(!r.ok) throw new Error('Network'); return r.text(); }); }
	function fetchJson(url){ var proxy='https://api.allorigins.win/raw?url='+encodeURIComponent(url); return fetch(proxy).then(function(r){ if(!r.ok) throw new Error('Network'); return r.json(); }); }
	function extractOg(html){ var d=document.implementation.createHTMLDocument('x'); d.documentElement.innerHTML=html; var meta=d.querySelector('meta[property=\"og:video\"]')||d.querySelector('meta[property=\"og:video:url\"]'); return meta&&meta.getAttribute('content'); }

	btn.addEventListener('click',function(){
		var u=(input.value||'').trim();
		if(!/^https?:\/\//i.test(u)){ out.innerHTML='<div class="alert alert-warning">Enter a valid tweet URL</div>'; return; }
		out.innerHTML='<div class="text-muted">Fetching...</div>';
		// Try oEmbed first
		fetchJson('https://publish.twitter.com/oembed?omit_script=true&url='+encodeURIComponent(u))
			.then(function(o){
				if(o && o.html){
					// Sometimes the returned HTML contains data-player or iframe src
					var container=document.createElement('div'); container.innerHTML=o.html;
					var iframe=container.querySelector('iframe');
					if(iframe && iframe.src){ out.innerHTML='<a class="btn btn-success btn-sm" target="_blank" rel="noopener" href="'+iframe.src+'">Open Player</a>'; return; }
				}
				// Fallback to OG scrape
				return fetchRaw(u).then(function(html){ var vid=extractOg(html); if(vid){ out.innerHTML='<a class="btn btn-success btn-sm" target="_blank" rel="noopener" href="'+vid+'">Open Video</a>'; } else { out.innerHTML='<div class="alert alert-danger">Could not extract media (private/CORS).</div>'; } });
			})
			.catch(function(){ out.innerHTML='<div class="alert alert-danger">Request blocked by CORS or invalid URL.</div>'; });
	});

	mount(root, el('div',{},[input,btn,note,out]));
}

function renderFacebookDownloader(root){
	var input=el('input',{class:'form-control',placeholder:'Paste Facebook video URL (public)'});
	var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Fetch Media'});
	var out=el('div',{class:'mt-3'});
	var note=el('div',{class:'small text-muted mt-2',text:'Attempts to extract media via og:video using CORS proxy; works only for some public posts/pages.'});

	function fetchRaw(url){ var proxy='https://api.allorigins.win/raw?url='+encodeURIComponent(url); return fetch(proxy).then(function(r){ if(!r.ok) throw new Error('Network'); return r.text(); }); }
	function extractOg(html){ var d=document.implementation.createHTMLDocument('x'); d.documentElement.innerHTML=html; var el1=d.querySelector('meta[property="og:video"]'), el2=d.querySelector('meta[property="og:video:url"]'); return (el1&&el1.content)||(el2&&el2.content)||null; }

	btn.addEventListener('click',function(){ var u=(input.value||'').trim(); if(!/^https?:\/\//i.test(u)){ out.innerHTML='<div class="alert alert-warning">Enter a valid video URL</div>'; return; } out.innerHTML='<div class="text-muted">Fetching...</div>'; fetchRaw(u).then(function(html){ var vid=extractOg(html); if(vid){ out.innerHTML='<a class="btn btn-success btn-sm" target="_blank" rel="noopener" href="'+vid+'">Open Video</a>'; } else { out.innerHTML='<div class="alert alert-danger">Could not extract media (private/CORS).</div>'; } }).catch(function(){ out.innerHTML='<div class="alert alert-danger">Request blocked by CORS or invalid URL.</div>'; }); });

	mount(root, el('div',{},[input,btn,note,out]));
}

function renderEbookCreator(root){
	var ta=el('textarea',{class:'form-control',rows:'8',placeholder:'Enter chapters separated by ---'});
	var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Download ZIP'});
	var note=el('div',{class:'small text-muted mt-2',text:'Creates a simple ZIP with chapter .txt files using JSZip.'});
	btn.addEventListener('click',function(){ if(!window.JSZip){ alert('JSZip not loaded'); return;} var zip=new JSZip(); var parts=(ta.value||'').split(/\n---\n/); parts.forEach(function(p,i){ zip.file('chapter-'+(i+1)+'.txt',p); }); zip.generateAsync({type:'blob'}).then(function(b){ var url=URL.createObjectURL(b); var a=document.createElement('a'); a.href=url; a.download='ebook.zip'; a.click(); setTimeout(function(){URL.revokeObjectURL(url);},800); }); });
	mount(root, el('div',{},[ta,btn,note]));
}

function renderTikTokDownloader(root){
	var input=el('input',{class:'form-control',placeholder:'Paste TikTok video URL (public)'});
	var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Fetch Media'});
	var out=el('div',{class:'mt-3'});
	var note=el('div',{class:'small text-muted mt-2',text:'Attempts to extract media via og:video using CORS proxy; works only for some public posts.'});

	function fetchRaw(url){ var proxy='https://api.allorigins.win/raw?url='+encodeURIComponent(url); return fetch(proxy).then(function(r){ if(!r.ok) throw new Error('Network'); return r.text(); }); }
	function extractOg(html){ var d=document.implementation.createHTMLDocument('x'); d.documentElement.innerHTML=html; var el1=d.querySelector('meta[property="og:video"]'), el2=d.querySelector('meta[property="og:video:url"]'); return (el1&&el1.content)||(el2&&el2.content)||null; }

	btn.addEventListener('click',function(){ var u=(input.value||'').trim(); if(!/^https?:\/\//i.test(u)){ out.innerHTML='<div class="alert alert-warning">Enter a valid video URL</div>'; return; } out.innerHTML='<div class="text-muted">Fetching...</div>'; fetchRaw(u).then(function(html){ var vid=extractOg(html); if(vid){ out.innerHTML='<a class="btn btn-success btn-sm" target="_blank" rel="noopener" href="'+vid+'">Open Video</a>'; } else { out.innerHTML='<div class="alert alert-danger">Could not extract media (private/CORS).</div>'; } }).catch(function(){ out.innerHTML='<div class="alert alert-danger">Request blocked by CORS or invalid URL.</div>'; }); });

	mount(root, el('div',{},[input,btn,note,out]));
}

function renderYouTubeTags(root){
	var input=el('input',{class:'form-control',placeholder:'Paste YouTube URL or ID'});
	var btn=el('button',{class:'btn btn-primary btn-sm mt-2',text:'Extract Tags'});
	var out=el('div',{class:'mt-3'});
	var note=el('div',{class:'small text-muted mt-2',text:'Attempts to parse page source via CORS proxy; best-effort only.'});

	function fetchRaw(url){ var proxy='https://api.allorigins.win/raw?url='+encodeURIComponent(url); return fetch(proxy).then(function(r){ if(!r.ok) throw new Error('Network'); return r.text(); }); }
	function idFrom(u){ var m=u.match(/[?&]v=([^&]+)/)||u.match(/youtu\.be\/([^?]+)/)||u.match(/^([\w-]{11})$/); return m?m[1]:null; }

	btn.addEventListener('click',function(){ var v=(input.value||'').trim(); var id=idFrom(v); if(!id){ out.innerHTML='<div class="alert alert-warning">Enter a valid video URL or 11-char ID</div>'; return; } var url='https://www.youtube.com/watch?v='+id; out.innerHTML='<div class="text-muted">Fetching...</div>'; fetchRaw(url).then(function(html){ var tags=[]; // Try ld+json
		var m=html.match(/<script type=\"application\/ld\+json\">([\s\S]*?)<\/script>/); if(m){ try{ var j=JSON.parse(m[1]); if(j && j.keywords){ tags = Array.isArray(j.keywords)?j.keywords: (typeof j.keywords==='string'?j.keywords.split(/,\s*/):[]); } }catch(e){} }
		if(tags.length===0){ // Try meta name keywords
			var m2=html.match(/<meta name=\"keywords\" content=\"([^\"]*)\"/); if(m2){ tags=m2[1].split(/,\s*/); }
		}
		if(tags.length){ out.innerHTML='<div class="badge bg-secondary me-1">'+tags.map(function(t){return t.replace(/</g,'&lt;');}).join('</div> <div class="badge bg-secondary me-1">')+'</div>'; }
		else { out.innerHTML='<div class="alert alert-danger">Could not extract tags; page blocked or tags absent.</div>'; }
	}).catch(function(){ out.innerHTML='<div class="alert alert-danger">Request blocked by CORS or invalid URL.</div>'; }); });

	mount(root, el('div',{},[input,btn,note,out]));
}

	function renderInternetSpeed(root){
		var btn=el('button',{class:'btn btn-primary btn-sm',text:'Start Test'});
		var out=el('div',{class:'mt-3'});
		var note=el('div',{class:'small text-muted mt-2',text:'Estimates download speed by fetching a test file via CDN; results vary.'});
		var sizes=[250000, 500000, 1000000]; // bytes
		function test(){
			out.textContent='Testing...';
			var totalBytes=0; var start=Date.now(); var i=0;
			function run(){
				if(i>=sizes.length){ var secs=(Date.now()-start)/1000; var mbps=(totalBytes*8/1000000)/secs; out.textContent='Approx: '+mbps.toFixed(2)+' Mbps'; return; }
				var n=sizes[i++]; var url='https://httpbin.org/bytes/'+n+'?cacheBust='+Math.random();
				fetch(url,{cache:'no-store'}).then(function(r){ if(!r.ok) throw new Error('network'); return r.arrayBuffer(); })
					.then(function(buf){ totalBytes+=buf.byteLength; run(); })
					.catch(function(){ out.textContent='Network blocked by CORS or offline.'; });
			}
			run();
		}
		btn.addEventListener('click',test);
		mount(root, el('div',{},[btn,note,out]));
	}

})();



