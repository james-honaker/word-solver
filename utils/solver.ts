type FrequencyMap = { [key: string]: number };
export type WordResult = { word: string; score: number };

const LETTER_SCORES: { [key: string]: number } = {
    a: 1, b: 3, c: 3, d: 2, e: 1, f: 4, g: 2, h: 4, i: 1, j: 8, k: 5, l: 1, m: 3,
    n: 1, o: 1, p: 3, q: 10, r: 1, s: 1, t: 1, u: 1, v: 4, w: 4, x: 8, y: 4, z: 10
};

export type FilterOptions = {
    startsWith?: string;
    endsWith?: string;
    contains?: string;
};

export function solve(letters: string, dictionary: string[], filters?: FilterOptions): WordResult[] {
    if (!letters || letters.length === 0) {
        return [];
    }

    // Count wildcards and remove them from the letter map generation
    const cleanLetters = letters.toLowerCase().replace(/[^a-z?]/g, '');
    const wildcards = (cleanLetters.match(/\?/g) || []).length;
    const inputMap = getFrequencyMap(cleanLetters.replace(/\?/g, ''));

    // Normalize filters
    const startPattern = filters?.startsWith?.toLowerCase().trim();
    const endPattern = filters?.endsWith?.toLowerCase().trim();
    const containsPattern = filters?.contains?.toLowerCase().trim();

    const foundWords: WordResult[] = [];

    for (const word of dictionary) {
        // Optimization: Skip words longer than input + wildcards
        if (word.length > cleanLetters.length || word.length < 2) continue;

        // Apply Filters (Fastest checks first)
        if (startPattern && !word.startsWith(startPattern)) continue;
        if (endPattern && !word.endsWith(endPattern)) continue;
        if (containsPattern && !word.includes(containsPattern)) continue;

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

    return foundWords;
}

export function getScore(word: string): number {
    return word.split('').reduce((acc, char) => acc + (LETTER_SCORES[char] || 0), 0);
}

export function getFrequencyMap(str: string): FrequencyMap {
    const map: FrequencyMap = {};
    for (const char of str) {
        map[char] = (map[char] || 0) + 1;
    }
    return map;
}

export function canFormWord(inputMap: FrequencyMap, wordMap: FrequencyMap, wildcards: number): boolean {
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
