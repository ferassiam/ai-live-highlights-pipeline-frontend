import { useState, useEffect, createContext, useContext } from 'react';

const DesignThemeContext = createContext();

export const useDesignTheme = () => {
  const context = useContext(DesignThemeContext);
  if (!context) {
    throw new Error('useDesignTheme must be used within a DesignThemeProvider');
  }
  return context;
};

export const DESIGN_THEMES = {
  modern: {
    name: 'Modern Glass',
    description: 'Current glass morphism design with gradients',
  },
  minimalist: {
    name: 'Minimalist Clean',
    description: 'Clean, white space focused design',
  },
  enterprise: {
    name: 'Bold Enterprise',
    description: 'Professional enterprise dashboard',
  },
  gaming: {
    name: 'Gaming/Sports',
    description: 'Dynamic gaming and sports focused theme',
  },
  corporate: {
    name: 'Corporate Professional',
    description: 'Traditional corporate interface',
  }
};

export const DesignThemeProvider = ({ children }) => {
  const [designTheme, setDesignTheme] = useState(() => {
    // Check localStorage first, default to modern
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('designTheme');
      if (stored && DESIGN_THEMES[stored]) {
        return stored;
      }
    }
    return 'modern';
  });

  useEffect(() => {
    // Update localStorage when theme changes
    if (typeof window !== 'undefined') {
      localStorage.setItem('designTheme', designTheme);
    }

    // Update the body class for theme-specific styling
    const body = document.body;
    
    // Remove all theme classes
    Object.keys(DESIGN_THEMES).forEach(theme => {
      body.classList.remove(`design-${theme}`);
    });
    
    // Add current theme class
    body.classList.add(`design-${designTheme}`);
  }, [designTheme]);

  const value = {
    designTheme,
    setDesignTheme,
    themes: DESIGN_THEMES,
  };

  return (
    <DesignThemeContext.Provider value={value}>
      {children}
    </DesignThemeContext.Provider>
  );
};