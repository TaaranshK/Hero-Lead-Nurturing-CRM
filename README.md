# Hero Lead Nurturing CRM - Full Stack Application

A comprehensive Customer Relationship Management (CRM) system for lead management and sales pipeline optimization.

**Status:** ✅ Production Ready | **Backend:** Port 9091 | **Frontend:** Port 5178

## 🚀 Quick Start (2 Terminals)

**Terminal 1 - Backend:**
```bash
cd c:\Projects\Tata\leadnurturing
.\mvnw.cmd -DskipTests spring-boot:run
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:** http://localhost:5178  
**Credentials:** ho_admin / 1234 (or da_agent / 1234)

## 📊 Live Statistics
- **Total Leads:** 58 
- **Qualified:** 22 (37.9%)
- **New:** 21
- **Unqualified:** 8
- **Lost:** 7
- **API Endpoints:** 14 ✅ (All Tested)

## 🏗️ Project Structure

```
leadnurturing/
├── src/main/java/com/hero/leadnurturing/
│   ├── config/              # Security, JWT, CORS, DataInitializer
│   ├── controller/          # 14 REST endpoints
│   ├── dto/                 # Request/Response DTOs
│   ├── entity/              # JPA Entities (6 total)
│   ├── exception/           # Custom exceptions
│   ├── repository/          # Spring Data repositories
│   └── service/             # Business logic layer
│
├── frontend/
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # 8 page components
│       ├── services/        # API integration
│       ├── context/         # React Context (Auth)
│       └── utils/           # Helper functions
│
├── create_leads.ps1         # Create 50 sample leads
├── test_endpoints.ps1       # Test all 14 endpoints
└── pom.xml                  # Maven configuration
```

## 💻 Backend

### Technology Stack
- **Framework:** Java 21 + Spring Boot 4.0.2
- **Database:** MySQL 8.0 with Hibernate ORM
- **Security:** Spring Security + JWT Authentication
- **Build Tool:** Maven
- **API:** RESTful (14 endpoints)

### 14 API Endpoints (All Tested ✅)
| Category | Endpoint | Method |
|----------|----------|--------|
| **Auth** | /auth/login | POST |
| **Leads** | /api/leads | GET/POST |
| | /api/leads/{id} | GET/PUT/DELETE |
| **Filtering** | /api/leads/filter/status | GET |
| | /api/leads/filter/city | GET |
| | /api/leads/filter/date | GET |
| **Modifications** | /api/leads/{id}/modifications | GET |
| **Dashboard** | /api/dashboard | GET |
| **Chat** | /api/chat/send | POST |
| | /api/chat/history | GET |
| **Upload** | /api/upload | POST |

### Database Schema
- **User** - Authentication & roles
- **Lead** - Lead information & status tracking
- **ChatMessage** - User messaging
- **LeadModification** - Audit trail
- Additional supporting entities for relationships

### Security Features
- JWT tokens with 30-minute expiration
- Role-based access control (ROLE_HO, ROLE_DA)
- BCrypt password encryption
- CORS enabled for frontend
- Complete audit trail

## 🎨 Frontend

### Technology Stack
- **Framework:** React 18.2.0
- **Build Tool:** Vite 5.1.4
- **Styling:** Tailwind CSS 3.x
- **UI Library:** Framer Motion, Lucide Icons
- **HTTP Client:** Axios
- **Charting:** Recharts
- **State:** React Context API

### Pages (8 Total)
1. **Login** - JWT authentication
2. **Dashboard** - Real-time analytics & statistics
3. **Lead List** - All leads with advanced filters
4. **Lead Details** - Detailed lead information
5. **Lead Create** - Create new leads
6. **Chat History** - Real-time team messaging
7. **Forgot Password** - Password recovery flow
8. **Verification Code** - OTP verification

### Key Components
- Responsive Layout (Sidebar + Header)
- Protected Routes with role-based access
- Interactive Charts (Pie & Bar)
- Lead Filtering & Search
- Real-time Chat Interface
- Smooth animations

## 🔒 Security & Access Control

### User Roles
| Role | Username | Password | Access |
|------|----------|----------|--------|
| **Head Office (HO)** | ho_admin | 1234 | Full access |
| **Dealer Agent (DA)** | da_agent | 1234 | Limited access |

### Security Features
- JWT tokens (30-min expiration)
- Role-based authorization
- Password encryption (BCrypt)
- CORS configuration
- Session management
- Request validation

## 🛠️ Setup & Installation

### Prerequisites
```
- Java 21 JDK
- Node.js 18+
- Maven 3.8+
- MySQL 8.0
```

### Backend Setup
```bash
cd c:\Projects\Tata\leadnurturing

# Build
.\mvnw.cmd clean package -DskipTests

# Run (Port 9091)
.\mvnw.cmd -DskipTests spring-boot:run
```

### Frontend Setup
```bash
cd frontend

# Install
npm install

# Development (Port 5178)
npm run dev

# Production build
npm run build
```

### Database Setup
```bash
# MySQL is pre-configured for leads_db
# Schema auto-created on backend startup
# No manual setup required
```

## 📝 Utility Scripts

### Create Sample Data
```bash
# Creates 50 distributed leads with realistic data
./create_leads.ps1
```

### Test API Endpoints
```bash
# Tests all 14 endpoints with actual data
./test_endpoints.ps1
```

### Bulk Upload
```bash
# Upload leads from CSV file
./upload_leads_simple.ps1
./upload_leads.ps1
```

## 🚀 Production Deployment

- ✅ Backend: Spring Boot production-ready
- ✅ Frontend: Optimized production build
- ✅ Database: Schema auto-migration
- ✅ Security: JWT + role-based access
- ✅ API: 14 tested endpoints
- ✅ CORS: Properly configured
- ✅ Error Handling: Comprehensive
- ✅ Logging: Production-ready

## 📊 API Response Format

All endpoints return standardized JSON:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}
```

## 🔧 Troubleshooting

### Ports Already in Use
```bash
# Find process on port
netstat -ano | findstr :9091
netstat -ano | findstr :5178

# Kill process
taskkill /PID <pid> /F
```

### Database Connection Error
- Verify MySQL is running
- Check leads_db database exists
- Confirm localhost:3306 is accessible

### JWT Token Expired
- Clear browser localStorage
- Log in again for new token

### CORS Issues
- Backend configured for port 5178
- Verify frontend requests to http://localhost:9091

## 📚 Technology Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend Framework | Spring Boot | 4.0.2 |
| Language | Java | 21 LTS |
| Frontend Framework | React | 18.2.0 |
| Frontend Build Tool | Vite | 5.1.4 |
| UI Styling | Tailwind CSS | 3.x |
| Database | MySQL | 8.0 |
| ORM | Hibernate JPA | Latest |
| Auth | JWT (JJWT) | 0.12.3  |
| Build Tool | Maven | 3.8+ |

## ✅ Quality Assurance

- ✅ All 14 API endpoints tested
- ✅ JWT authentication verified
- ✅ Role-based access confirmed
- ✅ CORS properly configured
- ✅ Database connectivity verified
- ✅ Frontend accessibility tested
- ✅ 58 sample leads loaded
- ✅ Dashboard fully functional

## 📞 Project Information

- **Repository:** TaaranshK/Hero-Lead-Nurturing-CRM
- **Status:** Production Ready ✅
- **Last Updated:** February 16, 2026
- **Lead Count:** 58 active leads
- **API Endpoints:** 14 (all functional)
- **Test Coverage:** All endpoints verified

## 🎯 Next Steps

1. ✅ Backend running (http://localhost:9091)
2. ✅ Frontend running (http://localhost:5178)
3. ✅ Dashboard populated with data
4. ✅ All API endpoints working
5. **Ready for:** Production deployment

---

**This is a fully functional CRM system ready for immediate use and deployment.**
