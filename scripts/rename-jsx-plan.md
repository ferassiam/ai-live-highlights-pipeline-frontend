# JSX Migration Plan

Tracking file renames to .jsx to satisfy Vite JSX parsing:

- src/App.js -> src/App.jsx (done, stub left)
- src/components/ui/LoadingSpinner.js -> .jsx created, .js re-exports (done)
- src/components/ui/ErrorBoundary.js -> convert next
- src/components/Layout/Header.js -> convert next
- src/components/Layout/Sidebar.js -> convert next
- src/hooks/useTheme.js -> convert next
- src/pages/*.js (Dashboard, Schedules, Channels, Pipelines, Highlights, ContentCreation, EnhancedMonitoring, FileManager, Monitoring, Settings, Login) -> batch convert

Imports resolution approach: create new .jsx files and make .js re-export to minimize churn, then optionally remove .js later.
