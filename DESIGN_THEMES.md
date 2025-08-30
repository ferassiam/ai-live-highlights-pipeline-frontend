# Design Themes Guide

The AI Highlights Pipeline Dashboard now supports 5 distinct design themes that you can switch between in real-time!

## Available Themes

### 1. 🌟 **Modern Glass** (Default)
- **Style**: Glass morphism with gradients and backdrop blur
- **Colors**: Blue and purple gradients with white glass cards
- **Best for**: Modern, visually appealing interface
- **Features**: Translucent cards, gradient backgrounds, smooth animations

### 2. 🔳 **Minimalist Clean**
- **Style**: Clean, white space focused design
- **Colors**: Pure white/black with minimal gray accents
- **Best for**: Focus on content, reduced visual noise
- **Features**: Sharp edges, high contrast, lots of whitespace

### 3. 💼 **Bold Enterprise**
- **Style**: Professional enterprise dashboard
- **Colors**: Blue and indigo corporate colors
- **Best for**: Business presentations, corporate environments
- **Features**: Bold borders, gradient headers, enterprise-grade styling

### 4. 🎮 **Gaming/Sports**
- **Style**: Dynamic gaming and sports focused theme
- **Colors**: Green and emerald with dark backgrounds
- **Best for**: Sports analytics, gaming dashboards, high-energy environments
- **Features**: Glowing effects, dark mode optimized, vibrant accents

### 5. 🏢 **Corporate Professional**
- **Style**: Traditional corporate interface
- **Colors**: Gray and slate professional palette
- **Best for**: Conservative business environments
- **Features**: Formal styling, muted colors, traditional layout

## How to Switch Themes

### Method 1: Using the Header Interface (Recommended)
1. Look for the **paint brush icon** (🎨) in the top-right header
2. Click on it to open the design theme selector
3. Choose from the 5 available themes:
   - Modern Glass
   - Minimalist Clean
   - Bold Enterprise
   - Gaming/Sports
   - Corporate Professional
4. The theme will apply instantly across the entire dashboard

### Method 2: Browser Developer Tools (Advanced)
1. Open browser developer tools (F12)
2. Go to the Console tab
3. Run: `localStorage.setItem('designTheme', 'THEME_NAME')`
4. Refresh the page
5. Available theme names: `modern`, `minimalist`, `enterprise`, `gaming`, `corporate`

### Method 3: URL Parameter (For Testing)
1. Add `?theme=THEME_NAME` to the URL
2. Example: `http://localhost:3001?theme=gaming`
3. Note: This method requires additional implementation

## Theme Persistence

- Your selected theme is **automatically saved** to browser localStorage
- The theme will persist when you:
  - Refresh the page
  - Close and reopen the browser
  - Navigate between different pages
- Each browser/device remembers its own theme preference

## Theme-Specific Features

### Gaming/Sports Theme Special Features:
- Enhanced button styling with green gradients
- Glowing card borders on hover
- Dark-optimized text contrast
- Special green accent colors for highlights

### Enterprise Theme Special Features:
- Bold blue headers with gradients
- Thicker card borders for emphasis
- Enhanced shadow effects
- Professional blue color scheme

### Minimalist Theme Special Features:
- Ultra-clean white backgrounds
- Minimal shadows and effects
- High contrast for readability
- Simplified visual hierarchy

## Technical Implementation

The theme system uses:
- **React Context** for state management
- **CSS-in-JS** with Tailwind classes
- **Local Storage** for persistence
- **Design tokens** for consistent styling
- **Theme-aware components** that adapt automatically

## Customization

To add new themes or modify existing ones:

1. **Add new theme definition** in `src/hooks/useDesignTheme.jsx`
2. **Add CSS classes** in `src/index.css` under the Design Theme Styles section
3. **Update theme utilities** in `src/utils/themeClasses.jsx`
4. **Test all components** to ensure proper styling

## Browser Compatibility

All themes are fully supported in:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Performance

- Theme switching is **instant** with no page reload required
- **No performance impact** - all themes use the same component structure
- **Efficient CSS** with conditional class application
- **Optimized animations** for smooth transitions

---

**Enjoy exploring the different design themes and find the one that best fits your workflow!** 🎨✨