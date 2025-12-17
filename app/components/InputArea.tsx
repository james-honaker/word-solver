
import { motion } from 'framer-motion';
import { Search, Loader2 } from 'lucide-react';
import { ChangeEvent, FormEvent } from 'react';
import FilterControls, { FilterState } from './FilterControls';

type InputAreaProps = {
    letters: string;
    loading: boolean;
    setLetters: (letters: string) => void;
    handleSolve: (e: FormEvent<HTMLFormElement>) => void;
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
};

export default function InputArea({ letters, loading, setLetters, handleSolve, filters, setFilters }: InputAreaProps) {
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
                        className="w-full py-3 md:py-4 pl-4 md:pl-6 pr-12 md:pr-14 text-xl md:text-2xl font-bold text-center tracking-widest md:tracking-[0.2em] uppercase bg-white/5 border-2 border-white/10 rounded-full focus:outline-none focus:border-violet-500 focus:bg-white/10 transition-all placeholder:text-slate-500 placeholder:text-sm md:placeholder:text-lg placeholder:normal-case placeholder:tracking-normal text-white shadow-xl backdrop-blur-sm"
                    />
                    <button
                        type="submit"
                        aria-label="Solve"
                        disabled={loading || !letters}
                        className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-violet-600 hover:bg-violet-500 disabled:bg-slate-700 disabled:cursor-not-allowed rounded-full transition-colors text-white shadow-lg"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                    </button>
                </div>
            </form>

            <FilterControls filters={filters} setFilters={setFilters} />
        </motion.div>
    );
}
