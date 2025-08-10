# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based dashboard frontend for the Live Highlights Pipeline API - a system for monitoring and controlling AI-powered video highlights generation. The application provides real-time monitoring, schedule management, channel control, and pipeline management capabilities.

## Development Commands

### Essential Commands
- `npm start` - Start development server on http://localhost:3000
- `npm run build` - Create production build
- `npm test` - Run test suite
- `npm install` - Install dependencies

### Environment Setup
The application expects a backend API running on port 8000 by default. The API URL can be configured via `REACT_APP_API_URL` environment variable.

Default API endpoint: `https://ai-highlights-orchestrator.mkio.dev/api`

## Architecture Overview

### Tech Stack
- **React 18** with hooks and context
- **React Router** for client-side routing
- **TanStack Query v5** for server state management and caching
- **Tailwind CSS** for styling with custom design system
- **Framer Motion** for animations
- **Axios** for HTTP client with interceptors
- **WebSocket** for real-time updates
- **React Hot Toast** for notifications

### Key Architectural Patterns

1. **Enhanced Service Layer Architecture**: All API communication is centralized in `src/services/api.js`
   - `ApiService` class handles all HTTP requests with **80+ API methods**
   - `WebSocketService` class manages WebSocket connections with auto-reconnection and **typed event handling**
   - Built-in error handling and authentication token management
   - **NEW**: Configuration management endpoints (prompts, schemas, sports)
   - **NEW**: Enhanced monitoring and file management endpoints
   - **NEW**: Content generation workflow endpoints

2. **Expanded Page-Based Routing**: Each major feature is a separate page component in `src/pages/`
   - Dashboard: Real-time system overview and metrics
   - Schedules: **Enhanced** CRUD operations with file upload/download and polling
   - Channels: Live channel monitoring and control
   - Pipelines: Pipeline status and manual control
   - Highlights: Browse and filter generated highlights
   - ContentCreation: **NEW** Content generation workflow with match management
   - **NEW**: Configuration: Sport-specific prompts and schemas management
   - **NEW**: EnhancedMonitoring: Advanced monitoring with real-time metrics
   - **NEW**: FileManager: File browser with upload/download capabilities
   - Monitoring: System monitoring and analytics
   - Settings: Configuration management

3. **Advanced Component Organization**:
   - `components/Layout/`: Sidebar and Header components
   - `components/ui/`: **Expanded** reusable UI components
     - **NEW**: `MetricsCard` - Real-time metrics display
     - **NEW**: `CodeEditor` - JSON/text editor with syntax highlighting
     - **NEW**: `TabNavigation` - Advanced tab navigation component
     - **NEW**: `FileUpload` - Drag-and-drop file upload with progress
     - Button, Card, Input, Select, LoadingSpinner, etc.
   - `hooks/`: Custom hooks like `useTheme`
   - `utils/`: Utility functions like `cn.js` for class name merging

4. **Enhanced State Management**:
   - Server state: TanStack Query with 30s stale time and 5min garbage collection
   - Authentication state: localStorage with token validation
   - UI state: Local component state and context (theme)
   - **NEW**: Real-time state synchronization via WebSocket events
   - **NEW**: Configuration state with version control and conflict resolution

### Authentication Flow
- Bearer token authentication stored in localStorage
- Automatic token injection via Axios interceptors
- 401 responses trigger automatic logout and redirect
- WebSocket connection established after successful authentication

### Real-time Features
- WebSocket connection with exponential backoff reconnection
- Event-driven updates for pipeline status, schedules, and system events
- Toast notifications for user feedback
- Auto-refresh strategies with TanStack Query

## Development Patterns

### API Integration
Use the centralized `apiService` from `src/services/api.js`:
```javascript
import { apiService } from '../services/api';
const data = await apiService.getSchedules();
```

### Query Pattern with TanStack Query
```javascript
import { useQuery } from '@tanstack/react-query';
const { data, isLoading, error } = useQuery({
  queryKey: ['schedules'],
  queryFn: () => apiService.getSchedules()
});
```

### WebSocket Event Handling
```javascript
import { wsService } from '../services/api';
useEffect(() => {
  const handlePipelineUpdate = (data) => {
    // Handle pipeline status update
  };
  wsService.on('pipeline_update', handlePipelineUpdate);
  return () => wsService.off('pipeline_update', handlePipelineUpdate);
}, []);
```

### Custom Design System
The project uses a comprehensive Tailwind-based design system defined in `tailwind.config.js`:
- Custom color palette: primary (blue), success (green), warning (orange), danger (red), dark (gray)
- Custom animations: fade-in, slide-up, pulse-fast, bounce-slow
- Responsive breakpoints for mobile, tablet, desktop
- Dark mode support with 'class' strategy

### Component Conventions
- Use functional components with hooks
- Implement proper loading states and error handling
- Follow the established UI component patterns from `components/ui/`
- Use Framer Motion for page transitions and animations
- Maintain responsive design across all screen sizes

## Configuration Files

### Core Configuration
- `package.json` - Dependencies and scripts with proxy to localhost:8000
- `tailwind.config.js` - Custom design system and theme configuration
- `craco.config.js` - Create React App configuration override for Tailwind
- `postcss.config.js` - PostCSS configuration for Tailwind processing

### Environment Variables
- `REACT_APP_API_URL` - Backend API base URL (defaults to production endpoint)
- Authentication tokens are managed automatically via localStorage

## Key Features

### Real-time Dashboard
- WebSocket-powered live updates
- System health monitoring
- Pipeline status visualization
- Performance metrics and charts

### Enhanced Schedule Management
- Full CRUD operations for video processing schedules
- **NEW**: Manual schedule reload with polling status
- **NEW**: Schedule file upload/download functionality
- **NEW**: Real-time schedule change notifications via WebSocket
- **NEW**: Content generation configuration per schedule
- JSON import/export functionality
- Schedule validation and conflict detection

### Channel Control
- Live streaming channel monitoring
- Manual channel override capabilities
- Real-time status updates

### Pipeline Management
- Video processing pipeline control
- Performance monitoring and analytics
- Manual pipeline start/stop operations

### **NEW**: Configuration Management System
- **Sport-specific prompt configuration** with rich text editor
- **Sport-specific schema configuration** with JSON validation
- **Version history and rollback functionality** for prompts and schemas
- **ETag-based optimistic concurrency control**
- **Admin role-based access control**
- Support for multiple sports (football, basketball, etc.)

### **NEW**: Enhanced Monitoring Dashboard
- **Real-time metrics with auto-refresh**
- **Pipeline-specific performance statistics**
- **Comprehensive system health monitoring**
- **Recent events timeline and activity feeds**
- **Backend health status indicators**
- **Resource usage monitoring**

### **NEW**: Advanced Content Generation Workflow
- **Match-based content initialization and management**
- **AI-powered editorial and social media content generation**
- **Multi-platform social media posting**
- **Real-time content generation progress tracking**
- **Configurable content generation settings per match**
- **Team-based content personalization**

### **NEW**: File Management System
- **Advanced file browser with search and filtering**
- **File metadata display (size, modified date, type)**
- **Drag-and-drop file upload with validation**
- **Schedule file management and versioning**
- **File type categorization and sorting**

## Development Notes

### Proxy Configuration
The development server proxies API requests to `http://localhost:8000` as defined in package.json. This eliminates CORS issues during development.

### Error Handling
- Global error handling via Axios interceptors
- Toast notifications for user feedback
- Automatic logout on 401 responses
- WebSocket reconnection with exponential backoff

### Performance Optimizations
- TanStack Query provides intelligent caching and background updates
- Lazy loading can be implemented for route-based code splitting
- WebSocket connection is managed globally to prevent multiple connections

### Styling Guidelines
- Use Tailwind CSS utilities following the established design system
- Responsive design is mandatory - test on mobile, tablet, and desktop
- Dark mode support is built-in via the ThemeProvider
- Use custom color palette defined in tailwind.config.js
- Follow animation patterns established in the codebase