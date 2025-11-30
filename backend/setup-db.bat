@echo off
echo ========================================
echo ECO300 - Database Setup Script
echo ========================================
echo.

echo Step 1: Setting environment variable...
set DATABASE_URL=postgresql://postgres:admin123@localhost:5433/economia

echo Step 2: Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate Prisma Client
    pause
    exit /b 1
)

echo Step 3: Pushing schema to database...
call npx prisma db push
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to push schema
    pause
    exit /b 1
)

echo Step 4: Seeding database with demo data...
call npm run db:seed
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to seed database
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ Database setup complete!
echo ========================================
echo.
echo Demo credentials:
echo   admin@test.com / 123456
echo.
pause
