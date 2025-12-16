'use client';

import { motion } from 'framer-motion';

type ResultCardProps = {
    length: number;
    words: { word: string; score: number }[];
    index: number;
    thresholdGood: number;
    thresholdGreat: number;
};

export default function ResultCard({ length, words, index, thresholdGood, thresholdGreat }: ResultCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 rounded-xl p-5 backdrop-blur-md shadow-lg hover:bg-white/10 transition-colors"
        >
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
                <h3 className="text-lg font-semibold text-violet-300">{length} Letters</h3>
                <span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-1 rounded-full">{words.length} words</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {words.map((item, i) => (
                    <motion.div
                        key={item.word}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.05 * i + (index * 0.1) }}
                        className="bg-slate-800/50 hover:bg-violet-600/20 text-slate-200 hover:text-white px-3 py-1.5 rounded-lg border border-white/5 text-lg font-medium tracking-wide transition-all cursor-default select-all flex items-baseline gap-0.5 group relative pr-5"
                    >
                        {item.word}
                        <span className={`text-[9px] font-bold absolute bottom-1 right-1.5 ${item.score >= thresholdGreat ? 'text-amber-400' :
                                item.score >= thresholdGood ? 'text-teal-400' :
                                    'text-slate-500 group-hover:text-violet-300'
                            }`}>
                            {item.score}
                        </span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
