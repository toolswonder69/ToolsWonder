// Central catalog of tools with category, slug, title, and description
window.toolsManifest = [
	// Image Tools 1-10
	{ id: 1, slug: 'image-to-png', title: 'Image to PNG Converter', category: 'Image Tools', description: 'Convert images to PNG format.', icon: 'bi-file-earmark-image' },
	{ id: 2, slug: 'image-to-jpg', title: 'Image to JPG Converter', category: 'Image Tools', description: 'Convert images to JPG format.', icon: 'bi-file-earmark-image' },
	{ id: 3, slug: 'image-resizer', title: 'Image Resizer', category: 'Image Tools', description: 'Resize images to custom dimensions.', icon: 'bi-arrows-fullscreen' },
	{ id: 4, slug: 'image-compressor', title: 'Image Compressor', category: 'Image Tools', description: 'Compress images to reduce size.', icon: 'bi-file-earmark-zip' },
	{ id: 5, slug: 'image-cropper', title: 'Image Cropper', category: 'Image Tools', description: 'Crop images to desired area.', icon: 'bi-crop' },
	{ id: 6, slug: 'image-to-base64', title: 'Convert Image to Base64', category: 'Image Tools', description: 'Convert image files to Base64 strings.', icon: 'bi-file-code' },
	{ id: 7, slug: 'webp-to-png', title: 'Convert WebP to PNG', category: 'Image Tools', description: 'Change WebP images to PNG.', icon: 'bi-file-earmark-image-fill' },
	{ id: 8, slug: 'gif-maker', title: 'GIF Maker', category: 'Image Tools', description: 'Create GIFs from images.', icon: 'bi-filetype-gif' },
	{ id: 9, slug: 'qr-code-generator', title: 'QR Code Generator', category: 'Image Tools', description: 'Generate QR codes from text or URLs.', icon: 'bi-qr-code' },
	{ id: 10, slug: 'screenshot-to-pdf', title: 'Screenshot to PDF', category: 'Image Tools', description: 'Convert images/screenshots to PDF.', icon: 'bi-file-earmark-pdf' },

	// SEO Tools 11-20
	{ id: 11, slug: 'meta-tag-generator', title: 'Meta Tag Generator', category: 'SEO Tools', description: 'Generate SEO meta tags for pages.', icon: 'bi-tags' },
	{ id: 12, slug: 'keyword-density-checker', title: 'Keyword Density Checker', category: 'SEO Tools', description: 'Analyze keyword usage in text.', icon: 'bi-hourglass-split' },
	{ id: 13, slug: 'sitemap-generator', title: 'Sitemap Generator', category: 'SEO Tools', description: 'Create XML sitemaps.', icon: 'bi-diagram-3' },
	{ id: 14, slug: 'robots-txt-generator', title: 'Robots.txt Generator', category: 'SEO Tools', description: 'Generate robots.txt rules.', icon: 'bi-filetype-txt' },
	{ id: 15, slug: 'google-index-checker', title: 'Google Index Checker', category: 'SEO Tools', description: 'Check if a page is indexed (placeholder).', icon: 'bi-google' },
	{ id: 16, slug: 'domain-authority-checker', title: 'Domain Authority Checker', category: 'SEO Tools', description: 'Estimate domain authority (placeholder).', icon: 'bi-shield-check' },
	{ id: 17, slug: 'backlink-checker', title: 'Backlink Checker', category: 'SEO Tools', description: 'Analyze backlinks (placeholder).', icon: 'bi-link-45deg' },
	{ id: 18, slug: 'page-speed-checker', title: 'Page Speed Checker', category: 'SEO Tools', description: 'Measure page speed (placeholder).', icon: 'bi-speedometer' },
	{ id: 19, slug: 'xml-sitemap-validator', title: 'XML Sitemap Validator', category: 'SEO Tools', description: 'Validate XML sitemap.', icon: 'bi-code-slash' },
	{ id: 20, slug: 'mobile-friendly-test', title: 'Mobile-Friendly Test', category: 'SEO Tools', description: 'Check mobile usability (placeholder).', icon: 'bi-phone' },

	// Text Tools 21-30
	{ id: 21, slug: 'word-counter', title: 'Word Counter', category: 'Text Tools', description: 'Count words and characters.', icon: 'bi-journal-text' },
	{ id: 22, slug: 'character-counter', title: 'Character Counter', category: 'Text Tools', description: 'Count characters.', icon: 'bi-text-paragraph' },
	{ id: 23, slug: 'case-converter', title: 'Case Converter', category: 'Text Tools', description: 'Convert text case.', icon: 'bi-fonts' },
	{ id: 24, slug: 'plagiarism-checker', title: 'Plagiarism Checker', category: 'Text Tools', description: 'Detect duplicate text (placeholder).', icon: 'bi-journal-x' },
	{ id: 25, slug: 'grammar-checker', title: 'Grammar Checker', category: 'Text Tools', description: 'Check grammar (placeholder).', icon: 'bi-spellcheck' },
	{ id: 26, slug: 'text-to-speech', title: 'Text-to-Speech', category: 'Text Tools', description: 'Convert text to speech.', icon: 'bi-volume-up' },
	{ id: 27, slug: 'speech-to-text', title: 'Speech-to-Text', category: 'Text Tools', description: 'Transcribe speech (browser).', icon: 'bi-mic' },
	{ id: 28, slug: 'url-encoder-decoder', title: 'URL Encoder & Decoder', category: 'Text Tools', description: 'Encode or decode URLs.', icon: 'bi-link' },
	{ id: 29, slug: 'fancy-text-generator', title: 'Fancy Text Generator', category: 'Text Tools', description: 'Stylize and decorate text.', icon: 'bi-palette' },
	{ id: 30, slug: 'random-text-generator', title: 'Random Text Generator', category: 'Text Tools', description: 'Generate random paragraphs.', icon: 'bi-shuffle' },

	// Developer Tools 31-40
	{ id: 31, slug: 'json-formatter', title: 'JSON Formatter', category: 'Developer Tools', description: 'Format and validate JSON.', icon: 'bi-braces' },
	{ id: 32, slug: 'html-to-markdown', title: 'HTML to Markdown Converter', category: 'Developer Tools', description: 'Convert HTML to Markdown.', icon: 'bi-code-square' },
	{ id: 33, slug: 'css-minifier', title: 'CSS Minifier', category: 'Developer Tools', description: 'Minify CSS code.', icon: 'bi-filetype-css' },
	{ id: 34, slug: 'js-minifier', title: 'JavaScript Minifier', category: 'Developer Tools', description: 'Minify JavaScript code.', icon: 'bi-filetype-js' },
	{ id: 35, slug: 'sql-formatter', title: 'SQL Formatter', category: 'Developer Tools', description: 'Format SQL queries.', icon: 'bi-database' },
	{ id: 36, slug: 'htaccess-redirect-generator', title: 'HTACCESS Redirect Generator', category: 'Developer Tools', description: 'Generate .htaccess redirects.', icon: 'bi-arrow-right-square' },
	{ id: 37, slug: 'markdown-to-html', title: 'Markdown to HTML Converter', category: 'Developer Tools', description: 'Convert Markdown to HTML.', icon: 'bi-markdown' },
	{ id: 38, slug: 'color-picker', title: 'Color Code Picker', category: 'Developer Tools', description: 'Pick color codes.', icon: 'bi-eyedropper' },
	{ id: 39, slug: 'base64-encoder-decoder', title: 'Base64 Encoder & Decoder', category: 'Developer Tools', description: 'Encode/decode Base64.', icon: 'bi-file-earmark-binary' },
	{ id: 40, slug: 'ip-address-lookup', title: 'IP Address Lookup', category: 'Developer Tools', description: 'Lookup IP address info (placeholder).', icon: 'bi-geo-alt' },

	// Math & Calculators 41-50
	{ id: 41, slug: 'percentage-calculator', title: 'Percentage Calculator', category: 'Calculators', description: 'Compute percentages.', icon: 'bi-percent' },
	{ id: 42, slug: 'age-calculator', title: 'Age Calculator', category: 'Calculators', description: 'Calculate age from DOB.', icon: 'bi-calendar-date' },
	{ id: 43, slug: 'bmi-calculator', title: 'BMI Calculator', category: 'Calculators', description: 'Compute BMI from height/weight.', icon: 'bi-person-bounding-box' },
	{ id: 44, slug: 'loan-emi-calculator', title: 'Loan EMI Calculator', category: 'Calculators', description: 'Calculate monthly installments.', icon: 'bi-cash-stack' },
	{ id: 45, slug: 'scientific-calculator', title: 'Scientific Calculator', category: 'Calculators', description: 'Scientific calculator (basic).', icon: 'bi-calculator' },
	{ id: 46, slug: 'discount-calculator', title: 'Discount Calculator', category: 'Calculators', description: 'Calculate discounts.', icon: 'bi-tag-fill' },
	{ id: 47, slug: 'currency-converter', title: 'Currency Converter', category: 'Calculators', description: 'Convert currencies (placeholder).', icon: 'bi-currency-exchange'},
	{ id: 48, slug: 'time-zone-converter', title: 'Time Zone Converter', category: 'Calculators', description: 'Convert time zones (placeholder).', icon: 'bi-globe'},
	{ id: 49, slug: 'binary-to-decimal', title: 'Binary to Decimal Converter', category: 'Calculators', description: 'Convert binary to decimal.', icon: 'bi-calculator-fill' },
	{ id: 50, slug: 'tip-calculator', title: 'Tip Calculator', category: 'Calculators', description: 'Calculate tips quickly.', icon: 'bi-wallet' },

	// Unit Converters 51-60
	{ id: 51, slug: 'length-converter', title: 'Length Converter', category: 'Unit Converters', description: 'Convert length units.', icon: 'bi-rulers' },
	{ id: 52, slug: 'weight-converter', title: 'Weight Converter', category: 'Unit Converters', description: 'Convert weight units.', icon: 'bi-hand-index-thumb' },
	{ id: 53, slug: 'speed-converter', title: 'Speed Converter', category: 'Unit Converters', description: 'Convert speed units.', icon: 'bi-speedometer2' },
	{ id: 54, slug: 'temperature-converter', title: 'Temperature Converter', category: 'Unit Converters', description: 'Convert temperature units.', icon: 'bi-thermometer-half' },
	{ id: 55, slug: 'volume-converter', title: 'Volume Converter', category: 'Unit Converters', description: 'Convert volume units.', icon: 'bi-box' },
	{ id: 56, slug: 'data-storage-converter', title: 'Data Storage Converter', category: 'Unit Converters', description: 'Convert data units.', icon: 'bi-server' },
	{ id: 57, slug: 'energy-converter', title: 'Energy Converter', category: 'Unit Converters', description: 'Convert energy units.', icon: 'bi-lightning-charge' },
	{ id: 58, slug: 'pressure-converter', title: 'Pressure Converter', category: 'Unit Converters', description: 'Convert pressure units.', icon: 'bi-speedometer' },
	{ id: 59, slug: 'fuel-efficiency-converter', title: 'Fuel Efficiency Converter', category: 'Unit Converters', description: 'Convert fuel efficiency.', icon: 'bi-fuel-pump' },
	{ id: 60, slug: 'angle-converter', title: 'Angle Converter', category: 'Unit Converters', description: 'Convert angles.', icon: 'bi-compass' },

	// Security & Encryption 61-70
	{ id: 61, slug: 'md5-generator', title: 'MD5 Hash Generator', category: 'Security & Encryption', description: 'Create MD5 hashes.', icon: 'bi-file-earmark-lock' },
	{ id: 62, slug: 'sha256-generator', title: 'SHA256 Hash Generator', category: 'Security & Encryption', description: 'Create SHA-256 hashes.', icon: 'bi-file-earmark-lock' },
	{ id: 63, slug: 'password-generator', title: 'Password Generator', category: 'Security & Encryption', description: 'Generate strong passwords.', icon: 'bi-key' },
	{ id: 64, slug: 'random-string-generator', title: 'Random String Generator', category: 'Security & Encryption', description: 'Generate random strings.', icon: 'bi-shuffle' },
	{ id: 65, slug: 'url-shortener', title: 'URL Shortener', category: 'Security & Encryption', description: 'Shorten URLs (placeholder).', icon: 'bi-link-45deg' },
	{ id: 66, slug: 'ip-geolocation', title: 'IP Geolocation Finder', category: 'Security & Encryption', description: 'Find IP geolocation (placeholder).', icon: 'bi-geo-alt' },
	{ id: 67, slug: 'ssl-certificate-checker', title: 'SSL Certificate Checker', category: 'Security & Encryption', description: 'Check SSL cert (placeholder).', icon: 'bi-lock-fill' },
	{ id: 68, slug: 'whois-lookup', title: 'Whois Lookup', category: 'Security & Encryption', description: 'Query domain whois (placeholder).', icon: 'bi-person-lines-fill' },
	{ id: 69, slug: 'http-headers-checker', title: 'HTTP Headers Checker', category: 'Security & Encryption', description: 'Inspect HTTP headers (placeholder).', icon: 'bi-file-earmark-code' },
	{ id: 70, slug: 'privacy-policy-generator', title: 'Privacy Policy Generator', category: 'Security & Encryption', description: 'Generate privacy policy.', icon: 'bi-shield-fill-check' },

	// Social Media Tools 71-80
	{ id: 71, slug: 'youtube-thumbnail-downloader', title: 'YouTube Thumbnail Downloader', category: 'Social Media Tools', description: 'Download YouTube thumbnails.', icon: 'bi-youtube' },
	{ id: 72, slug: 'instagram-photo-downloader', title: 'Instagram Photo Downloader', category: 'Social Media Tools', description: 'Download Instagram photos (placeholder).', icon: 'bi-instagram' },
	{ id: 73, slug: 'twitter-video-downloader', title: 'Twitter Video Downloader', category: 'Social Media Tools', description: 'Download Twitter videos (placeholder).', icon: 'bi-twitter' },
	{ id: 74, slug: 'facebook-video-downloader', title: 'Facebook Video Downloader', category: 'Social Media Tools', description: 'Download FB videos (placeholder).', icon: 'bi-facebook' },
	{ id: 75, slug: 'tiktok-video-downloader', title: 'TikTok Video Downloader', category: 'Social Media Tools', description: 'Download TikTok videos (placeholder).', icon: 'bi-tiktok' },
	{ id: 76, slug: 'youtube-tags-extractor', title: 'YouTube Tags Extractor', category: 'Social Media Tools', description: 'Extract tags from videos (placeholder).', icon: 'bi-tag' },
	{ id: 77, slug: 'hashtag-generator', title: 'Hashtag Generator', category: 'Social Media Tools', description: 'Generate hashtags.', icon: 'bi-hash' },
	{ id: 78, slug: 'social-post-generator', title: 'Social Media Post Generator', category: 'Social Media Tools', description: 'Create post ideas.', icon: 'bi-share-fill' },
	{ id: 79, slug: 'emoji-keyboard', title: 'Emoji Keyboard', category: 'Social Media Tools', description: 'Copy emoji quickly.', icon: 'bi-emoji-smile' },
	{ id: 80, slug: 'twitter-character-counter', title: 'Twitter Character Counter', category: 'Social Media Tools', description: 'Count characters for X/Twitter.', icon: 'bi-pencil-square' },

	// Miscellaneous 81-100
	{ id: 81, slug: 'barcode-generator', title: 'Barcode Generator', category: 'Miscellaneous', description: 'Generate barcodes.', icon: 'bi-barcode' },
	{ id: 82, slug: 'meme-generator', title: 'Meme Generator', category: 'Miscellaneous', description: 'Create memes with text.', icon: 'bi-image-fill' },
	{ id: 83, slug: 'resume-builder', title: 'Resume Builder', category: 'Miscellaneous', description: 'Build simple resumes.', icon: 'bi-file-earmark-person' },
	{ id: 84, slug: 'invoice-generator', title: 'Invoice Generator', category: 'Miscellaneous', description: 'Create invoices.', icon: 'bi-receipt' },
	{ id: 85, slug: 'business-name-generator', title: 'Business Name Generator', category: 'Miscellaneous', description: 'Generate business names.', icon: 'bi-building' },
	{ id: 86, slug: 'lottery-number-generator', title: 'Lottery Number Generator', category: 'Miscellaneous', description: 'Generate lottery numbers.', icon: 'bi-cash' },
	{ id: 87, slug: 'coin-flip', title: 'Flip a Coin Simulator', category: 'Miscellaneous', description: 'Flip a virtual coin.', icon: 'bi-coin' },
	{ id: 88, slug: 'random-number-generator', title: 'Random Number Generator', category: 'Miscellaneous', description: 'Generate random numbers.', icon: 'bi-dice-5' },
	{ id: 89, slug: 'dice-roller', title: 'Dice Roller Simulator', category: 'Miscellaneous', description: 'Roll one or more dice.', icon: 'bi-dice-3' },
	{ id: 90, slug: 'internet-speed-test', title: 'Internet Speed Test', category: 'Miscellaneous', description: 'Browser speed test (placeholder).', icon: 'bi-speedometer' },
	{ id: 91, slug: 'daily-planner', title: 'Daily Planner Creator', category: 'Miscellaneous', description: 'Plan daily tasks.', icon: 'bi-calendar-check' },
	{ id: 92, slug: 'wedding-invitation-generator', title: 'Wedding Invitation Generator', category: 'Miscellaneous', description: 'Generate invitations.', icon: 'bi-heart' },
	{ id: 93, slug: 'story-plot-generator', title: 'Story Plot Generator', category: 'Miscellaneous', description: 'Generate story ideas.', icon: 'bi-book-half' },
	{ id: 94, slug: 'ebook-creator', title: 'E-book Creator', category: 'Miscellaneous', description: 'Create simple EPUB (placeholder).', icon: 'bi-book' },
	{ id: 95, slug: 'ai-chatbot-demo', title: 'AI Chatbot Demo', category: 'Miscellaneous', description: 'Basic rule-based chatbot.', icon: 'bi-robot' },
	{ id: 96, slug: 'ip-address-tracker', title: 'IP Address Tracker', category: 'Miscellaneous', description: 'Track IP requests (placeholder).', icon: 'bi-globe' },
	{ id: 97, slug: 'fake-address-generator', title: 'Fake Address Generator', category: 'Miscellaneous', description: 'Generate random addresses.', icon: 'bi-house' },
	{ id: 98, slug: 'electric-bill-calculator', title: 'Calculator for Electric Bills', category: 'Miscellaneous', description: 'Estimate electricity bills.', icon: 'bi-lightbulb' },
	{ id: 99, slug: 'leap-year-checker', title: 'Leap Year Checker', category: 'Miscellaneous', description: 'Check leap years.', icon: 'bi-calendar-event' },
	{ id: 100, slug: 'name-numerology', title: 'Name to Numerology Calculator', category: 'Miscellaneous', description: 'Compute numerology values.', icon: 'bi-infinity' }
];



