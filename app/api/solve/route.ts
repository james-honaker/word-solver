import { NextRequest, NextResponse } from 'next/server';
import { getDictionary } from '../../../utils/dictionary';

type SolveRequest = {
    letters: string;
};

type SolveResponse = {
    words: { word: string; score: number }[];
};

type FrequencyMap = { [key: string]: number };

const LETTER_SCORES: { [key: string]: number } = {
    a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1, m: 3,
    n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10
};

export async function POST(request: NextRequest) {
    console.log("API: Solve request received");
    const { letters } = await request.json() as SolveRequest;

    if (!letters || letters.length === 0) {
        return NextResponse.json({ words: [] });
    }

    const dictionary = await getDictionary();

    // Count wildcards and remove them from the letter map generation
    const cleanLetters = letters.toLowerCase().replace(/[^a-z?]/g, '');
    const wildcards = (cleanLetters.match(/\?/g) || []).length;
    const inputMap = getFrequencyMap(cleanLetters.replace(/\?/g, ''));

    const foundWords: { word: string; score: number }[] = [];

    for (const word of dictionary) {
        // Optimization: Skip words longer than input + wildcards
        if (word.length > cleanLetters.length || word.length < 2) continue;

        const wordMap = getFrequencyMap(word);

        if (canFormWord(inputMap, wordMap, wildcards)) {
            foundWords.push({
                word,
                score: getScore(word)
            });
        }
    }

    // Sort by length (descending) then alphabetically
    foundWords.sort((a, b) => b.word.length - a.word.length || a.word.localeCompare(b.word));

    return NextResponse.json<SolveResponse>({ words: foundWords });
}

function getScore(word: string): number {
    return word.split('').reduce((acc, char) => acc + (LETTER_SCORES[char] || 0), 0);
}

function getFrequencyMap(str: string): FrequencyMap {
    const map: FrequencyMap = {};
    for (const char of str) {
        map[char] = (map[char] || 0) + 1;
    }
    return map;
}

function canFormWord(inputMap: FrequencyMap, wordMap: FrequencyMap, wildcards: number): boolean {
    let neededWildcards = 0;

    for (const char in wordMap) {
        const countInWord = wordMap[char];
        const countInInput = inputMap[char] || 0;

        if (countInWord > countInInput) {
            neededWildcards += (countInWord - countInInput);
        }
    }

    return neededWildcards <= wildcards;
}
