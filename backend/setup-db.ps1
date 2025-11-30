#!/usr/bin/env pwsh
Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "ECO300 - Database Setup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Step 1: Setting environment variable..." -ForegroundColor Yellow
$env:DATABASE_URL = "postgresql://postgres:admin123@localhost:5433/economia"

Write-Host "Step 2: Generating Prisma Client..." -ForegroundColor Yellow
& npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to generate Prisma Client" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Step 3: Pushing schema to database..." -ForegroundColor Yellow
& npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to push schema" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Step 4: Seeding database with demo data..." -ForegroundColor Yellow
& npm run db:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to seed database" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Demo credentials:" -ForegroundColor Cyan
Write-Host "  admin@test.com / 123456" -ForegroundColor White
Write-Host ""
Read-Host "Press Enter to exit"
