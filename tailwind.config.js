/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                score: {
                    great: 'var(--score-great)',
                    good: 'var(--score-good)',
                    avg: 'var(--score-avg)',
                }
            }
        },
    },
    plugins: [],
}
