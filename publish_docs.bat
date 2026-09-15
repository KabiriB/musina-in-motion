@echo off
setlocal

if not exist "package.json" (
  echo ERROR: Run this script from the root of the Musina repository.
  exit /b 1
)

for /f "delims=" %%B in ('git branch --show-current') do set "BRANCH=%%B"
if /I not "%BRANCH%"=="final-polish-v2" if /I not "%BRANCH%"=="main" (
  echo ERROR: Current branch is "%BRANCH%".
  echo Publish only from final-polish-v2 during review or main after merge.
  exit /b 1
)

echo Building production site...
call npm run build
if errorlevel 1 exit /b 1

if not exist "docs" mkdir "docs"
if exist "docs\assets" rmdir /S /Q "docs\assets"
if exist "docs\data" rmdir /S /Q "docs\data"
if exist "docs\index.html" del /Q "docs\index.html"
if exist "docs\survey.html" del /Q "docs\survey.html"
if exist "docs\journeys.html" del /Q "docs\journeys.html"
if exist "docs\SOURCE_MAP_AUDIT.md" del /Q "docs\SOURCE_MAP_AUDIT.md"

xcopy /E /I /Y "dist\*" "docs\" >nul
type nul > "docs\.nojekyll"

echo.
echo docs\ refreshed from the current production build.
echo Review git status before committing:
git status --short

echo.
echo This script does not commit, push or merge.
endlocal
