# Hero Lead Nurturing CRM - Full Stack Application

A comprehensive Customer Relationship Management (CRM) system designed for Hero MotoCorp to manage and nurture leads effectively.

## 🚀 Project Structure

```
hero-crm-fullstack/
├── frontend/           # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service files
│   │   ├── context/       # React Context (Auth)
│   │   ├── utils/         # Utility functions
│   │   └── assets/        # Static assets
│   ├── public/
│   └── package.json
│
└── backend/            # Spring Boot Application
    ├── src/
    │   ├── main/
    │   │   ├── java/com/hero/leadnurturing/
    │   │   │   ├── config/       # Security & JWT config
    │   │   │   ├── controller/   # REST controllers
    │   │   │   ├── dto/          # Data Transfer Objects
    │   │   │   ├── entity/       # JPA Entities
    │   │   │   ├── repository/   # JPA Repositories
    │   │   │   ├── service/      # Business logic
    │   │   │   └── exception/    # Custom exceptions
    │   │   └── resources/
    │   │       └── application.properties
    │   └── test/
    └── pom.xml
```

## ✨ Features

### Frontend
- 🎨 Modern, responsive UI with Tailwind CSS
- 🔐 JWT-based authentication
- 📊 Interactive dashboards with Recharts
- 💬 Real-time chat interface
- 📝 Lead management with filtering and search
- 🎭 Smooth animations with Framer Motion
- 📱 Mobile-friendly design

### Backend
- 🔒 Spring Security with JWT authentication
- 💾 MySQL database integration with JPA
- 📧 Email service integration
- 📊 RESTful API design
- 🔄 Audit trail for lead modifications
- 📁 Excel file upload for bulk lead import
- 🎯 Role-based access control (HO & DA roles)

## 🛠️ Technologies Used

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Recharts** - Charts and graphs
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **date-fns** - Date formatting

### Backend
- **Spring Boot 4.0.2** - Framework
- **Spring Security** - Authentication & authorization
- **Spring Data JPA** - Database ORM
- **MySQL** - Database
- **JWT** - Token-based auth
- **Apache POI** - Excel file processing
- **Lombok** - Code generation
- **SpringDoc OpenAPI** - API documentation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- Java 21+
- Maven 3.8+
- MySQL 8.0+

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5177`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Update `application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/leads_db
spring.datasource.username=root
spring.datasource.password=your_password
```

3. Create MySQL database:
```sql
CREATE DATABASE leads_db;
```

4. Run the application:
```bash
./mvnw spring-boot:run
```

The backend will run on `http://localhost:9090`

## 👥 Default Users

The application comes with two pre-configured users:

### Head Office (HO) User
- **Username:** ho_admin
- **Password:** 1234
- **Role:** ROLE_HO
- **Access:** Full access including dashboard and all lead operations

### Dealer Agent (DA) User
- **Username:** da_agent
- **Password:** 1234
- **Role:** ROLE_DA
- **Access:** Limited to lead operations and chat

## 📋 API Endpoints

### Authentication
- `POST /auth/login` - User login

### Leads
- `GET /api/leads` - Get all leads
- `GET /api/leads/{id}` - Get lead by ID
- `POST /api/leads` - Create new lead
- `PUT /api/leads/{id}` - Update lead
- `DELETE /api/leads/{id}` - Delete lead
- `GET /api/leads/filter/status?status={status}` - Filter by status
- `GET /api/leads/filter/city?city={city}` - Filter by city
- `GET /api/leads/filter/date?fromDate={from}&toDate={to}` - Filter by date
- `GET /api/leads/{id}/modifications` - Get modification history

### Dashboard
- `GET /api/dashboard?fromDate={from}&toDate={to}` - Get dashboard statistics

### Chat
- `POST /api/chat/{leadId}` - Send message
- `GET /api/chat/{leadId}` - Get chat history

### Upload
- `POST /api/upload` - Upload Excel file with leads

## 🎨 UI Screenshots

The application includes:
- **Login Page** - Secure authentication
- **Dashboard** - Analytics and statistics
- **Lead List** - Comprehensive lead management
- **Lead Details** - Detailed lead information with modification history
- **Chat History** - Real-time communication interface
- **Password Recovery** - Forgot password flow

## 🔧 Build for Production

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
./mvnw clean package
```

## 📝 Development Notes

### Frontend Structure
- **Components**: Reusable UI components (Sidebar, Header, Layout)
- **Pages**: Full page components for routing
- **Services**: API integration layer
- **Context**: Global state management (Auth)
- **Utils**: Helper functions for dates, status colors, etc.

### Backend Structure
- **Config**: Security configuration, JWT utilities
- **Controllers**: REST API endpoints
- **Services**: Business logic layer
- **Repositories**: Database access layer
- **Entities**: Database models
- **DTOs**: Data transfer objects for API responses

## 🔐 Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based access control
- CORS configuration
- Session management
- Audit trail for all modifications

## 📧 Support

For assistance:
- **Phone:** 1800-266-0018
- **Email:** helpdesk@heromotocorp.com

## 📄 License

Copyright Hero MotoCorp Ltd. 2025. All Rights Reserved.

---

Built with ❤️ for Hero MotoCorp
