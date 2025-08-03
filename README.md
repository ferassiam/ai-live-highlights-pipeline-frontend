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

## 🎨 UI/UX Design

### Design System
- **Color Palette**: Primary blue, success green, warning orange, danger red
- **Typography**: Inter font family with consistent sizing
- **Spacing**: 8px grid system for consistent spacing
- **Components**: Reusable button, card, form, and layout components

### Responsive Breakpoints
- **Mobile**: 0-639px (single column, sidebar overlay)
- **Tablet**: 640-1023px (adjusted columns, collapsible sidebar)
- **Desktop**: 1024px+ (full layout, permanent sidebar)

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Focus Management**: Visible focus indicators

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