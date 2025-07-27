export interface Theme {
  colors: {
    primary: {
      main: string;
      light: string;
      dark: string;
      gradient: string;
    };
    secondary: {
      main: string;
      light: string;
      dark: string;
    };
    accent: {
      main: string;
      light: string;
      dark: string;
    };
    neutral: {
      white: string;
      light: string;
      medium: string;
      dark: string;
      black: string;
    };
    status: {
      success: string;
      warning: string;
      error: string;
      info: string;
    };
    background: {
      primary: string;
      secondary: string;
      card: string;
      overlay: string;
    };
    border: {
      light: string;
      medium: string;
      dark: string;
    };
    text: {
      primary: string;
      secondary: string;
      tertiary: string;
      inverse: string;
    };
  };
  typography: {
    fontFamily: {
      primary: string;
      secondary: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  breakpoints: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  zIndex: {
    modal: number;
    overlay: number;
    dropdown: number;
    header: number;
    toast: number;
  };
}

const theme: Theme = {
  colors: {
    primary: {
      main: '#8B5FBF', // Purple
      light: '#A78BC9',
      dark: '#6B4A91',
      gradient: 'linear-gradient(135deg, #8B5FBF 0%, #5F8BF4 100%)',
    },
    secondary: {
      main: '#5F8BF4', // Blue
      light: '#7FA3F7',
      dark: '#4A6BC4',
    },
    accent: {
      main: '#FF6B6B',
      light: '#FF8E8E',
      dark: '#E55555',
    },
    neutral: {
      white: '#FFFFFF',
      light: '#F8FAFC',
      medium: '#E2E8F0',
      dark: '#64748B',
      black: '#1E293B',
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',
    },
    background: {
      primary: '#FFFFFF',
      secondary: '#F8FAFC',
      card: '#FFFFFF',
      overlay: 'rgba(0, 0, 0, 0.5)',
    },
    border: {
      light: '#E2E8F0',
      medium: '#CBD5E1',
      dark: '#94A3B8',
    },
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      tertiary: '#94A3B8',
      inverse: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: {
      primary: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      secondary: '"Poppins", sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '0.5rem',
    sm: '0.75rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    '3xl': '3rem',
    '4xl': '4rem',
    '5xl': '5rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  breakpoints: {
    xs: '375px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
  zIndex: {
    modal: 1000,
    overlay: 999,
    dropdown: 100,
    header: 50,
    toast: 1100,
  },
};

export default theme;