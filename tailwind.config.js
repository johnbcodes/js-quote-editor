/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			aria: {
				invalid: 'invalid="true"'
			},
			colors: {
				header: 'hsl(var(--color-text-header) / <alpha-value>)',
				body: 'hsl(var(--color-text-body) / <alpha-value>)',
				primary: 'hsl(var(--color-primary) / <alpha-value>)',
				'primary-rotate': 'hsl(var(--color-primary-rotate) / <alpha-value>)',
				'primary-bg': 'hsl(var(--color-primary-bg) / <alpha-value>)',
				secondary: 'hsl(var(--color-secondary) / <alpha-value>)',
				'secondary-rotate': 'hsl(var(--color-secondary-rotate) / <alpha-value>)',
				tertiary: 'hsl(var(--color-tertiary) / <alpha-value>)',
				glint: 'hsl(var(--color-glint) / <alpha-value>)',
				background: 'hsl(var(--color-background) / <alpha-value>)',
				light: 'hsl(var(--color-light) / <alpha-value>)',
				dark: 'hsl(var(--color-dark) / <alpha-value>)'
			}
		}
	},

	plugins: []
};
