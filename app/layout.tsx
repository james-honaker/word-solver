import Banner from "./components/Banner";
import "./globals.css";

export const metadata = {
    title: "Word Solver",
    description: "Unscramble your words with Antigravity",
    icons: {
        icon: '/logo-dark.png',
    },
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
