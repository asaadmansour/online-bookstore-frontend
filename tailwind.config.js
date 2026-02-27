/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        white: '#FFFFFF',
        'bg-soft': '#F9FAFB',
        'border-light': '#E5E7EB',
        'text-main': '#1F2937',
        'text-muted': '#6B7280',
        accent: '#75b722',
        'accent-hover': '#7A9386',
        'accent-light': '#F0F4F2',
      },
      fontFamily: {
        sans: ['Inter', 'Geist', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        heading: '700',
        body: '400',
      },
      lineHeight: {
        readable: '1.6',
      },
      borderRadius: {
        minimal: '8px',
      },
      boxShadow: {
        soft: '0 4px 12px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
