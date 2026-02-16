$BASE_URL = "http://localhost:9091"

# Login
$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" -Method POST `
    -Body '{"username":"ho_admin","password":"1234"}' -ContentType "application/json"

$token = $loginResponse.token
$headers = @{"Authorization" = "Bearer $token"}

# Get all leads
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/api/leads" -Method GET -Headers $headers
    
    Write-Host "BACKEND DATABASE STATUS:" -ForegroundColor Yellow
    Write-Host "Total Leads: $($response.data.Count)" -ForegroundColor Cyan
    Write-Host "  - Qualified: $(($response.data | Where-Object {$_.status -eq 'QUALIFIED'}).Count)" 
    Write-Host "  - New: $(($response.data | Where-Object {$_.status -eq 'NEW'}).Count)" 
    Write-Host "  - Unqualified: $(($response.data | Where-Object {$_.status -eq 'UNQUALIFIED'}).Count)" 
    Write-Host "  - Lost: $(($response.data | Where-Object {$_.status -eq 'LOST'}).Count)"
} catch {
    Write-Host "ERROR getting leads: $_" -ForegroundColor Red
}

# Test dashboard endpoint
try {
    $dashboard = Invoke-RestMethod -Uri "$BASE_URL/api/dashboard" -Method GET -Headers $headers
    Write-Host "`nDASHBOARD API RESPONSE:" -ForegroundColor Yellow
    Write-Host ($dashboard | ConvertTo-Json) -ForegroundColor Cyan
} catch {
    Write-Host "`nERROR from dashboard: $($_)" -ForegroundColor Red
}
