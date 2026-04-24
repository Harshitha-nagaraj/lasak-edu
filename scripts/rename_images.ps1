
# Rename files with spaces in both public/img and dist/img

$folders = @("public\img", "dist\img")

foreach ($folder in $folders) {
    Write-Host "`n=== Processing $folder ===" -ForegroundColor Cyan
    
    # Get all files with spaces recursively
    Get-ChildItem -Path $folder -Recurse -File | Where-Object { $_.Name -match ' ' } | ForEach-Object {
        $oldName = $_.FullName
        $newName = Join-Path $_.DirectoryName ($_.Name -replace ' ', '-')
        
        if ($oldName -ne $newName) {
            try {
                Rename-Item -Path $oldName -NewName ([System.IO.Path]::GetFileName($newName)) -Force
                Write-Host "  Renamed: $($_.Name) -> $([System.IO.Path]::GetFileName($newName))" -ForegroundColor Green
            } catch {
                Write-Host "  FAILED: $($_.Name) - $_" -ForegroundColor Red
            }
        }
    }
    
    # Also handle dots in names except the extension
    Get-ChildItem -Path $folder -Recurse -File | Where-Object { 
        $nameWithoutExt = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $nameWithoutExt -match '\.'
    } | ForEach-Object {
        $ext = $_.Extension
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        $newBaseName = $baseName -replace '\.', '-'
        $newName = $newBaseName + $ext
        
        if ($_.Name -ne $newName) {
            try {
                Rename-Item -Path $_.FullName -NewName $newName -Force
                Write-Host "  Renamed: $($_.Name) -> $newName" -ForegroundColor Green
            } catch {
                Write-Host "  FAILED: $($_.Name) - $_" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`nDone!" -ForegroundColor Yellow
