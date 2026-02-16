# Lead Nurturing CRM - Frontend (React + TypeScript)

A modern, responsive React application for managing lead nurturing activities with user authentication, lead management, analytics dashboard, and file import capabilities.

## Tech Stack

- **Framework**: React 18.x
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 7.3.1
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **State Management**: React Context API
- **Package Manager**: npm

## Features

- **Authentication**: Login with JWT token-based authentication
- **Dashboard**: View analytics and statistics (total leads, conversion rates, source distribution)
- **Lead Management**:
  - Create, read, update, delete leads
  - Filter leads by status or city
  - Search leads by name, email, or contact
  - View modification history
- **Chat System**: Send and receive messages for each lead
- **Bulk Import**: Upload Excel files to import multiple leads at once
- **Responsive Design**: Mobile-friendly UI with modern styling

## Project Structure

```
src/
├── pages/           # Page components
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── LeadList.tsx
│   ├── LeadDetail.tsx
│   └── FileUpload.tsx
├── components/      # Reusable UI components
│   ├── Layout.tsx    # Main layout wrapper with navigation
│   └── ProtectedRoute.tsx  # Route guard for authenticated pages
├── services/        # API client and HTTP utilities
│   └── api.ts       # Axios instance and API methods
├── context/         # React Context for state management
│   └── AuthContext.tsx  # Authentication context provider
├── types/           # TypeScript type definitions
│   └── index.ts     # All API and domain types
├── styles/          # CSS stylesheets
│   ├── Login.css
│   ├── Dashboard.css
│   ├── LeadList.css
│   ├── LeadDetail.css
│   ├── FileUpload.css
│   └── Layout.css
├── App.tsx          # Main app component with routing
├── App.css          # Global styles
├── main.tsx         # React entry point
└── index.css        # Global CSS resets

public/
└── vite.svg         # Vite logo
```

## Installation & Setup

### Prerequisites

- Node.js 16+ and npm 8+
- Backend API running on http://localhost:8080

### Steps

1. **Navigate to frontend directory**:

   ```bash
   cd frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start development server**:

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

4. **Build for production**:

   ```bash
   npm run build
   ```

5. **Preview production build**:
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build optimized production bundle
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality

## Configuration

### API Endpoint

The API base URL is configured in `src/services/api.ts`. By default, it points to:

```
http://localhost:8080
```

To change the API endpoint, modify the `baseURL` in the axios instance:

```typescript
const api = axios.create({
  baseURL: "YOUR_API_ENDPOINT",
  headers: { "Content-Type": "application/json" },
});
```

### Environment Variables

Create a `.env.local` file at the project root (optional):

```
VITE_API_URL=http://localhost:8080
```

Update `src/services/api.ts` to use it:

```typescript
baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080";
```

## Authentication Flow

1. User enters credentials on login page
2. Frontend sends POST request to `/auth/login`
3. Backend returns JWT token and user info
4. Token stored in localStorage
5. Token automatically included in subsequent API requests via Axios interceptor
6. On logout, token and user data cleared from localStorage

## API Integration

All API methods are centralized in `src/services/api.ts`:

**Auth Service**:

- `login(credentials)` - Authenticate user

**Lead Service**:

- `create(lead)` - Create new lead
- `getAll()` - Get all leads
- `getById(id)` - Get lead by ID
- `update(id, lead)` - Update lead
- `delete(id)` - Delete lead
- `filterByStatus(status)` - Get leads by status
- `filterByCity(city)` - Get leads by city
- `filterByDate(startDate, endDate)` - Get leads by date range
- `getModificationHistory(leadId)` - Get modification history

**Chat Service**:

- `sendMessage(leadId, message)` - Send message to lead
- `getChatHistory(leadId)` - Get chat history

**Dashboard Service**:

- `getStats(params?)` - Get dashboard statistics

**Upload Service**:

- `uploadFile(file)` - Upload Excel file

## Authentication & Authorization

- **HO User**: `ho_admin` / `1234` - Full access to all features
- **DA User**: `da_agent` / `1234` - Access to lead management and chat

## Type Safety

TypeScript interfaces are defined in `src/types/index.ts`:

```typescript
interface Lead {
  id: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
  email: string;
  governmentId: string;
  city: string;
  address: string;
  modelName: string;
  leadSource: string;
  leadMode: string;
  followUpDate: Date;
  status: LeadStatus;
  createdAt: Date;
  updatedAt: Date;
}
```

## Styling

The application uses CSS modules and global styles:

- **Global Styles**: `index.css` and `App.css` - Base typography, buttons, form elements
- **Component Styles**: Individual CSS files in `src/styles/` for each page
- **Design System**:
  - Primary Color: #667eea / #764ba2 (gradient)
  - Secondary Colors: #007bff (blue), #28a745 (green), #dc3545 (red)
  - Background: #f5f5f5 (light gray)

## Routing

Routes are configured in `App.tsx`:

| Route        | Component        | Protected | Role  |
| ------------ | ---------------- | --------- | ----- |
| `/login`     | Login            | No        | -     |
| `/dashboard` | Dashboard        | Yes       | HO/DA |
| `/leads`     | LeadList         | Yes       | HO/DA |
| `/leads/:id` | LeadDetail       | Yes       | HO/DA |
| `/leads/new` | LeadDetail (new) | Yes       | HO/DA |
| `/upload`    | FileUpload       | Yes       | HO/DA |

## Error Handling

- API errors are caught and displayed to user
- Form validation on input change
- Network errors handled with retry logic
- Unauthorized access redirects to login

## Performance Optimizations

- Code splitting via React Router
- Lazy loading optional - add when needed
- CSS-in-JS avoided for better performance
- Minimal dependencies (only essential libraries)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Issue: "Cannot connect to API"

- Ensure backend is running on http://localhost:8080
- Check CORS configuration in backend
- Check network tab in DevTools

### Issue: "Login fails"

- Verify credentials are correct (ho_admin/1234 or da_agent/1234)
- Check backend is properly configured with test users
- Check console for API response errors

### Issue: "Page shows loading state indefinitely"

- Check API response in network tab
- Verify token is being stored in localStorage
- Check browser console for errors

## Development Workflow

1. Create new page component in `src/pages/`
2. Add API methods to `src/services/api.ts` if needed
3. Add TypeScript interfaces to `src/types/index.ts`
4. Create corresponding CSS in `src/styles/`
5. Add route in `App.tsx`
6. Test locally with `npm run dev`

## Deployment

### Static Hosting (Vercel, Netlify, etc.)

```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

### With Backend

Deploy frontend and backend together:

1. Build: `npm run build`
2. Upload `dist/` folder to hosting
3. Configure API URL to match backend deployment

## Contributing

1. Follow TypeScript strict mode
2. Use React hooks (functional components)
3. Keep components focused and reusable
4. Add proper type annotations
5. Test on mobile viewports

## License

This project is part of the Lead Nurturing CRM application suite.

## Support

For issues or questions:

1.  Check the troubleshooting section
2.  Review API responses in network tab
3.  Check browser console for error messages
4.  Contact the development team
    {
    files: ['**/*.{ts,tsx}'],
    extends: [
    // Other configs...

          // Remove tseslint.configs.recommended and replace with this
          tseslint.configs.recommendedTypeChecked,
          // Alternatively, use this for stricter rules
          tseslint.configs.strictTypeChecked,
          // Optionally, add this for stylistic rules
          tseslint.configs.stylisticTypeChecked,

          // Other configs...
        ],
        languageOptions: {
          parserOptions: {
            project: ['./tsconfig.node.json', './tsconfig.app.json'],
            tsconfigRootDir: import.meta.dirname,
          },
          // other options...
        },

    },
    ])

````

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
````
