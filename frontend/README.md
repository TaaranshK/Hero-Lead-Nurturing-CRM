# Hero Lead Nurturing CRM - Frontend

Modern React + Vite frontend for the Hero Lead Nurturing CRM application with Tailwind CSS styling.

## 🎯 Features

- **Secure Authentication**
  - JWT token-based login
  - Role-based access control (Head Office, Dealer Agent)
  - Automatic session management
  - Password recovery flow

- **Interactive Dashboard**
  - Real-time lead statistics
  - Pie & Bar charts with Recharts
  - Status breakdown visualization
  - Lead source distribution
  - Conversion rate analytics

- **Complete Lead Management**
  - Full CRUD operations (Create, Read, Update, Delete)
  - Advanced filtering (status, city, date range)
  - Real-time search functionality
  - Modification history tracking
  - Bulk CSV upload support

- **Chat System**
  - Real-time messaging interface
  - Lead-based conversations
  - Complete message history
  - User interactions

## 📁 Project Structure

```
src/
├── components/              # Reusable React components
│   ├── Header.jsx          # Top navigation bar
│   ├── Layout.jsx          # Main layout wrapper
│   ├── Sidebar.jsx         # Left navigation
│   └── PrivateRoute.jsx    # Protected route wrapper
│
├── pages/                   # Page components (8 total)
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── LeadList.jsx
│   ├── LeadDetails.jsx
│   ├── LeadCreate.jsx
│   ├── ChatHistory.jsx
│   ├── ForgotPassword.jsx
│   └── VerificationCode.jsx
│
├── services/                # API integration
│   ├── apiClient.js        # Axios instance with interceptors
│   ├── authService.js      # Authentication APIs
│   ├── leadService.js      # Lead CRUD operations
│   ├── dashboardService.js # Dashboard statistics
│   └── chatService.js      # Chat messaging
│
├── context/
│   └── AuthContext.jsx     # Global authentication state
│
├── utils/                   # Utility functions
│   ├── dateUtils.js        # Date formatting
│   └── statusUtils.js      # Status color mappings
│
└── assets/
    ├── images/
    └── icons/
```

## 🚀 Getting Started

### Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (Port 5178)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## ⚙️ Configuration

### Environment Setup

Create `.env` file (optional):
```env
VITE_API_BASE_URL=http://localhost:9091
```

### API Base URL
- Development: `http://localhost:9091`
- Production: Set via `.env` file

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom theme colors
- Responsive design breakpoints

### Breakpoints
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Custom Components
- `.btn` - Base button styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.input` - Input field styles
- `.card` - Card container

## 📦 Dependencies

### Core
- `react` - UI library
- `react-dom` - DOM rendering
- `react-router-dom` - Client-side routing

### Styling & Animation
- `tailwindcss` - CSS framework
- `framer-motion` - Smooth animations
- `lucide-react` - Icon library

### Data & API
- `axios` - HTTP client
- `recharts` - Charts library
- `date-fns` - Date utilities

## 🔐 Authentication

### Flow
1. User logs in with credentials
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent with all API requests
5. Auto-logout on 401 response

### Protected Routes
```jsx
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

## 📊 State Management

### AuthContext
Provides global authentication state:
```javascript
const { 
  user,              // Current user object
  login,             // Login function
  logout,            // Logout function
  isAuthenticated,   // Check if logged in
  hasRole            // Check user role
} = useAuth();
```

## 🛣️ Routes

### Public Routes
- `/login` - Login page
- `/forgot-password` - Password recovery
- `/verification-code` - OTP verification

### Protected Routes
- `/dashboard` - Dashboard (HO only)
- `/leads` - Lead list
- `/leads/:id` - Lead details
- `/chat` - Chat history

## 🎯 API Integration

### Service Layer Pattern

Each feature has dedicated service file:

```javascript
// leadService.js
export const leadService = {
  getAllLeads: () => apiClient.get('/api/leads'),
  getLeadById: (id) => apiClient.get(`/api/leads/${id}`),
  createLead: (data) => apiClient.post('/api/leads', data),
  updateLead: (id, data) => apiClient.put(`/api/leads/${id}`, data),
  deleteLead: (id) => apiClient.delete(`/api/leads/${id}`)
};
```

## 🎨 Component Patterns

### Layout Pattern
```jsx
import Layout from '../components/Layout';

function MyPage() {
  return (
    <Layout title="Page Title" breadcrumb="BREADCRUMB">
      {/* Content */}
    </Layout>
  );
}
```

### Animation Pattern
```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  {/* Content */}
</motion.div>
```

## 🔍 Code Quality

### Best Practices
- Functional components with hooks
- Reusable, focused components
- Custom hooks for logic extraction
- Consistent naming conventions
- Clean, readable code with comments

### File Naming
- Components: PascalCase (Dashboard.jsx)
- Services: camelCase (leadService.js)
- Utils: camelCase (dateUtils.js)

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5178
netstat -ano | findstr :5178
taskkill /PID <pid> /F
```

### API Connection Issues
- Verify backend running on port 9091
- Check CORS configuration
- Examine Network tab in DevTools

### Authentication Failed
- Clear localStorage
- Check JWT token expiration
- Verify credentials

## 🚀 Production Build

```bash
# Build for production
npm run build

# Output: dist/ directory
```

### Optimization
- Code splitting enabled
- Tree shaking removes unused code
- CSS purged by Tailwind
- Assets optimized

## 📚 Development Tools

### Browser Extensions
- React DevTools - Component inspection
- Redux DevTools - State debugging

### DevTools Features
- Hot Module Replacement (HMR)
- Network monitoring
- Console logging

## 📖 Documentation

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Axios](https://axios-http.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

## ✅ Testing Checklist

- ✅ Login/Authentication
- ✅ Dashboard loading data
- ✅ Lead CRUD operations
- ✅ Filtering functionality
- ✅ Chat messaging
- ✅ Role-based access
- ✅ Responsive design
- ✅ Error handling

## 🎯 Current Statistics

- **Total Leads:** 58
- **Pages:** 8
- **Components:** 4 main
- **Services:** 5
- **API Endpoints:** 14
- **Responsive:** Yes ✅

## 🔄 Development Workflow

1. **Start dev server:** `npm run dev`
2. **Make changes** - Auto HMR refresh
3. **Test in browser** - http://localhost:5178
4. **Build & test** - `npm run build`

## 📞 Support

- **Status:** Production Ready ✅
- **Last Updated:** February 16, 2026
- **Backend Port:** 9091
- **Frontend Port:** 5178

---

**Happy coding!** 🎉
