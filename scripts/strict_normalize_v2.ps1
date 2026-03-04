
# Strict normalization of all image files for Windows (case-insensitive fix)

$folders = @("public\img", "dist\img")

foreach ($folder in $folders) {
    Write-Host "`n=== Normalizing $folder ===" -ForegroundColor Cyan
    Get-ChildItem -Path $folder -Recurse -File | ForEach-Object {
        $ext = $_.Extension
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($_.Name)
        
        # 1. Lowercase and normalize characters
        $newBaseName = $baseName.ToLower() -replace '[^a-z0-9]', '-' -replace '-+', '-' -replace '^-|-$', ''
        $newName = $newBaseName + $ext.ToLower()
        
        if ($_.Name -cne $newName) { # -cne is case-sensitive not equal
            $oldPath = $_.FullName
            try {
                # Rename to temp first to fight Windows case-insensitivity
                $tempName = $_.Name + ".tmp"
                Rename-Item -Path $oldPath -NewName $tempName -Force
                $tempPath = Join-Path $_.DirectoryName $tempName
                Rename-Item -Path $tempPath -NewName $newName -Force
                Write-Host "  Renamed: $($_.Name) -> $newName" -ForegroundColor Green
            } catch {
                Write-Host "  FAILED: $($_.Name) - $_" -ForegroundColor Red
            }
        }
    }
    
    # Also normalize directory names
    Get-ChildItem -Path $folder -Recurse -Directory | ForEach-Object {
        $newName = $_.Name.ToLower() -replace '[^a-z0-9]', '-' -replace '-+', '-' -replace '^-|-$', ''
        if ($_.Name -cne $newName) {
            $oldPath = $_.FullName
            try {
                $tempName = $_.Name + "_tmp"
                Rename-Item -Path $oldPath -NewName $tempName -Force
                $tempPath = Join-Path (Split-Path $_.FullName -Parent) $tempName
                Rename-Item -Path $tempPath -NewName $newName -Force
                Write-Host "  Dir Renamed: $($_.Name) -> $newName" -ForegroundColor Green
            } catch {
                Write-Host "  Dir FAILED: $($_.Name) - $_" -ForegroundColor Red
            }
        }
    }
}

Write-Host "`nNormalization Done!" -ForegroundColor Yellow
