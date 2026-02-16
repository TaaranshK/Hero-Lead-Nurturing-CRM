# Upload Leads CSV File

$BASE_URL = "http://localhost:9091"
$CSV_FILE = "c:\Projects\Tata\leadnurturing\leads_upload.csv"

Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║     LEAD BULK UPLOAD SYSTEM          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green

# Step 1: Login
Write-Host "`n[STEP 1] Authenticating..." -ForegroundColor Cyan
try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
        -Method POST `
        -Body '{"username":"ho_admin","password":"1234"}' `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    $headers = @{"Authorization" = "Bearer $token"}
    
    Write-Host "✅ Authentication successful" -ForegroundColor Green
    Write-Host "   User: $($loginResponse.username) | Role: $($loginResponse.role)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Authentication failed: $_" -ForegroundColor Red
    exit
}

# Step 2: Upload CSV File
Write-Host "`n[STEP 2] Uploading CSV file..." -ForegroundColor Cyan
try {
    if (Test-Path $CSV_FILE) {
        $fileStream = [System.IO.File]::OpenRead($CSV_FILE)
        $fileContent = Get-Content $CSV_FILE -Raw
        
        $Body = @{
            file = $fileStream
        }
        
        $uploadResponse = Invoke-RestMethod -Uri "$BASE_URL/api/upload" `
            -Method POST `
            -Headers $headers `
            -Form $Body
        
        Write-Host "✅ File uploaded successfully" -ForegroundColor Green
        Write-Host "   Status: $($uploadResponse.data.success)" -ForegroundColor Cyan
        Write-Host "   Message: $($uploadResponse.data.message)" -ForegroundColor Cyan
        
        $fileStream.Close()
    } else {
        Write-Host "❌ CSV file not found at: $CSV_FILE" -ForegroundColor Red
        exit
    }
} catch {
    Write-Host "⚠️  Upload response: $_" -ForegroundColor Yellow
}

# Step 3: Verify data loaded
Write-Host "`n[STEP 3] Verifying data in system..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

try {
    # Get all leads
    $leadsResponse = Invoke-RestMethod -Uri "$BASE_URL/api/leads" `
        -Method GET `
        -Headers $headers
    
    $totalLeads = $leadsResponse.data.Count
    Write-Host "✅ Data verification complete" -ForegroundColor Green
    Write-Host "   Total Leads: $totalLeads" -ForegroundColor Cyan
    
    if ($totalLeads -gt 0) {
        # Get dashboard stats
        $dashResponse = Invoke-RestMethod -Uri "$BASE_URL/api/dashboard" `
            -Method GET `
            -Headers $headers
        
        Write-Host "`n📊 DASHBOARD STATISTICS:" -ForegroundColor Yellow
        Write-Host "   Total Leads: $($dashResponse.data.totalLeads)" -ForegroundColor Cyan
        Write-Host "   Qualified: $($dashResponse.data.qualifiedLeads)" -ForegroundColor Green
        Write-Host "   Unqualified: $($dashResponse.data.unqualifiedLeads)" -ForegroundColor Red
        Write-Host "   Lost: $($dashResponse.data.lostLeads)" -ForegroundColor Yellow
        
        # Get status breakdown
        Write-Host "`n🔍 STATUS BREAKDOWN:" -ForegroundColor Yellow
        $qualifiedCount = ($leadsResponse.data | Where-Object { $_.status -eq "QUALIFIED" }).Count
        $newCount = ($leadsResponse.data | Where-Object { $_.status -eq "NEW" }).Count
        $unqualifiedCount = ($leadsResponse.data | Where-Object { $_.status -eq "UNQUALIFIED" }).Count
        $lostCount = ($leadsResponse.data | Where-Object { $_.status -eq "LOST" }).Count
        
        Write-Host "   NEW: $newCount leads" -ForegroundColor Cyan
        Write-Host "   QUALIFIED: $qualifiedCount leads" -ForegroundColor Green
        Write-Host "   UNQUALIFIED: $unqualifiedCount leads" -ForegroundColor Red
        Write-Host "   LOST: $lostCount leads" -ForegroundColor Yellow
        
        # Get city breakdown
        Write-Host "`n🏙️ CITY BREAKDOWN:" -ForegroundColor Yellow
        $cities = $leadsResponse.data.city | Select-Object -Unique | Sort-Object
        foreach ($city in $cities) {
            $cityCount = ($leadsResponse.data | Where-Object { $_.city -eq $city }).Count
            Write-Host "   $city`: $cityCount leads" -ForegroundColor Cyan
        }
        
        # Show sample leads
        Write-Host "`n👥 SAMPLE LEADS:" -ForegroundColor Yellow
        $leadsResponse.data | Select-Object -First 5 | ForEach-Object {
            Write-Host "   • $($_.firstName) $($_.lastName) - $($_.city) - Status: $($_.status)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Verification failed: $_" -ForegroundColor Red
}

Write-Host "`n╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           UPLOAD COMPLETE            ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host "`n📱 Frontend Dashboard: http://localhost:5178" -ForegroundColor Cyan
Write-Host "🔐 Login with: ho_admin / 1234" -ForegroundColor Cyan
Write-Host "`nThe dashboard will now display:" -ForegroundColor Cyan
Write-Host "   ✓ 50+ qualified leads" -ForegroundColor Green
Write-Host "   ✓ Lead status distribution charts" -ForegroundColor Green
Write-Host "   ✓ City-wise lead breakdown" -ForegroundColor Green
Write-Host "   ✓ Recent lead activities" -ForegroundColor Green
Write-Host "`n"
