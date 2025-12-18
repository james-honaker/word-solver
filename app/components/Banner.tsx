import Link from 'next/link';
import Image from 'next/image';

export default function Banner() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex flex-wrap justify-between items-center px-3 md:px-8 py-3 md:py-4 bg-slate-900/50 backdrop-blur-md border-b border-white/5">
            <div className="flex items-center gap-3">
                <Image
                    src="/app-icon.png"
                    alt="Word Solver Logo"
                    width={36}
                    height={36}
                    className="rounded-lg shadow-sm"
                />
                <span className="font-bold text-lg tracking-wide text-slate-100">
                    Word Solver
                </span>
            </div>
        </nav>
    );
}
