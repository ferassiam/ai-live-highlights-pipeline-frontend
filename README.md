# Live Highlights Dashboard

A modern, interactive React-based dashboard for monitoring and controlling the Live Highlights Pipeline API. Built with React, Tailwind CSS, and real-time WebSocket integration.

## ✨ Features

### 🎛️ **Comprehensive Control Panel**
- **Real-time Dashboard**: Live system monitoring with charts and metrics
- **Orchestrator Control**: Start/stop the main orchestrator
- **Schedule Management**: Full CRUD operations for schedules
- **Channel Monitoring**: View and control active streaming channels
- **Pipeline Management**: Monitor and control video processing pipelines
- **Highlights Browser**: Search, filter, and view generated highlights

### 🔄 **Real-time Updates**
- **WebSocket Integration**: Live updates for all system events
- **Status Monitoring**: Real-time system health and activity
- **Event Notifications**: Toast notifications for all actions
- **Auto-refresh**: Automatic data refresh with configurable intervals

### 📱 **Modern UI/UX**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Professional Interface**: Clean, modern design with consistent styling
- **Interactive Charts**: Real-time data visualization
- **Dark/Light Mode**: Automatic theme detection (future enhancement)
- **Accessibility**: WCAG compliant with keyboard navigation

### 🔐 **Security & Authentication**
- **API Key Authentication**: Secure Bearer token authentication
- **Session Management**: Automatic token refresh and logout
- **CORS Support**: Configurable cross-origin resource sharing
- **Input Validation**: Client-side and server-side validation

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Live Highlights API server running on port 8000
- Valid API key configured in the backend

### Installation

1. **Navigate to the web-ui directory**:
   ```bash
   cd web-ui
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your API URL if different from localhost:8000
   ```

4. **Start the development server**:
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Open your browser**:
   ```
   http://localhost:3000
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the web-ui directory:

```bash
# API Configuration
REACT_APP_API_URL=http://localhost:8000

# Optional: Custom API key (if different from backend)
# REACT_APP_API_KEY=your_api_key_here
```

### API Server Requirements

Ensure your API server is running with:
- **Port**: 8000 (default)
- **CORS**: Enabled for your frontend domain
- **WebSocket**: Available at `/ws` endpoint
- **Authentication**: API key authentication enabled

## 📋 Available Scripts

### Development
```bash
npm start          # Start development server with hot reload
npm run build      # Create optimized production build
npm test           # Run test suite (when tests are added)
npm run eject      # Eject from Create React App (not recommended)
```

### Production Build
```bash
npm run build      # Creates build/ directory with optimized files
npm install -g serve
serve -s build     # Serve production build locally
```

## 🏗️ Architecture

### Component Structure
```
src/
├── components/
│   └── Layout/
│       ├── Sidebar.js      # Navigation sidebar
│       └── Header.js       # Top header with status
├── pages/
│   ├── Dashboard.js        # Main dashboard with metrics
│   ├── Login.js           # Authentication page
│   ├── Schedules.js       # Schedule management
│   ├── Channels.js        # Channel monitoring
│   ├── Pipelines.js       # Pipeline control
│   ├── Highlights.js      # Highlights browser
│   └── Settings.js        # System settings
├── services/
│   └── api.js             # API client and WebSocket service
├── App.js                 # Main application component
└── index.js              # Application entry point
```

### Key Technologies
- **React 18**: Latest React with concurrent features
- **React Router**: Client-side routing
- **React Query**: Server state management with caching
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: Unstyled accessible UI components
- **Heroicons**: Beautiful SVG icons
- **Recharts**: Responsive chart library
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Toast notifications

### State Management
- **React Query**: Server state, caching, and synchronization
- **Local State**: Component-level state with hooks
- **WebSocket**: Real-time updates and event broadcasting
- **LocalStorage**: Authentication token persistence

## 🔌 API Integration

### HTTP Client
```javascript
import { apiService } from './services/api';

// Get system status
const status = await apiService.getStatus();

// Start orchestrator
const result = await apiService.startOrchestrator();

// Get highlights with filters
const highlights = await apiService.getHighlights({
  limit: 50,
  schedule_id: 'test_001'
});
```

### WebSocket Integration
```javascript
import { wsService } from './services/api';

// Connect to WebSocket
wsService.connect();

// Listen for events
wsService.on('pipeline_started', (data) => {
  console.log('Pipeline started:', data.schedule_id);
});

// Handle status updates
wsService.on('status_update', (data) => {
  updateUI(data);
});
```

### Real-time Features
- **Live Status**: System status updates every 30 seconds
- **Event Broadcasting**: All major events broadcasted via WebSocket
- **Auto-refresh**: Data automatically refreshes on relevant events
- **Optimistic Updates**: UI updates optimistically for better UX

## 📊 Dashboard Features

### Main Dashboard
- **System Overview**: Orchestrator status, active channels, pipelines
- **Real-time Metrics**: Live charts and statistics
- **Recent Activity**: Timeline of recent events and actions
- **Quick Actions**: Start/stop orchestrator, view alerts

### Schedule Management
- **Visual Schedule Editor**: Create and edit schedules with forms
- **Event Timeline**: Visual representation of scheduled events
- **Bulk Operations**: Enable/disable multiple schedules
- **Import/Export**: JSON import/export for schedules

### Channel Monitoring
- **Live Status**: Real-time channel status and streaming info
- **Manual Control**: Override automatic channel management
- **Performance Metrics**: Streaming quality and statistics
- **Log Viewer**: Real-time log viewing for debugging

### Pipeline Control
- **Processing Status**: Monitor segment processing and highlights generation
- **Performance Metrics**: Processing speed, success rates, errors
- **Manual Override**: Start/stop pipelines independently
- **Resource Usage**: CPU, memory, and storage monitoring

### Highlights Browser
- **Advanced Search**: Filter by time, schedule, confidence, tags
- **Preview Mode**: Quick preview of highlight details
- **Bulk Actions**: Download, export, or delete multiple highlights
- **Analytics**: Highlight generation trends and statistics

## 🎨 Professional Design System

### Overview
The Live Highlights Dashboard uses a professional sports operations design system optimized for broadcast/OTT operations teams. The design eliminates "AI-ish" aesthetics in favor of functional, high-contrast, information-dense patterns suitable for mission-critical workflows.

### Color Palette

#### Primary Colors (Sports Operations Theme)
- **Primary (Emerald)**: `#10b981` - Primary actions, navigation highlights
- **Secondary (Sky)**: `#0ea5e9` - Information, charts, secondary actions
- **Surface Colors**: Professional slate/stone palette for backgrounds and UI elements

#### Status Colors (Operational)
- **Success**: `#10b981` - Live/active/healthy status
- **Warning**: `#f59e0b` - Degraded/attention needed
- **Danger**: `#ef4444` - Critical/failed/offline
- **Processing**: `#8b5cf6` - Active processing states
- **Scheduled**: `#0ea5e9` - Scheduled/planned states

#### Neutral Colors (Professional)
```css
:root {
  /* Light theme */
  --color-slate-50: #f8fafc;
  --color-slate-100: #f1f5f9;
  --color-slate-200: #e2e8f0;
  --color-slate-300: #cbd5e1;
  --color-slate-400: #94a3b8;
  --color-slate-500: #64748b;
  --color-slate-600: #475569;
  --color-slate-700: #334155;
  --color-slate-800: #1e293b;
  --color-slate-900: #0f172a;
  --color-slate-950: #020617;
  
  /* Surface colors for operations UI */
  --color-surface-primary: var(--color-slate-50);
  --color-surface-secondary: var(--color-slate-100);
  --color-surface-elevated: #ffffff;
}

[data-theme="dark"] {
  /* Dark theme optimized for operations */
  --color-surface-primary: var(--color-slate-950);
  --color-surface-secondary: var(--color-slate-900);
  --color-surface-elevated: var(--color-slate-800);
}
```

### Typography System

#### Font Family
- **Primary**: Inter (system font with excellent readability)
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

#### Font Weights & Usage
- **font-light (300)**: Large headings, minimal text
- **font-normal (400)**: Body text, descriptions
- **font-medium (500)**: Labels, secondary headings
- **font-semibold (600)**: Section headings, emphasis
- **font-bold (700)**: Primary headings, strong emphasis
- **font-extrabold (800)**: Page titles, hero text

#### Typography Classes
```css
/* Professional heading hierarchy */
.font-heading { font-weight: 700; line-height: 1.2; letter-spacing: -0.025em; }
.font-subheading { font-weight: 600; line-height: 1.3; letter-spacing: -0.025em; }

/* Operational text styles */
.tracking-tight { letter-spacing: -0.025em; } /* Headings */
.tabular-nums { font-variant-numeric: tabular-nums; } /* Metrics */
```

### Component Architecture

#### Button Variants
```jsx
// Professional button system
<Button variant="primary">Primary Action</Button>
<Button variant="secondary">Secondary Action</Button>
<Button variant="subtle">Subtle Action</Button>
<Button variant="destructive">Delete/Remove</Button>
<Button variant="ghost">Minimal Action</Button>
<Button variant="success">Confirm/Start</Button>
<Button variant="warning">Caution Required</Button>
```

#### Status Indicators
```jsx
// Operations-grade status system
<StatusIndicator status="healthy" showText showRing />
<StatusIndicator status="warning" showText />
<StatusIndicator status="unhealthy" showText />
<StatusIndicator status="paused" showText />
```

#### Badge System
```jsx
// Status-driven badge variants
<Badge variant="live">Live</Badge>
<Badge variant="scheduled">Scheduled</Badge>
<Badge variant="processing">Processing</Badge>
<Badge variant="completed">Completed</Badge>
<Badge variant="failed">Failed</Badge>
<Badge variant="paused">Paused</Badge>
```

#### Cards & Layout
```jsx
// Professional card system with variants
<Card variant="default">Standard content</Card>
<Card variant="elevated">Important content</Card>
<Card variant="interactive">Clickable content</Card>
<Card variant="flat">Subtle content</Card>

// Density modes for operations workflows
<Card density="compact">High-density data</Card>
<Card density="default">Standard spacing</Card>
<Card density="spacious">Comfortable reading</Card>
```

#### Metrics & KPIs
```jsx
// Big-number KPIs for operations dashboards
<MetricsCard
  title="Active Channels"
  value={42}
  change={12.5}
  changeLabel="from last hour"
  icon={TvIcon}
  color="primary"
  showTrend={true}
/>
```

### Professional Shadow System
- **shadow-subtle**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` - Minimal elevation
- **shadow-elevation**: `0 4px 6px -1px rgba(0, 0, 0, 0.1)` - Standard elevation
- **shadow-elevated**: `0 10px 15px -3px rgba(0, 0, 0, 0.1)` - High elevation

### Spacing & Layout

#### Grid System
- **Base unit**: 0.25rem (4px)
- **Common spacing**: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px
- **Container max-width**: 1280px (max-w-7xl)
- **Content padding**: 1.5rem (24px)

#### Professional Breakpoints
```javascript
// Tailwind breakpoints optimized for operations
screens: {
  'sm': '640px',   // Large mobile
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Ultra-wide
}
```

### Dark Mode Implementation
Uses data-theme attribute strategy instead of class-based:
```css
/* Light mode (default) */
.text-primary { color: #0f172a; }

/* Dark mode */
[data-theme="dark"] .text-primary { color: #f8fafc; }
```

### Responsive Design Patterns

#### Mobile-First Approach (360px+)
- Single column layouts
- Overlay navigation
- Touch-optimized controls
- Condensed information

#### Tablet Optimizations (768px+)
- Two-column layouts
- Collapsible sidebar
- Improved data density
- Gesture support

#### Desktop Experience (1280px+)
- Multi-column layouts
- Persistent sidebar
- Full feature access
- Keyboard shortcuts

### Accessibility Standards

#### WCAG AA Compliance
- **Color contrast**: Minimum 4.5:1 for normal text
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: 44px minimum touch target
- **Focus indicators**: 2px solid ring with proper contrast

#### Keyboard Navigation
- **Tab order**: Logical flow through interface
- **Focus management**: Visible focus indicators
- **Keyboard shortcuts**: Standard shortcuts for common actions
- **Screen readers**: Semantic HTML with ARIA labels

#### Implementation Examples
```jsx
// Accessible button with proper ARIA
<Button
  variant="primary"
  onClick={handleAction}
  aria-label="Start orchestrator service"
  className="focus:outline-none focus:ring-2 focus:ring-primary-500"
>
  Start Service
</Button>

// Status indicator with screen reader support
<StatusIndicator 
  status="healthy"
  showText
  aria-label="System status: healthy and operational"
/>
```

### Animation & Transitions
Professional, subtle animations that enhance UX without distraction:

#### Motion Principles
- **Duration**: 150ms-300ms for most transitions
- **Easing**: `ease-out` for entrances, `ease-in` for exits
- **Reduced motion**: Respects `prefers-reduced-motion`
- **Performance**: GPU-accelerated transforms only

#### Common Patterns
```jsx
// Page transitions
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3 }}
>
  Page Content
</motion.div>

// Interactive elements
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15 }}
>
  Interactive Button
</motion.button>
```

### Component Library Usage

#### Import Patterns
```javascript
// Individual component imports (recommended)
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import { StatusIndicator } from '../components/ui/StatusIndicator';
import { MetricsCard } from '../components/ui/MetricsCard';
```

#### Professional Layout Example
```jsx
function ProfessionalDashboard() {
  return (
    <motion.div className="space-y-8 p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-heading font-bold text-slate-900 [data-theme=\"dark\"] &:text-slate-100">
          System Overview
        </h1>
        <StatusIndicator status="healthy" showText />
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricsCard key={metric.title} {...metric} />
        ))}
      </div>
    </motion.div>
  );
}
```

## 🔧 Customization

### Styling
Customize the appearance by modifying `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your brand colors
        }
      }
    }
  }
}
```

### API Configuration
Modify `src/services/api.js` to customize:
- **Base URL**: Change default API endpoint
- **Timeout**: Adjust request timeout
- **Retry Logic**: Configure retry behavior
- **Error Handling**: Customize error responses

### Components
All components are modular and can be easily customized:
- **Layout**: Modify sidebar and header components
- **Pages**: Add new pages or modify existing ones
- **Styling**: Use Tailwind utilities for styling changes

## 🚀 Deployment

### Development
```bash
npm start  # http://localhost:3000
```

### Production Build
```bash
npm run build
```

### Docker Deployment
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment-specific Builds
```bash
# Development
REACT_APP_API_URL=http://localhost:8000 npm run build

# Staging
REACT_APP_API_URL=https://staging-api.example.com npm run build

# Production
REACT_APP_API_URL=https://api.example.com npm run build
```

## 🔍 Troubleshooting

### Common Issues

1. **"Cannot connect to API"**
   - Verify API server is running on port 8000
   - Check CORS configuration in API server
   - Verify `REACT_APP_API_URL` in `.env`

2. **"Authentication failed"**
   - Check API key is valid
   - Verify `API_KEY` environment variable in API server
   - Clear browser local storage and re-login

3. **"WebSocket connection failed"**
   - Verify WebSocket endpoint at `/ws`
   - Check browser developer tools for connection errors
   - Ensure no proxy blocking WebSocket connections

4. **Build errors**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility
   - Verify all dependencies are installed

### Performance Optimization

1. **Bundle Size**: Use `npm run build` to analyze bundle size
2. **Lazy Loading**: Implement code splitting for routes
3. **Image Optimization**: Use optimized images and icons
4. **Caching**: Configure proper HTTP caching headers

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow React best practices and hooks patterns
- Use TypeScript for new components (migration in progress)
- Maintain responsive design for all screen sizes
- Add error handling for all API calls
- Write accessible HTML with proper ARIA labels

## 📚 Additional Resources

- **API Documentation**: `/docs` endpoint on API server
- **React Documentation**: https://reactjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Query**: https://react-query.tanstack.com/

## 📄 License

This project is part of the Live Highlights Pipeline system. See the main project license for details.

---

**Live Highlights Dashboard** - Professional monitoring and control interface for AI-powered video highlights generation.