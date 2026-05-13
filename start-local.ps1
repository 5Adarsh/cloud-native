# Script to run all services locally without Docker
Write-Host "Starting all services locally using in-memory MongoDB fallback..."

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd user-service; echo 'Starting User Service...'; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd product-service; echo 'Starting Product Service...'; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd cart-service; echo 'Starting Cart Service...'; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd order-service; echo 'Starting Order Service...'; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd payment-service; echo 'Starting Payment Service...'; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd api-gateway; echo 'Starting API Gateway...'; node server.js"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; echo 'Starting React Frontend...'; npm run dev"

Write-Host "All services started! Check the newly opened PowerShell windows."
Write-Host "Frontend should be available at http://localhost:5173 or the port shown in the Vite window."
