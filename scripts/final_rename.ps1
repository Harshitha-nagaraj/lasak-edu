
# Also rename dist\img files (the build copies fresh from public\img)
# But we already renamed public\img. The build re-copies from public/img.
# So we need to rename all spaced files in dist\img that may not have been renamed.

$folders = @("dist\img", "public\img")

foreach ($folder in $folders) {
    Write-Output "=== $folder ==="
    $files = Get-ChildItem $folder
    foreach ($f in $files) {
        if ($f.Name -match " ") {
            $newName = $f.Name -replace " ", "-"
            Rename-Item -Path $f.FullName -NewName $newName
            Write-Output "  Renamed: $($f.Name) -> $newName"
        }
    }
}
Write-Output "Done"
