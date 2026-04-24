
$files = Get-ChildItem "dist\img" 
$spaced = @()
foreach ($f in $files) {
    if ($f.Name -match " ") {
        $spaced += $f.Name
    }
}
if ($spaced.Count -eq 0) {
    Write-Output "No files with spaces found in dist\img"
} else {
    Write-Output "Files with spaces:"
    $spaced | ForEach-Object { Write-Output "  $_" }
}
