# Test deployment script for Personal Portfolio
Write-Host "Testing Personal Portfolio Deployment" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Test 1: Check if build works
Write-Host "`n1. Testing build process..." -ForegroundColor Yellow
try {
    npm run build
    Write-Host "Build successful!" -ForegroundColor Green
} catch {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

# Test 2: Check if production files exist
Write-Host "`n2. Checking production files..." -ForegroundColor Yellow
$requiredFiles = @(
    "dist/public/index.html",
    "dist/public/assets",
    "dist/index.js"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "File exists: $file" -ForegroundColor Green
    } else {
        Write-Host "File missing: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "Some production files are missing!" -ForegroundColor Red
    exit 1
}

Write-Host "`nAll tests passed! Your application is ready for deployment!" -ForegroundColor Green
