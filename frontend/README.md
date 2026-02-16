# Hero CRM Frontend

Modern React-based frontend for the Hero Lead Nurturing CRM application.

## 🎯 Features

- **Authentication System**
  - Login with JWT
  - Forgot password flow
  - OTP verification
  - Password reset

- **Dashboard**
  - Lead statistics overview
  - Interactive charts (Pie charts, Bar charts)
  - Date range filtering
  - Real-time data updates

- **Lead Management**
  - Complete CRUD operations
  - Advanced filtering and search
  - Bulk upload via Excel
  - Export to Excel
  - Modification history tracking

- **Chat System**
  - Real-time messaging interface
  - Lead-based conversations
  - Message history
  - User avatars and status

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Layout.jsx      # Main layout wrapper
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Header.jsx      # Top header bar
│   └── PrivateRoute.jsx # Protected route wrapper
│
├── pages/              # Page components
│   ├── Login.jsx
│   ├── ForgotPassword.jsx
│   ├── VerificationCode.jsx
│   ├── ResetPassword.jsx
│   ├── Dashboard.jsx
│   ├── LeadList.jsx
│   ├── LeadDetails.jsx
│   └── ChatHistory.jsx
│
├── services/           # API services
│   ├── apiClient.js    # Axios instance
│   ├── authService.js  # Authentication APIs
│   ├── leadService.js  # Lead management APIs
│   ├── dashboardService.js
│   └── chatService.js
│
├── context/            # React Context
│   └── AuthContext.jsx # Authentication state
│
├── utils/              # Utility functions
│   ├── dateUtils.js    # Date formatting
│   └── statusUtils.js  # Status color helpers
│
└── assets/             # Static assets
    ├── images/
    └── icons/
```

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory (optional):

```env
VITE_API_BASE_URL=http://localhost:9090
```

### API Proxy

The development server is configured to proxy API requests:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': 'http://localhost:9090',
    '/auth': 'http://localhost:9090'
  }
}
```

## 🎨 Styling

The application uses **Tailwind CSS** for styling with custom configurations:

### Theme Colors

```javascript
colors: {
  primary: {
    500: '#ef4444',  // Red
    600: '#dc2626',
    700: '#b91c1c',
  },
  dark: {
    800: '#1e293b',
    900: '#0f172a',
  }
}
```

### Custom Classes

- `.btn` - Base button styles
- `.btn-primary` - Primary button
- `.btn-secondary` - Secondary button
- `.btn-danger` - Danger button
- `.input` - Input field styles
- `.card` - Card container
- `.sidebar-item` - Sidebar menu item

## 📦 Dependencies

### Core Dependencies
- `react` - UI library
- `react-dom` - React DOM rendering
- `react-router-dom` - Client-side routing

### UI & Styling
- `tailwindcss` - Utility-first CSS framework
- `framer-motion` - Animation library
- `lucide-react` - Icon library

### Data & API
- `axios` - HTTP client
- `recharts` - Charting library
- `date-fns` - Date manipulation

## 🔐 Authentication Flow

1. User logs in with username/password
2. Backend returns JWT token
3. Token stored in localStorage
4. Token sent with all API requests via interceptor
5. Auto-logout on 401 response

## 📊 State Management

The application uses React Context for global state:

### AuthContext

```javascript
const { 
  user,          // Current user object
  login,         // Login function
  logout,        // Logout function
  isAuthenticated, // Check if logged in
  hasRole        // Check user role
} = useAuth();
```

## 🛣️ Routing

Protected routes require authentication:

```javascript
<PrivateRoute>
  <Dashboard />
</PrivateRoute>
```

### Available Routes
- `/login` - Login page (public)
- `/forgot-password` - Password recovery (public)
- `/verification-code` - OTP verification (public)
- `/reset-password` - Reset password (public)
- `/dashboard` - Dashboard (protected, HO only)
- `/leads` - Lead list (protected)
- `/leads/:id` - Lead details (protected)
- `/chat` - Chat history (protected)

## 🎯 API Integration

### Service Layer Pattern

Each feature has its own service file:

```javascript
// Example: leadService.js
export const leadService = {
  getAllLeads: () => apiClient.get('/api/leads'),
  getLeadById: (id) => apiClient.get(`/api/leads/${id}`),
  createLead: (data) => apiClient.post('/api/leads', data),
  updateLead: (id, data) => apiClient.put(`/api/leads/${id}`, data),
  deleteLead: (id) => apiClient.delete(`/api/leads/${id}`)
};
```

## 🎨 Component Guidelines

### Layout Pattern

```jsx
import Layout from '../components/Layout';

function MyPage() {
  return (
    <Layout title="Page Title" breadcrumb="BREADCRUMB">
      {/* Page content */}
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
  {/* Animated content */}
</motion.div>
```

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## 🔍 Code Quality

### Best Practices

- Use functional components with hooks
- Keep components small and focused
- Extract reusable logic into custom hooks
- Use prop-types or TypeScript for type checking
- Follow consistent naming conventions
- Write clean, readable code with comments

### File Naming

- Components: PascalCase (e.g., `Dashboard.jsx`)
- Services: camelCase (e.g., `authService.js`)
- Utils: camelCase (e.g., `dateUtils.js`)

## 🐛 Troubleshooting

### Common Issues

**Port 5177 already in use**
```bash
# Change port in vite.config.js or
npx kill-port 5177
npm run dev
```

**API connection refused**
- Ensure backend is running on port 9090
- Check CORS configuration in backend

**Authentication not working**
- Clear localStorage
- Check token expiration
- Verify backend JWT configuration

## 📝 Development Tips

### Hot Module Replacement

Vite provides fast HMR. Changes appear instantly without full reload.

### DevTools

Use React DevTools browser extension for debugging components and state.

### Network Monitoring

Monitor API calls in browser DevTools Network tab.

## 🚀 Production Build

```bash
# Build for production
npm run build

# Output directory: dist/
```

### Optimization

- Code splitting enabled by default
- Tree shaking removes unused code
- CSS purged with Tailwind
- Assets compressed and optimized

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Recharts](https://recharts.org)

---

Happy coding! 🎉
