import { NextRequest, NextResponse } from 'next/server';
import { getDictionary } from '../../../utils/dictionary';
import { solve } from '../../../utils/solver';

type SolveRequest = {
    letters: string;
    filters?: {
        startsWith?: string;
        endsWith?: string;
        contains?: string;
    }
};

type SolveResponse = {
    words: { word: string; score: number }[];
};

export async function POST(request: NextRequest) {
    const { letters, filters } = await request.json() as SolveRequest;

    if (!letters || letters.length === 0) {
        return NextResponse.json({ words: [] });
    }

    const dictionary = await getDictionary();
    const foundWords = solve(letters, dictionary, filters);

    return NextResponse.json<SolveResponse>({ words: foundWords });
}
