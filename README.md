# Live Highlights Dashboard

A professional sports operations dashboard for monitoring and controlling live broadcast pipelines. Built with React, Tailwind CSS, and real-time WebSocket integration, optimized for broadcast and OTT operations teams.

## 🎯 Sports Operations Features

### 📊 **Operations Dashboard**
- **Live KPIs**: Concurrent streams, active channels, pipeline status, system health
- **Real-time Monitoring**: Channel status, ingest bitrate, latency tracking
- **Activity Feed**: Live operations log with status indicators
- **Quick Actions**: Start/stop systems, create schedules, generate highlights

### 🎥 **Content Pipeline Management**
- **Channel Control**: Live streaming channel management with status monitoring
- **Pipeline Operations**: Video processing pipeline control and performance tracking
- **Highlight Generation**: AI-powered highlight creation and management
- **Schedule Management**: Event scheduling with timezone support

### 🎨 **Professional Sports Operations UI**
- **High Information Density**: Optimized for operations teams with dense, scannable layouts
- **Dark Theme Default**: Professional dark interface with light mode support
- **Consistent Design System**: Emerald primary colors, professional typography (Inter)
- **Accessible**: WCAG AA compliant with keyboard navigation and focus management
- **Responsive**: Desktop-first design that scales to mobile

## 🎨 Design System

### Color Palette
- **Primary**: Emerald (emerald-500/600) - Live content and primary actions
- **Secondary**: Sky blue (sky-500) - Secondary actions and info states  
- **Status Colors**: Success (green-600), Warning (amber-500), Danger (red-500)
- **Surface**: Slate-950 (dark), Slate-50 (light) with stone borders

### Typography
- **Font**: Inter with system fallbacks
- **Weights**: 500 (medium) for headings, 600 (semibold) for emphasis
- **Spacing**: Tight tracking for headings, tabular numbers for metrics

### Components
- **Cards**: Subtle elevation with consistent padding and borders
- **Buttons**: 5 variants (primary, secondary, subtle, destructive, ghost)
- **Status Indicators**: Color-coded dots with live animation for active states
- **Badges**: Status-specific styling (live, scheduled, processing, failed, etc.)
- **Metrics Cards**: Big-number KPIs with trend indicators

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Sports operations API server
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
   # Set REACT_APP_API_URL if different from default
   # Default: https://ai-highlights-orchestrator.mkio.dev/api
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

## 🏗️ Architecture Overview

### Professional UI Components
```
src/
├── components/ui/
│   ├── Button.js           # 5 variants with icon support
│   ├── Card.js             # Elevated cards with headers/footers
│   ├── Badge.js            # Status badges with live indicators
│   ├── StatusIndicator.js  # Dot + label status display
│   ├── MetricsCard.js      # KPI cards with trend indicators
│   ├── Input.js            # Form inputs with validation
│   ├── Select.js           # Dropdown selects
│   ├── LoadingSpinner.js   # Loading states and skeletons
│   └── TabNavigation.js    # Keyboard-navigable tabs
├── components/Layout/
│   ├── Sidebar.js          # Compact nav with sections
│   └── Header.js           # Reduced height with search
├── pages/
│   ├── Dashboard.js        # Operations dashboard with KPIs
│   ├── Monitoring.js       # Channel/pipeline monitoring
│   ├── Channels.js         # Live channel management
│   ├── Pipelines.js        # Pipeline operations
│   ├── Highlights.js       # Content management
│   ├── Schedules.js        # Event scheduling
│   └── Settings.js         # System configuration
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

### Production
```bash
npm run build
serve -s build
```

The application includes Docker configuration and nginx setup for production deployment.

## 🔍 Troubleshooting

### Common Issues

1. **Theme not applying**: Check data-theme attribute on html element
2. **Components not styled**: Verify Tailwind classes are being processed
3. **API connection issues**: Check REACT_APP_API_URL environment variable
4. **WebSocket connection failed**: Verify /ws endpoint availability

## 🤝 Contributing

### Development Guidelines
- Use the established design system components
- Maintain WCAG AA accessibility standards  
- Follow the professional sports operations aesthetic
- Test keyboard navigation and focus management
- Ensure responsive behavior across screen sizes

## 📚 Additional Resources

- **React Documentation**: https://reactjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Headless UI**: https://headlessui.com/
- **Heroicons**: https://heroicons.com/

## 📄 License

This project is part of the Sports Operations Pipeline system.

---

**SportsOps Dashboard** - Professional operations interface for live sports broadcast and content pipeline management.