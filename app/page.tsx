'use client';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputArea from './components/InputArea';
import ResultCard from './components/ResultCard';

type WordResult = {
  word: string;
  score: number;
};

type GroupedResults = {
  [length: number]: WordResult[];
};

export default function Home() {
  const [letters, setLetters] = useState<string>('');
  const [results, setResults] = useState<WordResult[] | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSolve = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!letters) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ letters }),
      });

      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setResults(data.words);
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Group words by length
  const groupedResults: GroupedResults = results ? results.reduce((acc: GroupedResults, item: WordResult) => {
    const len = item.word.length;
    if (!acc[len]) acc[len] = [];
    acc[len].push(item);
    return acc;
  }, {}) : {};

  // Sort lengths descending
  const sortedLengths = Object.keys(groupedResults)
    .map(Number)
    .sort((a, b) => b - a);

  // Calculate scoring thresholds (Dynamic Percentiles)
  const allScores = results ? results.map(r => r.score).sort((a, b) => a - b) : [];
  const thresholdGreat = allScores.length > 0 ? allScores[Math.floor(allScores.length * 0.8)] : 0;
  const thresholdGood = allScores.length > 0 ? allScores[Math.floor(allScores.length * 0.5)] : 0;

  return (
    <main className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-12">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-400 pb-2">
            Word Solver
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
            Unscramble your potential using our high-speed algorithm.
          </p>
        </motion.div>

        {/* Input Section */}
        <InputArea
          letters={letters}
          loading={loading}
          setLetters={setLetters}
          handleSolve={handleSolve}
        />

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-red-400 bg-red-400/10 px-4 py-2 rounded-lg inline-block"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Results Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <AnimatePresence>
            {results && results.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center text-slate-500 py-10"
              >
                No words found. Try adding more letters!
              </motion.div>
            )}

            {sortedLengths.map((len, index) => (
              <ResultCard
                key={len}
                length={len}
                words={groupedResults[len]}
                index={index}
                thresholdGood={thresholdGood}
                thresholdGreat={thresholdGreat}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
