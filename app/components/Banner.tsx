import Link from 'next/link';
import Image from 'next/image';

export default function Banner() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-4 md:px-8 py-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-3">
                <Image
                    src="/logo-dark.png"
                    alt="Antigravity Logo"
                    width={40}
                    height={40}
                    className="rounded-lg"
                />
                <span className="font-bold text-xl tracking-wider text-slate-200">
                    ANTIGRAVITY
                </span>
            </div>

            <div className="flex gap-6">
                <span className="hidden sm:block text-slate-400 font-medium text-sm uppercase tracking-widest">Word Solver</span>
            </div>
        </nav>
    );
}
