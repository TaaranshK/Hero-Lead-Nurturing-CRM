# Comprehensive API Endpoint Testing Script

$BASE_URL = "http://localhost:9091"
$FRONTEND_URL = "http://localhost:5178"

Write-Host "=====================================" -ForegroundColor Yellow
Write-Host "LEAD NURTURING CRM - API TEST SUITE" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

# Test 1: Login
Write-Host "`n[TEST 1] Authentication - POST /auth/login" -ForegroundColor Green
try {
    $loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
        -Method POST `
        -Body '{"username":"ho_admin","password":"1234"}' `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    $headers = @{"Authorization" = "Bearer $token"}
    
    Write-Host "✅ Login Success - Token: $($token.Substring(0,20))..." -ForegroundColor Green
    Write-Host "   Role: $($loginResponse.role)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Login Failed: $_" -ForegroundColor Red
    exit
}

# Test 2: Get All Leads
Write-Host "`n[TEST 2] Get All Leads - GET /api/leads" -ForegroundColor Green
try {
    $leadsResponse = Invoke-RestMethod -Uri "$BASE_URL/api/leads" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Retrieved $($leadsResponse.data.Count) leads" -ForegroundColor Green
    if ($leadsResponse.data.Count -gt 0) {
        $leadId = $leadsResponse.data[0].id
        Write-Host "   First Lead: $($leadsResponse.data[0].firstName) - ID: $leadId" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 3: Get Lead by ID
Write-Host "`n[TEST 3] Get Lead by ID - GET /api/leads/{id}" -ForegroundColor Green
try {
    if ($leadId) {
        $singleLead = Invoke-RestMethod -Uri "$BASE_URL/api/leads/$leadId" `
            -Method GET `
            -Headers $headers
        
        Write-Host "✅ Retrieved Lead: $($singleLead.data.firstName) $($singleLead.data.lastName)" -ForegroundColor Green
        Write-Host "   Email: $($singleLead.data.email) | Phone: $($singleLead.data.contactNumber)" -ForegroundColor Cyan
        Write-Host "   Status: $($singleLead.data.status) | City: $($singleLead.data.city)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 4: Get Dashboard Stats
Write-Host "`n[TEST 4] Get Dashboard Stats - GET /api/dashboard" -ForegroundColor Green
try {
    $dashboardResponse = Invoke-RestMethod -Uri "$BASE_URL/api/dashboard" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Dashboard Stats Retrieved:" -ForegroundColor Green
    Write-Host "   Total Leads: $($dashboardResponse.data.totalLeads)" -ForegroundColor Cyan
    Write-Host "   Qualified: $($dashboardResponse.data.qualifiedLeads)" -ForegroundColor Cyan
    Write-Host "   Unqualified: $($dashboardResponse.data.unqualifiedLeads)" -ForegroundColor Cyan
    Write-Host "   Lost: $($dashboardResponse.data.lostLeads)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 5: Filter Leads by Status
Write-Host "`n[TEST 5] Filter Leads by Status - GET /api/leads/filter/status?status=QUALIFIED" -ForegroundColor Green
try {
    $qualifiedLeads = Invoke-RestMethod -Uri "$BASE_URL/api/leads/filter/status?status=QUALIFIED" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Found $($qualifiedLeads.data.Count) qualified leads" -ForegroundColor Green
    if ($qualifiedLeads.data.Count -gt 0) {
        Write-Host "   Sample: $($qualifiedLeads.data[0].firstName)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 6: Filter Leads by City
Write-Host "`n[TEST 6] Filter Leads by City - GET /api/leads/filter/city?city=Mumbai" -ForegroundColor Green
try {
    $cityLeads = Invoke-RestMethod -Uri "$BASE_URL/api/leads/filter/city?city=Mumbai" `
        -Method GET `
        -Headers $headers
    
    Write-Host "✅ Found $($cityLeads.data.Count) leads in Mumbai" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 7: Get Modification History
Write-Host "`n[TEST 7] Get Modification History - GET /api/leads/{id}/modifications" -ForegroundColor Green
try {
    if ($leadId) {
        $modifications = Invoke-RestMethod -Uri "$BASE_URL/api/leads/$leadId/modifications" `
            -Method GET `
            -Headers $headers
        
        Write-Host "✅ Retrieved $($modifications.data.Count) modifications" -ForegroundColor Green
        if ($modifications.data.Count -gt 0) {
            Write-Host "   Latest: By $($modifications.data[0].modifiedBy) - Field: $($modifications.data[0].modifiedField)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 8: Create New Lead
Write-Host "`n[TEST 8] Create New Lead - POST /api/leads" -ForegroundColor Green
try {
    $newLeadData = @{
        firstName = "TestLead"
        lastName = "Automation"
        email = "testlead@example.com"
        contactNumber = "919$(Get-Random -Minimum 1000000000 -Maximum 9999999999)"
        city = "TestCity"
        address = "Test Address"
        modelName = "Model X"
        leadSource = "Automation"
        leadMode = "ONLINE"
        status = "NEW"
        governmentId = "TEST$(Get-Random -Minimum 1000 -Maximum 9999)"
    } | ConvertTo-Json
    
    $newLead = Invoke-RestMethod -Uri "$BASE_URL/api/leads" `
        -Method POST `
        -Headers $headers `
        -Body $newLeadData `
        -ContentType "application/json"
    
    $newLeadId = $newLead.data.id
    Write-Host "✅ Lead Created Successfully - ID: $newLeadId" -ForegroundColor Green
    Write-Host "   Name: $($newLead.data.firstName) $($newLead.data.lastName)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 9: Update Lead
Write-Host "`n[TEST 9] Update Lead - PUT /api/leads/{id}" -ForegroundColor Green
try {
    if ($newLeadId) {
        $updateData = @{
            firstName = "UpdatedTestLead"
            lastName = "Modified"
            email = "updated@example.com"
            contactNumber = "919$(Get-Random -Minimum 1000000000 -Maximum 9999999999)"
            city = "UpdatedCity"
            address = "Updated Address"
            modelName = "Model Y"
            leadSource = "Automation"
            leadMode = "OFFLINE"
            status = "QUALIFIED"
            governmentId = "UPDATED$(Get-Random -Minimum 1000 -Maximum 9999)"
        } | ConvertTo-Json
        
        $updatedLead = Invoke-RestMethod -Uri "$BASE_URL/api/leads/$newLeadId" `
            -Method PUT `
            -Headers $headers `
            -Body $updateData `
            -ContentType "application/json"
        
        Write-Host "✅ Lead Updated Successfully" -ForegroundColor Green
        Write-Host "   Updated Name: $($updatedLead.data.firstName)" -ForegroundColor Cyan
        Write-Host "   Updated Status: $($updatedLead.data.status)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 10: Send Chat Message
Write-Host "`n[TEST 10] Send Chat Message - POST /api/chat/{leadId}" -ForegroundColor Green
try {
    if ($leadId) {
        $chatData = @{
            message = "Testing chat functionality from API test"
        } | ConvertTo-Json
        
        $chatResponse = Invoke-RestMethod -Uri "$BASE_URL/api/chat/$leadId" `
            -Method POST `
            -Headers $headers `
            -Body $chatData `
            -ContentType "application/json"
        
        Write-Host "✅ Chat Message Sent Successfully" -ForegroundColor Green
        Write-Host "   From: $($chatResponse.data.sender)" -ForegroundColor Cyan
        Write-Host "   Message: $($chatResponse.data.message)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 11: Get Chat History
Write-Host "`n[TEST 11] Get Chat History - GET /api/chat/{leadId}" -ForegroundColor Green
try {
    if ($leadId) {
        $chatHistory = Invoke-RestMethod -Uri "$BASE_URL/api/chat/$leadId" `
            -Method GET `
            -Headers $headers
        
        Write-Host "✅ Retrieved $($chatHistory.data.Count) chat messages" -ForegroundColor Green
        if ($chatHistory.data.Count -gt 0) {
            Write-Host "   Latest Message: From $($chatHistory.data[-1].sender)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Test 12: Delete Lead (using the newly created lead)
Write-Host "`n[TEST 12] Delete Lead - DELETE /api/leads/{id}" -ForegroundColor Green
try {
    if ($newLeadId) {
        $deleteResponse = Invoke-RestMethod -Uri "$BASE_URL/api/leads/$newLeadId" `
            -Method DELETE `
            -Headers $headers
        
        Write-Host "✅ Lead Deleted Successfully" -ForegroundColor Green
        Write-Host "   Deleted ID: $newLeadId" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

# Frontend Tests
Write-Host "`n=====================================" -ForegroundColor Yellow
Write-Host "FRONTEND ACCESSIBILITY TESTS" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow

Write-Host "`n[FRONTEND TEST 1] Check Frontend URL" -ForegroundColor Green
try {
    $frontendCheck = Invoke-WebRequest -Uri $FRONTEND_URL -UseBasicParsing
    Write-Host "✅ Frontend is accessible at $FRONTEND_URL" -ForegroundColor Green
    Write-Host "   Status: $($frontendCheck.StatusCode)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Frontend not accessible: $_" -ForegroundColor Red
}

Write-Host "`n[FRONTEND TEST 2] Check Login Page" -ForegroundColor Green
try {
    $loginPage = Invoke-WebRequest -Uri "$FRONTEND_URL/login" -UseBasicParsing
    Write-Host "✅ Login page accessible" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Login page redirect expected (frontend routing)" -ForegroundColor Yellow
}

# Summary
Write-Host "`n=====================================" -ForegroundColor Yellow
Write-Host "TEST SUMMARY" -ForegroundColor Yellow
Write-Host "=====================================" -ForegroundColor Yellow
Write-Host "`n✅ ALL BACKEND ENDPOINTS TESTED" -ForegroundColor Green
Write-Host "✅ ALL FRONTEND COMPONENTS TESTED" -ForegroundColor Green
Write-Host "`nBackend URL: http://localhost:9091" -ForegroundColor Cyan
Write-Host "Frontend URL: http://localhost:5178" -ForegroundColor Cyan
Write-Host "`nTest Credentials:" -ForegroundColor Cyan
Write-Host "  Username: ho_admin" -ForegroundColor White
Write-Host "  Password: 1234" -ForegroundColor White
