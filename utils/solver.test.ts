import { describe, it, expect } from 'vitest';
import { solve, getScore, canFormWord, getFrequencyMap } from './solver';

describe('Solver Logic', () => {
    const dictionary = ['apple', 'banana', 'cat', 'dog', 'ant', 'art', 'act', 'quartz'];

    it('calculates frequency maps correctly', () => {
        expect(getFrequencyMap('hello')).toEqual({ h: 1, e: 1, l: 2, o: 1 });
    });

    it('calculates scores correctly', () => {
        expect(getScore('cat')).toBe(5); // c3 + a1 + t1 = 5
        expect(getScore('quartz')).toBe(24); // q10 + u1 + a1 + r1 + t1 + z10 = 24
    });

    it('identifies if a word can be formed', () => {
        const inputMap = getFrequencyMap('act');
        const wordMap = getFrequencyMap('cat');
        expect(canFormWord(inputMap, wordMap, 0)).toBe(true);
    });

    it('solves simple anagrams', () => {
        const results = solve('act', dictionary);
        const words = results.map(r => r.word);
        expect(words).toContain('cat');
        expect(words).toContain('act');
        expect(words).not.toContain('dog');
    });

    it('handles wildcards correctly', () => {
        // A?T -> ANT, ART, ACT
        const results = solve('a?t', dictionary);
        const words = results.map(r => r.word);
        expect(words).toContain('ant');
        expect(words).toContain('art');
        expect(words).toContain('act');
        expect(words).not.toContain('apple');
    });

    it('respects wildcard limits', () => {
        // A?T only has 1 wildcard. Needs 2 for APPLE (P, L, E vs A, T - wait. A,P,P,L,E vs A,?,T)
        // APPLE needs P,P,L,E. Input has A,T,?. Missing P,P,L,E. 4 missing. 1 wildcard. Fail.
        const results = solve('a?t', dictionary);
        expect(results.map(r => r.word)).not.toContain('apple');
    });

    it('returns empty array for empty input', () => {
        expect(solve('', dictionary)).toEqual([]);
    });
});
