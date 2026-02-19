
const MODEL_ID = 'gemini-3-flash-preview';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_ID}:generateContent`;

export interface WordExplanation {
    word: string;
    definition: string;
    pronunciation?: string;
    partOfSpeech: string;
    examples: string[];
    etymology?: string;
    funFact?: string;
}


export async function explainWord(word: string): Promise<WordExplanation> {
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not configured. Using mock data.');
        return getMockExplanation(word);
    }

    try {
        const prompt = `Provide a detailed explanation for the word "${word}".
        Include: definition, pronunciation, partOfSpeech, examples (array), etymology, and funFact.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                    // Native JSON enforcement (No more Regex needed!)
                    response_mime_type: "application/json"
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const parsed = JSON.parse(text);

        return {
            word: word.toUpperCase(),
            definition: parsed.definition || 'Definition not available',
            pronunciation: parsed.pronunciation,
            partOfSpeech: parsed.partOfSpeech || 'unknown',
            examples: parsed.examples || [],
            etymology: parsed.etymology,
            funFact: parsed.funFact,
        };

    } catch (error) {
        console.error('AI explanation error:', error);
        return getMockExplanation(word);
    }
}

/**
 * Mock data remains the same for offline fallback
 */
function getMockExplanation(word: string): WordExplanation {
    // ... (Keep your existing mock logic here)
    return { word: word.toUpperCase(), definition: 'Mock data...', partOfSpeech: 'noun', examples: [] };
}

export default { explainWord };
