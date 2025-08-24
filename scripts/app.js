(function () {
	'use strict';

	var manifest = window.toolsManifest || [];

	// Global auto-slide variables
	let autoSlideInterval;
	const autoSlideSpeed = 5000; // milliseconds

	// Map categories to Bootstrap Icons and descriptions
	var categoryMeta = {
		'Image Tools': { icon: 'bi-image', description: 'Resize, convert, and optimize images' },
		'SEO Tools': { icon: 'bi-search', description: 'Analyze and improve search engine rankings' },
		'Text Tools': { icon: 'bi-fonts', description: 'Edit, format, and generate text' },
		'Developer Tools': { icon: 'bi-code-slash', description: 'Essential utilities for developers' },
		'Calculators': { icon: 'bi-calculator', description: 'Perform various computations quickly' },
		'Unit Converters': { icon: 'bi-arrow-repeat', description: 'Convert between different units of measurement' },
		'Security & Encryption': { icon: 'bi-lock', description: 'Tools for data protection and security' },
		'Social Media Tools': { icon: 'bi-share', description: 'Enhance your social media presence' },
		'Miscellaneous': { icon: 'bi-boxes', description: 'A collection of diverse and useful tools' }
	};

	function iconLetter(title){
		var ch = (title||'T').trim().charAt(0).toUpperCase();
		return /[A-Z0-9]/.test(ch) ? ch : 'T';
	}

	function createToolCard(tool) {
		var col = document.createElement('div');
		col.className = 'col';
		col.innerHTML = [
			'<a href="tools/' + tool.slug + '.html" class="tool-item d-flex flex-column justify-content-between p-4 rounded-3 h-100 animated-hover-card">',
				'<div class="d-flex align-items-center mb-3">',
					'<div class="tool-icon me-3">',
						'<i class="bi ' + (tool.icon || (categoryMeta[tool.category] ? categoryMeta[tool.category].icon : 'bi-tools')) + ' text-primary"></i>',
					'</div>',
					'<h3 class="h5 fw-bold mb-0 text-dark">' + tool.title + '</h3>',
				'</div>',
				'<p class="card-text text-muted mb-0 flex-grow-1">' + tool.description + '</p>',
				'<div class="mt-4 text-end">',
					'<span class="btn btn-sm btn-primary-gradient animated-btn">Open Tool <i class="bi bi-arrow-right ms-1"></i></span>',
				'</div>',
			'</a>'
		].join('');
		return col;
	}

	// function showToolsDropdown(categoryName, targetElement) {
    //     var dropdownPanel = document.getElementById('tools-dropdown-panel');
    //     var dropdownGrid = document.getElementById('tools-dropdown-grid');
    //     if (!dropdownPanel || !dropdownGrid) return;

    //     dropdownGrid.innerHTML = ''; // Clear previous tools
    //     var categoryTools = manifest.filter(function(tool) { return tool.category === categoryName; });
    //     categoryTools.forEach(function(tool) {
    //         var col = createToolCard(tool);
    //         dropdownGrid.appendChild(col);
    //     });

    //     // Position the dropdown panel directly below the categories carousel
    //     var carouselContainer = document.querySelector('.categories-carousel-container');
    //     if (carouselContainer) {
    //         var rect = carouselContainer.getBoundingClientRect();
    //         dropdownPanel.style.top = (rect.bottom + window.scrollY) + 'px';
    //         dropdownPanel.style.left = rect.left + 'px';
    //         dropdownPanel.style.width = rect.width + 'px';
    //     }

    //     dropdownPanel.classList.add('show');
    // }

    // function hideToolsDropdown() {
    //     var dropdownPanel = document.getElementById('tools-dropdown-panel');
    //     if (dropdownPanel) {
    //         dropdownPanel.classList.remove('show');
    //     }
    // }

	function startAutoSlide(carousel) {
		stopAutoSlide(); // Ensure only one interval runs at a time
		autoSlideInterval = setInterval(() => {
			if (carousel.scrollWidth - carousel.scrollLeft === carousel.clientWidth) {
				carousel.scrollTo({ left: 0, behavior: 'smooth' });
			} else {
				carousel.scrollBy({ left: 200, behavior: 'smooth' });
			}
		}, autoSlideSpeed);
	}

	function stopAutoSlide() {
		clearInterval(autoSlideInterval);
	}

	function renderCategories() {
		var categories = {};
		manifest.forEach(function (t) {
			if (!categories[t.category]) categories[t.category] = { count: 0, description: categoryMeta[t.category] ? categoryMeta[t.category].description : 'Diverse tools for various needs.', icon: categoryMeta[t.category] ? categoryMeta[t.category].icon : 'bi-tools' };
			categories[t.category].count += 1;
		});

		var container = document.getElementById('dynamic-categories-carousel');
		if (!container) return;
		container.innerHTML = ''; // Clear existing content

		// Add an "All Categories" card
		var allCategoriesCard = document.createElement('div');
		allCategoriesCard.className = 'category-item';
		allCategoriesCard.innerHTML = [
			'<a href="#" class="category-card d-block p-4 rounded-3 h-100 animated-hover-card active-category" data-category="all">',
				'<div class="category-icon mb-3">',
					'<i class="bi bi-grid-fill text-primary display-5"></i>',
				'</div>',
				'<h3 class="h5 fw-bold mb-2 text-dark">All Tools</h3>',
				'<p class="text-muted mb-0">View all ' + manifest.length + ' tools.</p>',
				'<div class="category-stats text-primary fw-bold mt-3"></div>',
			'</a>'
		].join('');
		container.appendChild(allCategoriesCard);

		Object.keys(categories).forEach(function (cName) {
			var category = categories[cName];
			var col = document.createElement('div');
			col.className = 'category-item'; // Use category-item for horizontal layout
			col.innerHTML = [
				'<a href="#" class="category-card d-block p-4 rounded-3 h-100 animated-hover-card" data-category="' + cName + '">',
					'<div class="category-icon mb-3">',
						'<i class="bi ' + category.icon + ' text-primary display-5"></i>',
					'</div>',
					'<h3 class="h5 fw-bold mb-2 text-dark">' + cName + '</h3>',
					'<p class="text-muted mb-0">' + category.description + '</p>',
					'<div class="category-stats text-primary fw-bold mt-3">' + category.count + ' Tools</div>',
				'</a>'
			].join('');
			container.appendChild(col);
		});

		// Add click event listener to category cards for filtering
        container.addEventListener('click', function (e) {
            var targetCard = e.target.closest('.category-card');
            if (targetCard && targetCard.dataset && targetCard.dataset.category) {
                e.preventDefault();
                var selectedCategory = targetCard.dataset.category;

                // Remove active class from all category cards
                document.querySelectorAll('.category-card').forEach(card => {
                    card.classList.remove('active-category');
                });

                // Add active class to the clicked category card
                targetCard.classList.add('active-category');

                if (selectedCategory === 'all') {
                    renderToolsGrid(); // Show all tools
                } else {
                    renderToolsGrid(function(tool) {
                        return tool.category === selectedCategory;
                    });
                }
            }
        });

		// Carousel navigation
        const carousel = document.getElementById('dynamic-categories-carousel');
        const prevBtn = document.querySelector('.carousel-prev');
        const nextBtn = document.querySelector('.carousel-next');

        if (carousel && prevBtn && nextBtn) {
            // Calculate scroll amount dynamically based on the first category item's width and gap
            const firstCategoryItem = carousel.querySelector('.category-item');
            let scrollAmount = 324; // Default to 324px (300px width + 24px gap)

            if (firstCategoryItem) {
                const itemWidth = firstCategoryItem.offsetWidth;
                const computedStyle = window.getComputedStyle(carousel);
                const gap = parseFloat(computedStyle.gap);
                scrollAmount = itemWidth + gap;
            }

            prevBtn.addEventListener('click', function() {
                stopAutoSlide();
                carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                setTimeout(() => startAutoSlide(carousel), autoSlideSpeed * 2);
            });

            nextBtn.addEventListener('click', function() {
                stopAutoSlide();
                carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                setTimeout(() => startAutoSlide(carousel), autoSlideSpeed * 2);
            });
            carousel.addEventListener('mouseenter', stopAutoSlide);
            carousel.addEventListener('mouseleave', () => startAutoSlide(carousel));
        }

        // Start auto-slide after a small delay to ensure elements are rendered
        if (carousel) {
            console.log("Carousel scrollWidth: " + carousel.scrollWidth + ", clientWidth: " + carousel.clientWidth); // Diagnostic log
            setTimeout(() => startAutoSlide(carousel), 500);
        }
	}

	function renderToolsGrid(filterFn) {
		var grid = document.getElementById('tools-grid');
		if (!grid) return;
		grid.innerHTML = '';
		var items = manifest;
		if (typeof filterFn === 'function') items = manifest.filter(filterFn);
		items.forEach(function (tool) { grid.appendChild(createToolCard(tool)); });
	}

	function installSearch() {
		var input = document.getElementById('tool-search');
		var searchButton = document.querySelector('.search-container .btn');

		function apply(query) {
			var q = (query || '').toLowerCase().trim();
			if (!q) return renderToolsGrid();
			renderToolsGrid(function (t) {
				return t.title.toLowerCase().indexOf(q) !== -1 ||
					t.slug.toLowerCase().indexOf(q) !== -1 ||
					t.category.toLowerCase().indexOf(q) !== -1 ||
					(t.description || '').toLowerCase().indexOf(q) !== -1;
			});
		}
		if (input) {
			input.addEventListener('input', function (e) { apply(e.target.value); });
			input.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') {
                    apply(e.target.value);
                }
            });
		}
		if (searchButton) {
            searchButton.addEventListener('click', function () {
                apply(input.value);
            });
        }
		document.addEventListener('tools:search', function (e) { apply(e.detail); });
	}

	function setupButtonActions() {
        var startUsingToolsBtn = document.querySelector('.hero-actions .btn-primary');
        var exploreCategoriesBtn = document.querySelector('.hero-actions .btn-outline-light');
        var launchToolsCtaBtn = document.querySelector('.cta-buttons .btn-light');
        var learnMoreCtaBtn = document.querySelector('.cta-buttons .btn-outline-light');

        if (startUsingToolsBtn) {
            startUsingToolsBtn.addEventListener('click', function() {
                document.getElementById('tools-section').scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (exploreCategoriesBtn) {
            exploreCategoriesBtn.addEventListener('click', function() {
                document.getElementById('categories-section').scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (launchToolsCtaBtn) {
            launchToolsCtaBtn.addEventListener('click', function() {
                document.getElementById('tools-section').scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (learnMoreCtaBtn) {
            learnMoreCtaBtn.addEventListener('click', function() {
                window.location.href = 'article.html';
            });
        }
	}

	function init(){
		renderCategories();
		renderToolsGrid();
		installSearch();
		// renderFeatured(); // Featured section removed from HTML
		setupButtonActions();
		
		// Initialize scroll-to actions for all buttons with data-scroll-to attribute
        document.querySelectorAll('[data-scroll-to]').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-scroll-to');
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();



