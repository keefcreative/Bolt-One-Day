import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      // Premium Color System
      colors: {
        ink: '#0A0A0A',
        smoke: '#1A1A1A',
        ash: '#2A2A2A',
        pearl: '#FAFAFA',
        silk: '#F5F5F5',
        mist: '#E8E8E8',
        flame: '#FF6B35',
        ember: '#E5502C',
        coral: '#FF8964',
        whisper: '#FFF9F7',
        ocean: '#004E64',
        fog: '#E8F0F2',
        sage: '#E8F0EC',
        charity: '#16a34a',
        
        // Keep existing shadcn colors for components
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      
      // Premium Typography
      fontSize: {
        'hero': ['clamp(3.5rem, 5vw, 5.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'section': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.5rem, 4vw, 4.5rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'subsection': ['clamp(1.5rem, 2.5vw, 3rem)', { lineHeight: '1.3', letterSpacing: '-0.015em' }],
        'large': ['clamp(1.25rem, 2vw, 2.25rem)', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        'stat': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
      },
      
      // Premium Font Family
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"Segoe UI"', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
      
      // Premium Animations
      animation: {
        'fade-in': 'fadeIn 0.8s ease forwards',
        'fade-in-delay-1': 'fadeIn 0.8s ease 0.2s forwards',
        'fade-in-delay-2': 'fadeIn 0.8s ease 0.4s forwards',
        'fade-in-delay-3': 'fadeIn 0.8s ease 0.6s forwards',
        'underline-reveal': 'underlineReveal 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'loop-horizontally': 'loop-horizontally 30s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          from: {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          to: {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        underlineReveal: {
          from: {
            transform: 'scaleX(0)',
            transformOrigin: 'right',
          },
          to: {
            transform: 'scaleX(1)',
            transformOrigin: 'left',
          },
        },
        'loop-horizontally': {
          from: {
            transform: 'translateX(0%)',
          },
          to: {
            transform: 'translateX(-50%)',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
      },
      
      // Premium Shadows
      boxShadow: {
        'premium': '0 20px 60px rgba(0, 0, 0, 0.05)',
        'premium-lg': '0 30px 80px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 25px 50px rgba(0, 0, 0, 0.08)',
      },
      
      // Sharp edges - no border radius
      borderRadius: {
        'none': '0',
        'lg': '0',
        'md': '0',
        'sm': '0',
      },
      
      // Premium Spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      
      // Animation Timing
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      
      transitionDuration: {
        'fast': '0.2s',
        'base': '0.4s',
        'slow': '0.8s',
        'custom-600': '0.6s',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;