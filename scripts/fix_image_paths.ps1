
# Fix all image path references with spaces to use hyphens

$files = Get-ChildItem -Path "." -Include "*.tsx","*.ts","*.css","*.html","*.json" -Recurse | 
    Where-Object { $_.FullName -notmatch "\\node_modules\\" -and $_.FullName -notmatch "\\dist\\" }

# Map of old name -> new name (space/dot patterns to hyphens)
$replacements = @{
    "/img/ASHOK G.webp"                 = "/img/ASHOK-G.webp"
    "/img/Mr. DHARSAN V.webp"           = "/img/Mr-DHARSAN-V.webp"
    "/img/Mr. GANESHPRADEEP .V.webp"    = "/img/Mr-GANESHPRADEEP-V.webp"
    "/img/Mr. LOKKESH V.webp"           = "/img/Mr-LOKKESH-V.webp"
    "/img/Mr. RUTHRESH V.webp"          = "/img/Mr-RUTHRESH-V.webp"
    "/img/Mr. SURYA M.webp"             = "/img/Mr-SURYA-M.webp"
    "/img/Mr. Syed Sharukh.webp"        = "/img/Mr-Syed-Sharukh.webp"
    "/img/saravana kumar r.webp"        = "/img/saravana-kumar-r.webp"
    "/img/vishnu lakshmi s.webp"        = "/img/vishnu-lakshmi-s.webp"
    "/img/loga prasath p.jpeg"          = "/img/loga-prasath-p.jpeg"
    "/img/about 1.webp"                 = "/img/about-1.webp"
    "/img/mou jct.webp"                 = "/img/mou-jct.webp"
    "/img/nellakottai clg.webp"         = "/img/nellakottai-clg.webp"
    "/img/KGISL Mechanical Students.webp" = "/img/KGISL-Mechanical-Students.webp"
    "/img/Design Workshops.webp"        = "/img/Design-Workshops.webp"
    "/img/Collaboration Zones.webp"     = "/img/Collaboration-Zones.webp"
    "/img/Mr. ANISH JOSEPH C.jpeg"      = "/img/Mr-ANISH-JOSEPH-C.jpeg"
    "/img/Mr. GANESHPRADEEP V.webp"     = "/img/Mr-GANESHPRADEEP-V.webp"
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -Encoding UTF8
    $changed = $false
    
    foreach ($old in $replacements.Keys) {
        $new = $replacements[$old]
        if ($content -like "*$old*") {
            $content = $content.Replace($old, $new)
            Write-Host "  Fixed '$old' in $($file.Name)" -ForegroundColor Green
            $changed = $true
        }
    }
    
    if ($changed) {
        Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
    }
}

Write-Host "`nAll source files updated!" -ForegroundColor Yellow
