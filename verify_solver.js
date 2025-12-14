

async function testSolver() {
    const port = 3000;
    const baseUrl = `http://localhost:${port}/api/solve`;

    console.log(`Testing Solver API at ${baseUrl}...`);

    const cases = [
        { input: 'art', expected: ['art', 'rat', 'tar'] },
        { input: 'oo', expected: [] },
        { input: 'a', expected: [] },
        { input: 'xyz', expected: [] },
        { input: 'qqqi', expected: ['qi'] },
        { input: 'a?t', expected: ['art', 'act', 'ant'] }, // Wildcard test
        { input: 'p?t', expected: ['pat', 'pet', 'pit', 'pot', 'put'] } // Wildcard test 2
    ];

    async function fetchWithRetry(url, options, retries = 5, delay = 1000) {
        for (let i = 0; i < retries; i++) {
            try {
                return await fetch(url, options);
            } catch (err) {
                if (i === retries - 1) throw err;
                await new Promise(res => setTimeout(res, delay));
            }
        }
    }

    for (const c of cases) {
        console.log(`Testing input: "${c.input}"`);
        try {
            const res = await fetchWithRetry(baseUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ letters: c.input })
            });

            if (!res.ok) {
                console.error(`Failed: Status ${res.status}`);
                continue;
            }

            const data = await res.json();
            // Map objects to just words for legacy checking
            const rawResults = data.words;
            const words = rawResults.map(w => w.word);

            console.log(`  Found ${words.length} words: ${words.slice(0, 5).join(', ')}...`);
            if (rawResults.length > 0) {
                console.log(`  Example Score: ${rawResults[0].word} = ${rawResults[0].score} pts`);
            }

            // Basic assertion
            if (c.expected.length > 0) {
                const foundAll = c.expected.every(w => words.includes(w));
                if (foundAll) console.log('  ✅ SUCCESS: Expected words found.');
                else console.log('  ❌ FAILURE: Missing expected words.');
            } else {
                if (words.length === 0) console.log('  ✅ SUCCESS: Correctly found no words.');
                else console.log('  ⚠️ Note: Found words where none expected (or dictionary is generous).');
            }

        } catch (e) {
            console.error("  ❌ Error:", e.message);
        }
    }
}

testSolver();
