import Banner from "./components/Banner";
import "./globals.css";

export const metadata = {
    title: "Word Solver",
    description: "Unscramble your words with Word Solver",
    icons: {
        icon: '/app-icon.png',
        apple: '/app-icon.png',
    },
    manifest: '/manifest.json',
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    themeColor: '#0f172a',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className="pt-20 bg-slate-50 min-h-screen">
                <Banner />
                {children}
            </body>
        </html>
    );
}
