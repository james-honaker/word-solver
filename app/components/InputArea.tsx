'use client';

import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { ChangeEvent, FormEvent } from 'react';

type InputAreaProps = {
    letters: string;
    loading: boolean;
    setLetters: (letters: string) => void;
    handleSolve: (e: FormEvent<HTMLFormElement>) => void;
};

export default function InputArea({ letters, loading, setLetters, handleSolve }: InputAreaProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-md mx-auto"
        >
            <form onSubmit={handleSolve} className="relative">
                <div className="relative group">
                    <input
                        type="text"
                        value={letters}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setLetters(e.target.value.replace(/[^a-zA-Z?]/g, ''))}
                        placeholder="Enter letters (use ? for wildcard)"
                        maxLength={15}
                        className="w-full py-4 pl-6 pr-14 text-2xl font-bold text-center tracking-[0.2em] uppercase bg-white/5 border-2 border-white/10 rounded-full focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all placeholder:text-slate-500 placeholder:text-lg placeholder:normal-case placeholder:tracking-normal text-white shadow-xl backdrop-blur-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading || !letters}
                        className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full transition-colors text-white shadow-lg"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
