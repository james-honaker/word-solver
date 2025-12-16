'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

type Definition = {
    definition: string;
    example?: string;
};

type Meaning = {
    partOfSpeech: string;
    definitions: Definition[];
};

type DictionaryEntry = {
    word: string;
    phonetic?: string;
    meanings: Meaning[];
};

type DefinitionModalProps = {
    word: string | null;
    onClose: () => void;
};

export default function DefinitionModal({ word, onClose }: DefinitionModalProps) {
    const [data, setData] = useState<DictionaryEntry | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!word) return;

        // Lock scroll
        document.body.style.overflow = 'hidden';

        setLoading(true);
        setError(false);
        setData(null);

        fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then((res) => {
                if (!res.ok) throw new Error('Not found');
                return res.json();
            })
            .then((data) => setData(data[0]))
            .catch(() => setError(true))
            .finally(() => setLoading(false));

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [word]);

    if (!word) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative bg-slate-900 border border-white/10 w-full md:w-auto md:min-w-[320px] max-w-lg rounded-2xl p-6 shadow-2xl overflow-hidden text-left"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 capitalize">
                        {word}
                    </h2>

                    {loading && (
                        <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            <span className="text-sm">Fetching definition...</span>
                        </div>
                    )}

                    {error && (
                        <div className="text-slate-400 italic">
                            Sorry, no definition found for this word.
                        </div>
                    )}

                    {data && (
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                            {data.phonetic && (
                                <p className="text-slate-500 font-mono text-sm">{data.phonetic}</p>
                            )}

                            {data.meanings.map((meaning, i) => (
                                <div key={i} className="space-y-2">
                                    <span className="text-xs font-bold text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded uppercase tracking-wider">
                                        {meaning.partOfSpeech}
                                    </span>
                                    <ul className="list-disc pl-4 space-y-2 text-slate-300">
                                        {meaning.definitions.slice(0, 3).map((def, j) => (
                                            <li key={j} className="text-sm leading-relaxed">
                                                {def.definition}
                                                {def.example && (
                                                    <p className="text-slate-500 text-xs mt-1 italic">"{def.example}"</p>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
