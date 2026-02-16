# Quick Start Guide

Get the Hero CRM application up and running in 10 minutes!

## ⚡ Prerequisites Checklist

Before starting, ensure you have:

- [ ] Java 21+ installed (`java -version`)
- [ ] Maven 3.8+ installed (`mvn -version`)
- [ ] Node.js 18+ installed (`node -version`)
- [ ] MySQL 8.0+ installed and running
- [ ] Git (optional, for version control)

## 🚀 Setup Steps

### Step 1: Database Setup (2 minutes)

Open MySQL command line or MySQL Workbench and run:

```sql
CREATE DATABASE leads_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Verify the database was created:
```sql
SHOW DATABASES;
```

### Step 2: Backend Setup (3 minutes)

1. Navigate to backend directory:
```bash
cd backend
```

2. Update database password:
   - Open `src/main/resources/application.properties`
   - Change this line:
   ```properties
   spring.datasource.password=Guddiguddi13@
   ```
   - To your MySQL root password:
   ```properties
   spring.datasource.password=your_mysql_password
   ```

3. Start the backend:
```bash
# On Windows
mvnw.cmd spring-boot:run

# On Mac/Linux
./mvnw spring-boot:run
```

4. Wait for this message:
```
Started LeadnurturingApplication in X.XXX seconds
```

5. Verify backend is running:
   - Open browser: http://localhost:9090/swagger-ui.html
   - You should see the API documentation

### Step 3: Frontend Setup (3 minutes)

Open a **NEW terminal window** (keep backend running):

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

This will take 1-2 minutes. You'll see many packages being installed.

3. Start the development server:
```bash
npm run dev
```

4. Wait for:
```
  VITE v5.x.x  ready in XXX ms
  
  ➜  Local:   http://localhost:5177/
  ➜  press h + enter to show help
```

### Step 4: Access the Application (1 minute)

1. Open your browser and go to: http://localhost:5177

2. You should see the Hero CRM login page!

3. Login with default credentials:
   - **Head Office User:**
     - Username: `ho_admin`
     - Password: `1234`
   
   - **Dealer Agent:**
     - Username: `da_agent`
     - Password: `1234`

## ✅ Verification

After logging in, you should see:

- ✓ Dashboard with statistics (HO user)
- ✓ Lead List page accessible
- ✓ Chat History page accessible
- ✓ No errors in browser console (F12)

## 🎯 What's Next?

Now that everything is running:

1. **Explore the Dashboard** (HO user only)
   - View lead statistics
   - Check conversion rates
   - See source distribution

2. **Manage Leads**
   - Create a new lead
   - Edit existing leads
   - Upload leads from Excel

3. **Use the Chat**
   - Select a lead
   - Send messages
   - View chat history

## 🐛 Troubleshooting

### Backend won't start

**Error: "Port 9090 already in use"**
```bash
# Kill the process using port 9090
# On Windows:
netstat -ano | findstr :9090
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:9090 | xargs kill -9
```

**Error: "Access denied for user 'root'@'localhost'"**
- Double-check your MySQL password in `application.properties`
- Ensure MySQL is running

**Error: "Unknown database 'leads_db'"**
- Run the CREATE DATABASE command from Step 1

### Frontend won't start

**Error: "EADDRINUSE: address already in use :::5177"**
```bash
# Kill the process
npx kill-port 5177
npm run dev
```

**Error: "Cannot find module..."**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Login not working

**"Network Error" or "Failed to fetch"**
- Ensure backend is running on http://localhost:9090
- Check browser console (F12) for errors
- Verify CORS is configured (should work out of the box)

**Wrong credentials**
- Default users are created automatically on first backend start
- Username: `ho_admin` or `da_agent`
- Password: `1234`

### Dashboard shows no data

- This is normal on first run
- Create some test leads from the Lead List page
- Or upload the sample Excel file

## 📝 Development Tips

### Hot Reload

Both frontend and backend support hot reload:
- **Frontend**: Changes appear instantly
- **Backend**: Restart on Java file changes (may take a few seconds)

### Browser DevTools

Open with F12 to:
- Monitor network requests
- Check console for errors
- Inspect React components
- View JWT tokens in localStorage

### Database Viewing

Use MySQL Workbench or command line to view data:
```sql
USE leads_db;
SHOW TABLES;
SELECT * FROM leads LIMIT 10;
SELECT * FROM users;
```

## 🎓 Next Steps

1. Read the full README.md for detailed documentation
2. Explore the code structure
3. Try creating custom features
4. Check out the API documentation at http://localhost:9090/swagger-ui.html

## 📞 Need Help?

- Check the Troubleshooting section above
- Review README.md files in frontend/ and backend/
- Contact: helpdesk@heromotocorp.com
- Phone: 1800-266-0018

---

Happy coding! 🚀
