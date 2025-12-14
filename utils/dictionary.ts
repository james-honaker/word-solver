import fs from 'fs';
import path from 'path';

let dictionaryCache: string[] | null = null;

export async function getDictionary(): Promise<string[]> {
    if (dictionaryCache) return dictionaryCache;

    const dictPath = path.join(process.cwd(), 'public', 'dictionary.txt');

    try {
        const fileContent = fs.readFileSync(dictPath, 'utf-8');
        // Split by newlines and trim whitespace
        dictionaryCache = fileContent.split(/\r?\n/).map(w => w.trim().toLowerCase()).filter(w => w.length > 0);
        console.log(`Loaded dictionary with ${dictionaryCache.length} words.`);
    } catch (error) {
        console.error("Failed to load dictionary:", error);
        dictionaryCache = [];
    }

    return dictionaryCache;
}
