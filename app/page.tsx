'use client';
import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InputArea from './components/InputArea';
import ResultCard from './components/ResultCard';
import DefinitionModal from './components/DefinitionModal';
import FilterControls, { FilterState } from './components/FilterControls';

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
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({ startsWith: '', endsWith: '', contains: '' });

  const handleSolve = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!letters) return;

    setLoading(true);
    setError('');
    setResults(null);

    try {
      // Fetch all valid words (ignore filters on server for dynamic client filtering)
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

  // Apply filters client-side
  const filteredResults = results ? results.filter(item => {
    const word = item.word.toLowerCase();
    const start = filters.startsWith.toLowerCase();
    const end = filters.endsWith.toLowerCase();
    const has = filters.contains.toLowerCase();

    if (start && !word.startsWith(start)) return false;
    if (end && !word.endsWith(end)) return false;
    if (has && !word.includes(has)) return false;
    return true;
  }) : null;

  // Group words by length
  const groupedResults: GroupedResults = filteredResults ? filteredResults.reduce((acc: GroupedResults, item: WordResult) => {
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
    <main className="min-h-screen pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2 pt-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-violet-400 to-fuchsia-400 pb-2 tracking-tight drop-shadow-sm">
            Word Solver
          </h1>
          <p className="text-slate-400 text-lg md:text-xl max-w-lg mx-auto leading-relaxed font-medium">
            Find every word. Maximize every score.
          </p>
        </motion.div>

        {/* Input Section */}
        {/* Input Section */}
        <InputArea
          letters={letters}
          loading={loading}
          setLetters={setLetters}
          handleSolve={handleSolve}
          filters={filters}
          setFilters={setFilters}
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
                onWordClick={setSelectedWord}
              />
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedWord && (
            <DefinitionModal
              word={selectedWord}
              onClose={() => setSelectedWord(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
