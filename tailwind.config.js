/** @type {import('tailwindcss').Config} */
function token(varName) {
  // Канальная запись "R G B" + <alpha-value> — сохраняет работу
  // модификаторов прозрачности Tailwind (bg-surface/10 и т.п.).
  return `rgb(var(${varName}) / <alpha-value>)`;
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Семантические токены тем — значения см. в src/index.css.
        bg: token('--color-bg'),
        surface: token('--color-surface'),
        'surface-2': token('--color-surface-2'),
        border: token('--color-border'),
        'text-primary': token('--color-text'),
        'text-secondary': token('--color-text-secondary'),
        'text-muted': token('--color-text-muted'),
        accent: token('--color-accent'),
        'accent-2': token('--color-accent-2'),
      },
    },
  },
  plugins: [],
};
