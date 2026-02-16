# Manually Insert Leads via API

$BASE_URL = "http://localhost:9091"

# Get token
$loginResponse = Invoke-RestMethod -Uri "$BASE_URL/auth/login" `
    -Method POST `
    -Body '{"username":"ho_admin","password":"1234"}' `
    -ContentType "application/json"

$token = $loginResponse.token
$headers = @{"Authorization" = "Bearer $token"}

Write-Host "CREATING 50 NEW LEADS..." -ForegroundColor Green

$leads = @(
    @{firstName="Rajesh"; lastName="Sharma"; email="rajesh@example.com"; contactNumber="919000001001"; city="Mumbai"; address="MG Road"; modelName="Model X"; leadSource="Online"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID001"},
    @{firstName="Priya"; lastName="Patel"; email="priya@example.com"; contactNumber="919000001002"; city="Delhi"; address="New Delhi"; modelName="Model Y"; leadSource="Dealership"; leadMode="OFFLINE"; status="QUALIFIED"; governmentId="ID002"},
    @{firstName="Amit"; lastName="Singh"; email="amit@example.com"; contactNumber="919000001003"; city="Bangalore"; address="Bangalore"; modelName="Model Z"; leadSource="Facebook"; leadMode="ONLINE"; status="NEW"; governmentId="ID003"},
    @{firstName="Sneha"; lastName="Gupta"; email="sneha@example.com"; contactNumber="919000001004"; city="Pune"; address="Pune"; modelName="Model S"; leadSource="Google"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID004"},
    @{firstName="Vikram"; lastName="Kumar"; email="vikram@example.com"; contactNumber="919000001005"; city="Mumbai"; address="Mumbai"; modelName="Model 3"; leadSource="WhatsApp"; leadMode="OFFLINE"; status="UNQUALIFIED"; governmentId="ID005"},
    @{firstName="Anjali"; lastName="Verma"; email="anjali@example.com"; contactNumber="919000001006"; city="Delhi"; address="Delhi"; modelName="Model X"; leadSource="Referral"; leadMode="ONLINE"; status="NEW"; governmentId="ID006"},
    @{firstName="Rohit"; lastName="Rao"; email="rohit@example.com"; contactNumber="919000001007"; city="Hyderabad"; address="Hyderabad"; modelName="Model Y"; leadSource="Online"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID007"},
    @{firstName="Deepika"; lastName="Nair"; email="deepika@example.com"; contactNumber="919000001008"; city="Chennai"; address="Chennai"; modelName="Model Z"; leadSource="Dealership"; leadMode="OFFLINE"; status="LOST"; governmentId="ID008"},
    @{firstName="Arjun"; lastName="Singh"; email="arjun@example.com"; contactNumber="919000001009"; city="Kolkata"; address="Kolkata"; modelName="Model S"; leadSource="Facebook"; leadMode="ONLINE"; status="NEW"; governmentId="ID009"},
    @{firstName="Neha"; lastName="Sharma"; email="neha@example.com"; contactNumber="919000001010"; city="Ahmedabad"; address="Ahmedabad"; modelName="Model 3"; leadSource="Google"; leadMode="OFFLINE"; status="QUALIFIED"; governmentId="ID010"},
    @{firstName="Sanjay"; lastName="Patel"; email="sanjay@example.com"; contactNumber="919000001011"; city="Mumbai"; address="Mumbai"; modelName="Model X"; leadSource="WhatsApp"; leadMode="ONLINE"; status="UNQUALIFIED"; governmentId="ID011"},
    @{firstName="Pooja"; lastName="Gupta"; email="pooja@example.com"; contactNumber="919000001012"; city="Bangalore"; address="Bangalore"; modelName="Model Y"; leadSource="Referral"; leadMode="ONLINE"; status="NEW"; governmentId="ID012"},
    @{firstName="Manish"; lastName="Verma"; email="manish@example.com"; contactNumber="919000001013"; city="Pune"; address="Pune"; modelName="Model Z"; leadSource="Online"; leadMode="OFFLINE"; status="QUALIFIED"; governmentId="ID013"},
    @{firstName="Ritika"; lastName="Kumar"; email="ritika@example.com"; contactNumber="919000001014"; city="Delhi"; address="Delhi"; modelName="Model S"; leadSource="Dealership"; leadMode="ONLINE"; status="NEW"; governmentId="ID014"},
    @{firstName="Nikhil"; lastName="Rao"; email="nikhil@example.com"; contactNumber="919000001015"; city="Hyderabad"; address="Hyderabad"; modelName="Model 3"; leadSource="Facebook"; leadMode="OFFLINE"; status="LOST"; governmentId="ID015"},
    @{firstName="Isha"; lastName="Nair"; email="isha@example.com"; contactNumber="919000001016"; city="Chennai"; address="Chennai"; modelName="Model X"; leadSource="Google"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID016"},
    @{firstName="Akash"; lastName="Singh"; email="akash@example.com"; contactNumber="919000001017"; city="Kolkata"; address="Kolkata"; modelName="Model Y"; leadSource="WhatsApp"; leadMode="ONLINE"; status="UNQUALIFIED"; governmentId="ID017"},
    @{firstName="Divya"; lastName="Sharma"; email="divya@example.com"; contactNumber="919000001018"; city="Ahmedabad"; address="Ahmedabad"; modelName="Model Z"; leadSource="Referral"; leadMode="OFFLINE"; status="NEW"; governmentId="ID018"},
    @{firstName="Varun"; lastName="Patel"; email="varun@example.com"; contactNumber="919000001019"; city="Mumbai"; address="Mumbai"; modelName="Model S"; leadSource="Online"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID019"},
    @{firstName="Kavya"; lastName="Gupta"; email="kavya@example.com"; contactNumber="919000001020"; city="Bangalore"; address="Bangalore"; modelName="Model 3"; leadSource="Dealership"; leadMode="OFFLINE"; status="NEW"; governmentId="ID020"},
    @{firstName="Harshit"; lastName="Verma"; email="harshit@example.com"; contactNumber="919000001021"; city="Pune"; address="Pune"; modelName="Model X"; leadSource="Facebook"; leadMode="ONLINE"; status="LOST"; governmentId="ID021"},
    @{firstName="Megha"; lastName="Kumar"; email="megha@example.com"; contactNumber="919000001022"; city="Delhi"; address="Delhi"; modelName="Model Y"; leadSource="Google"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID022"},
    @{firstName="Yash"; lastName="Rao"; email="yash@example.com"; contactNumber="919000001023"; city="Hyderabad"; address="Hyderabad"; modelName="Model Z"; leadSource="WhatsApp"; leadMode="OFFLINE"; status="UNQUALIFIED"; governmentId="ID023"},
    @{firstName="Anika"; lastName="Nair"; email="anika@example.com"; contactNumber="919000001024"; city="Chennai"; address="Chennai"; modelName="Model S"; leadSource="Referral"; leadMode="ONLINE"; status="NEW"; governmentId="ID024"},
    @{firstName="Rohan"; lastName="Singh"; email="rohan@example.com"; contactNumber="919000001025"; city="Kolkata"; address="Kolkata"; modelName="Model 3"; leadSource="Online"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID025"},
    @{firstName="Swati"; lastName="Sharma"; email="swati@example.com"; contactNumber="919000001026"; city="Ahmedabad"; address="Ahmedabad"; modelName="Model X"; leadSource="Dealership"; leadMode="OFFLINE"; status="NEW"; governmentId="ID026"},
    @{firstName="Aryan"; lastName="Patel"; email="aryan@example.com"; contactNumber="919000001027"; city="Mumbai"; address="Mumbai"; modelName="Model Y"; leadSource="Facebook"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID027"},
    @{firstName="Tanvi"; lastName="Gupta"; email="tanvi@example.com"; contactNumber="919000001028"; city="Bangalore"; address="Bangalore"; modelName="Model Z"; leadSource="Google"; leadMode="OFFLINE"; status="LOST"; governmentId="ID028"},
    @{firstName="Karan"; lastName="Verma"; email="karan@example.com"; contactNumber="919000001029"; city="Pune"; address="Pune"; modelName="Model S"; leadSource="WhatsApp"; leadMode="ONLINE"; status="UNQUALIFIED"; governmentId="ID029"},
    @{firstName="Simran"; lastName="Kumar"; email="simran@example.com"; contactNumber="919000001030"; city="Delhi"; address="Delhi"; modelName="Model 3"; leadSource="Referral"; leadMode="ONLINE"; status="NEW"; governmentId="ID030"},
    @{firstName="Naveen"; lastName="Rao"; email="naveen@example.com"; contactNumber="919000001031"; city="Hyderabad"; address="Hyderabad"; modelName="Model X"; leadSource="Online"; leadMode="OFFLINE"; status="QUALIFIED"; governmentId="ID031"},
    @{firstName="Anu"; lastName="Nair"; email="anu@example.com"; contactNumber="919000001032"; city="Chennai"; address="Chennai"; modelName="Model Y"; leadSource="Dealership"; leadMode="ONLINE"; status="NEW"; governmentId="ID032"},
    @{firstName="Siddharth"; lastName="Singh"; email="siddharth@example.com"; contactNumber="919000001033"; city="Kolkata"; address="Kolkata"; modelName="Model Z"; leadSource="Facebook"; leadMode="OFFLINE"; status="LOST"; governmentId="ID033"},
    @{firstName="Zara"; lastName="Sharma"; email="zara@example.com"; contactNumber="919000001034"; city="Ahmedabad"; address="Ahmedabad"; modelName="Model S"; leadSource="Google"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID034"},
    @{firstName="Vikrant"; lastName="Patel"; email="vikrant@example.com"; contactNumber="919000001035"; city="Mumbai"; address="Mumbai"; modelName="Model 3"; leadSource="WhatsApp"; leadMode="ONLINE"; status="UNQUALIFIED"; governmentId="ID035"},
    @{firstName="Isha"; lastName="Gupta"; email="isha2@example.com"; contactNumber="919000001036"; city="Bangalore"; address="Bangalore"; modelName="Model X"; leadSource="Referral"; leadMode="OFFLINE"; status="NEW"; governmentId="ID036"},
    @{firstName="Pranav"; lastName="Verma"; email="pranav@example.com"; contactNumber="919000001037"; city="Pune"; address="Pune"; modelName="Model Y"; leadSource="Online"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID037"},
    @{firstName="Nitya"; lastName="Kumar"; email="nitya@example.com"; contactNumber="919000001038"; city="Delhi"; address="Delhi"; modelName="Model Z"; leadSource="Dealership"; leadMode="OFFLINE"; status="NEW"; governmentId="ID038"},
    @{firstName="Aditi"; lastName="Rao"; email="aditi@example.com"; contactNumber="919000001039"; city="Hyderabad"; address="Hyderabad"; modelName="Model S"; leadSource="Facebook"; leadMode="ONLINE"; status="LOST"; governmentId="ID039"},
    @{firstName="Kabir"; lastName="Nair"; email="kabir@example.com"; contactNumber="919000001040"; city="Chennai"; address="Chennai"; modelName="Model 3"; leadSource="Google"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID040"},
    @{firstName="Gayatri"; lastName="Singh"; email="gayatri@example.com"; contactNumber="919000001041"; city="Kolkata"; address="Kolkata"; modelName="Model X"; leadSource="WhatsApp"; leadMode="OFFLINE"; status="UNQUALIFIED"; governmentId="ID041"},
    @{firstName="Rishi"; lastName="Sharma"; email="rishi@example.com"; contactNumber="919000001042"; city="Ahmedabad"; address="Ahmedabad"; modelName="Model Y"; leadSource="Referral"; leadMode="ONLINE"; status="NEW"; governmentId="ID042"},
    @{firstName="Avni"; lastName="Patel"; email="avni@example.com"; contactNumber="919000001043"; city="Mumbai"; address="Mumbai"; modelName="Model Z"; leadSource="Online"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID043"},
    @{firstName="Dhruv"; lastName="Gupta"; email="dhruv@example.com"; contactNumber="919000001044"; city="Bangalore"; address="Bangalore"; modelName="Model S"; leadSource="Dealership"; leadMode="OFFLINE"; status="NEW"; governmentId="ID044"},
    @{firstName="Pia"; lastName="Verma"; email="pia@example.com"; contactNumber="919000001045"; city="Pune"; address="Pune"; modelName="Model 3"; leadSource="Facebook"; leadMode="ONLINE"; status="LOST"; governmentId="ID045"},
    @{firstName="Sahil"; lastName="Kumar"; email="sahil@example.com"; contactNumber="919000001046"; city="Delhi"; address="Delhi"; modelName="Model X"; leadSource="Google"; leadMode="ONLINE"; status="QUALIFIED"; governmentId="ID046"},
    @{firstName="Esha"; lastName="Rao"; email="esha@example.com"; contactNumber="919000001047"; city="Hyderabad"; address="Hyderabad"; modelName="Model Y"; leadSource="WhatsApp"; leadMode="OFFLINE"; status="UNQUALIFIED"; governmentId="ID047"},
    @{firstName="Aditya"; lastName="Nair"; email="aditya@example.com"; contactNumber="919000001048"; city="Chennai"; address="Chennai"; modelName="Model Z"; leadSource="Referral"; leadMode="ONLINE"; status="NEW"; governmentId="ID048"},
    @{firstName="Tara"; lastName="Singh"; email="tara@example.com"; contactNumber="919000001049"; city="Kolkata"; address="Kolkata"; modelName="Model S"; leadSource="Online"; leadMode="OFFLINE"; status="QUALIFIED"; governmentId="ID049"},
    @{firstName="Nisha"; lastName="Sharma"; email="nisha@example.com"; contactNumber="919000001050"; city="Ahmedabad"; address="Ahmedabad"; modelName="Model 3"; leadSource="Dealership"; leadMode="ONLINE"; status="NEW"; governmentId="ID050"}
)

$successCount = 0
foreach ($lead in $leads) {
    try {
        $leadJson = $lead | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "$BASE_URL/api/leads" `
            -Method POST `
            -Headers $headers `
            -Body $leadJson `
            -ContentType "application/json"
        
        $successCount++
        Write-Host "." -NoNewline -ForegroundColor Green
    } catch {
        Write-Host "X" -NoNewline -ForegroundColor Red
    }
}

Write-Host "`n`nCOMPLETED - $successCount of $($leads.Count) leads created" -ForegroundColor Green

# Verify
Start-Sleep -Seconds 1
$allLeads = Invoke-RestMethod -Uri "$BASE_URL/api/leads" -Method GET -Headers $headers

Write-Host "`nFINAL VERIFICATION:" -ForegroundColor Yellow
Write-Host "Total Leads in System: $($allLeads.data.Count)" -ForegroundColor Cyan
Write-Host "  - Qualified: $(($allLeads.data | Where-Object {$_.status -eq 'QUALIFIED'}).Count)" -ForegroundColor Green
Write-Host "  - New: $(($allLeads.data | Where-Object {$_.status -eq 'NEW'}).Count)" -ForegroundColor Yellow
Write-Host "  - Unqualified: $(($allLeads.data | Where-Object {$_.status -eq 'UNQUALIFIED'}).Count)" -ForegroundColor Red
Write-Host "  - Lost: $(($allLeads.data | Where-Object {$_.status -eq 'LOST'}).Count)" -ForegroundColor Magenta

Write-Host "`nRefresh your browser at http://localhost:5178 to see the updated dashboard!" -ForegroundColor Cyan
