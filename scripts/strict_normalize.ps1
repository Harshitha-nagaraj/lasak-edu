
# Strict normalization of all image files

$folders = @("public\img", "dist\img")

foreach ($folder in $folders) {
    Write-Host "`n=== Normalizing $folder ===" -ForegroundColor Cyan
    Get-ChildItem -Path $folder -Recurse -File | ForEach-Object {
        $ext = $_.Extension
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        
        # 1. Lowercase everything
        # 2. Replace everything that isn't a letter/number with a hyphen
        # 3. Collapse multiple hyphens into one
        # 4. Trim leading/trailing hyphens
        $newBaseName = $baseName.ToLower() -replace '[^a-z0-9]', '-' -replace '-+', '-' -replace '^-|-$', ''
        $newName = $newBaseName + $ext.ToLower()
        
        if ($_.Name -ne $newName) {
            $oldPath = $_.FullName
            $newPath = Join-Path $_.DirectoryName $newName
            
            if ($oldPath -ne $newPath) {
                try {
                    Rename-Item -Path $oldPath -NewName $newName -Force
                    Write-Host "  Renamed: $($_.Name) -> $newName" -ForegroundColor Green
                } catch {
                    Write-Host "  FAILED: $($_.Name) - $_" -ForegroundColor Red
                }
            }
        }
    }
}

Write-Host "`nNormalization Done!" -ForegroundColor Yellow
