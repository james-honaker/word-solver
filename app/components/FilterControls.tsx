'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export type FilterState = {
    startsWith: string;
    endsWith: string;
    contains: string;
};

type FilterControlsProps = {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
};

export default function FilterControls({ filters, setFilters }: FilterControlsProps) {
    const [isOpen, setIsOpen] = useState(false);

    const activeCount = Object.values(filters).filter(Boolean).length;

    const handleChange = (key: keyof FilterState, value: string) => {
        setFilters({ ...filters, [key]: value.replace(/[^a-zA-Z]/g, '') });
    };

    const clearFilters = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFilters({ startsWith: '', endsWith: '', contains: '' });
    };

    return (
        <div className="w-full max-w-lg mx-auto mb-2 text-right">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-400 transition-colors py-3 px-2 min-h-[44px]"
            >
                <Filter size={14} />
                <span>{isOpen ? 'Hide Filters' : 'Advanced Filters'}</span>
                {activeCount > 0 && (
                    <span className="bg-teal-400/20 text-teal-400 px-1.5 rounded-full">
                        {activeCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="flex flex-col sm:flex-row gap-2 pb-4 pt-2">
                            <CompactInput
                                label="Starts with"
                                placeholder="S..."
                                value={filters.startsWith}
                                onChange={(val) => handleChange('startsWith', val)}
                            />
                            <CompactInput
                                label="Ends with"
                                placeholder="...G"
                                value={filters.endsWith}
                                onChange={(val) => handleChange('endsWith', val)}
                                reverse
                            />
                            <CompactInput
                                label="Contains"
                                placeholder="..A.."
                                value={filters.contains}
                                onChange={(val) => handleChange('contains', val)}
                            />
                            {activeCount > 0 && (
                                <button
                                    onClick={clearFilters}
                                    className="flex items-center justify-center p-2 rounded-md bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors self-end"
                                    title="Clear Filters"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CompactInput({ label, value, onChange, placeholder, reverse }: { label: string, value: string, onChange: (val: string) => void, placeholder: string, reverse?: boolean }) {
    return (
        <div className="flex-1 relative group">
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`w-full bg-slate-900/50 border border-white/10 rounded-md py-2.5 sm:py-1.5 pl-3 pr-3 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500/50 transition-all uppercase ${reverse ? 'sm:text-right' : ''}`}
            />
            <span className="absolute -top-3 left-1 text-[9px] font-bold text-slate-500 uppercase tracking-wider group-focus-within:text-violet-400 transition-colors">
                {label}
            </span>
        </div>
    );
}
