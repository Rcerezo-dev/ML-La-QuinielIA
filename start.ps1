Write-Host "Starting La QuinielIA..." -ForegroundColor Green
Write-Host ""
Write-Host "[1/2] Starting Backend (Flask API on port 8000)..." -ForegroundColor Cyan
Start-Process python -ArgumentList "api.py"
Start-Sleep -Milliseconds 500

Write-Host "[2/2] Starting Frontend (Vite on port 5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
Start-Sleep -Milliseconds 500

Write-Host ""
Write-Host "Both services are starting!" -ForegroundColor Green
Write-Host "Backend: http://localhost:8000" -ForegroundColor Yellow
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "API Docs: http://localhost:8000/docs" -ForegroundColor Yellow
