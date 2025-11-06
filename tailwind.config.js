/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: (theme) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: theme('colors.gh.fg.default'),
            lineHeight: '1.7',

            // Headings - GitHub-like hierarchy
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.gh.fg.default'),
              fontWeight: '600',
              lineHeight: '1.25',
              marginTop: '1.5em',
              marginBottom: '0.75em',
            },
            h1: {
              fontSize: '2em',
              borderBottom: `1px solid ${theme('colors.gh.border.muted')}`,
              paddingBottom: '0.3em',
              marginBottom: '1em',
            },
            h2: {
              fontSize: '1.5em',
              borderBottom: `1px solid ${theme('colors.gh.border.muted')}`,
              paddingBottom: '0.3em',
              marginBottom: '0.8em',
            },
            h3: {
              fontSize: '1.25em',
            },
            h4: {
              fontSize: '1em',
            },
            h5: {
              fontSize: '0.875em',
            },
            h6: {
              fontSize: '0.85em',
              color: theme('colors.gh.fg.muted'),
            },

            // Paragraphs
            p: {
              marginTop: '1em',
              marginBottom: '1em',
            },

            // Lists
            'ul, ol': {
              marginTop: '1em',
              marginBottom: '1em',
              paddingLeft: '2em',
            },
            li: {
              marginTop: '0.25em',
              marginBottom: '0.25em',
            },

            // Links
            a: {
              color: theme('colors.gh.accent.fg'),
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            },

            // Code blocks
            code: {
              color: theme('colors.gh.fg.default'),
              backgroundColor: theme('colors.gh.canvas.subtle'),
              padding: '0.2em 0.4em',
              borderRadius: '6px',
              fontSize: '0.85em',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.gh.canvas.subtle'),
              color: theme('colors.gh.fg.default'),
              padding: '1em',
              borderRadius: '6px',
              overflow: 'auto',
              border: `1px solid ${theme('colors.gh.border.default')}`,
            },
            'pre code': {
              backgroundColor: 'transparent',
              padding: '0',
              fontSize: '0.875em',
            },

            // Blockquotes
            blockquote: {
              borderLeft: `4px solid ${theme('colors.gh.border.default')}`,
              paddingLeft: '1em',
              color: theme('colors.gh.fg.muted'),
              fontStyle: 'normal',
              marginTop: '1em',
              marginBottom: '1em',
            },

            // Tables
            table: {
              width: '100%',
              borderCollapse: 'collapse',
              marginTop: '1em',
              marginBottom: '1em',
            },
            thead: {
              borderBottom: `2px solid ${theme('colors.gh.border.default')}`,
            },
            'thead th': {
              padding: '0.5em 1em',
              textAlign: 'left',
              fontWeight: '600',
            },
            'tbody td': {
              padding: '0.5em 1em',
              borderTop: `1px solid ${theme('colors.gh.border.default')}`,
            },

            // Horizontal rules
            hr: {
              borderColor: theme('colors.gh.border.default'),
              marginTop: '1.5em',
              marginBottom: '1.5em',
            },

            // Strong/Bold
            strong: {
              color: theme('colors.gh.fg.default'),
              fontWeight: '600',
            },

            // Images
            img: {
              borderRadius: '6px',
              marginTop: '1em',
              marginBottom: '1em',
            },
          },
        },

        // Light theme variant
        latte: {
          css: {
            '--tw-prose-body': 'var(--latte-text-secondary)',
            '--tw-prose-headings': 'var(--latte-text-primary)',
            '--tw-prose-links': 'var(--color-gh-accent-emphasis)',
            '--tw-prose-bold': 'var(--latte-text-primary)',
            '--tw-prose-code': 'var(--latte-text-primary)',
            '--tw-prose-quotes': 'var(--latte-text-secondary)',

            h1: {
              borderBottomColor: 'var(--color-gh-border-default)',
            },
            h2: {
              borderBottomColor: 'var(--color-gh-border-default)',
            },
            code: {
              backgroundColor: 'var(--latte-card-bg)',
            },
            pre: {
              backgroundColor: 'var(--latte-card-bg)',
              borderColor: 'var(--color-gh-border-default)',
            },
            blockquote: {
              borderLeftColor: 'var(--color-gh-accent-emphasis)',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
