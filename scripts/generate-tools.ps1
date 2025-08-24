$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$project = Resolve-Path (Join-Path $root '..')
$toolsDir = Join-Path $project 'tools'
New-Item -ItemType Directory -Force -Path $toolsDir | Out-Null

$manifestPath = Join-Path $project 'scripts\tools-manifest.js'
$manifestJs = Get-Content $manifestPath -Raw

# Extract array between = [ ... ];
$arrayJson = $manifestJs -replace '(?s)^.*?=\s*\[','[' -replace '\];\s*$',']'
$arrayJson = $arrayJson -replace '(\w+)\s*:', '"$1":' -replace '\s*//.*','' -replace "'", '"'

try {
    $tools = $arrayJson | ConvertFrom-Json
} catch {
    Write-Error "Failed to parse tools-manifest.js into JSON."
    throw
}

function Write-ToolPage {
    param(
        [Parameter(Mandatory=$true)]$tool
    )

    $slug = $tool.slug
    $title = $tool.title
    $category = $tool.category
    $desc = $tool.description

    $path = Join-Path $toolsDir "$slug.html"
    $html = @"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>$title - Multi-Tools</title>
    <meta name="description" content="$desc">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="../css/styles.css">
</head>
<body>
    <div id="site-header"></div>

    <main class="container py-4">
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="../index.html">Home</a></li>
                <li class="breadcrumb-item">$category</li>
                <li class="breadcrumb-item active" aria-current="page">$title</li>
            </ol>
        </nav>
        
        <!-- 728x90 Banner Ad Above Tool Content -->
        <div class="container my-4 text-center ad-slot ad-728x90 mx-auto d-none d-lg-block">
            <script type="text/javascript">
                atOptions = {
                    'key' : 'c00dcdbd05dc772630140c49adc315d3',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                };
            </script>
            <script type="text/javascript" src="//www.highperformanceformat.com/c00dcdbd05dc772630140c49adc315d3/invoke.js"></script>
        </div>

        <div class="row g-4">
            <div class="col-12 col-lg-9">
                <div class="card">
                    <div class="card-body">
                        <h1 class="h4 mb-3">$title</h1>
                        <p class="text-muted small mb-4">$desc</p>

                        <div id="tool-root" data-tool-slug="$slug"></div>
                    </div>
                </div>
            </div>
            <aside class="col-12 col-lg-3">
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="ad ad-rectangle" aria-label="Advertisement" role="complementary">
                            <script type="text/javascript">
                                atOptions = {
                                    'key' : '834d1761ae55fb8c6ced009a1b3b9c00',
                                    'format' : 'iframe',
                                    'height' : 250,
                                    'width' : 300,
                                    'params' : {}
                                };
                            </script>
                            <script type="text/javascript" src="//www.highperformanceformat.com/834d1761ae55fb8c6ced009a1b3b9c00/invoke.js"></script>
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Related Tools</h5>
                        <div id="related-tools" class="small"></div>
                    </div>
                </div>
            </aside>
        </div>
    </main>
    
    <!-- 728x90 Banner Ad Below Tool Content -->
    <div class="container my-4 text-center ad-slot ad-728x90 mx-auto d-none d-lg-block">
        <script type="text/javascript">
            atOptions = {
                'key' : 'c00dcdbd05dc772630140c49adc315d3',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
            };
        </script>
        <script type="text/javascript" src="//www.highperformanceformat.com/c00dcdbd05dc772630140c49adc315d3/invoke.js"></script>
    </div>

    <div id="site-footer"></div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/crypto-js@4.2.0/crypto-js.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/marked@12.0.2/marked.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/turndown@7.1.2/dist/turndown.browser.umd.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/sql-formatter@15.3.2/dist/sql-formatter.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jsbarcode@3.11.6/dist/JsBarcode.all.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.js"></script>
    <script>window.__GIF_WORKER__='https://cdn.jsdelivr.net/npm/gif.js@0.2.0/dist/gif.worker.js';</script>
    <script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js"></script>
    <script src="../scripts/include.js?v=2"></script>
    <script src="../scripts/tools-manifest.js?v=2"></script>
    <script src="../scripts/tool-impl.js?v=2"></script>
    <script src="../scripts/tool-dispatcher.js?v=2"></script>
</body>
</html>
"@

    Set-Content -Path $path -Value $html -Encoding UTF8
}

foreach ($t in $tools) {
    Write-ToolPage -tool $t
}

Write-Host "Generated $($tools.Count) tool pages in $toolsDir"



