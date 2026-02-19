
// 1. Configuration
const MODEL_ID = 'gemini-3-flash-preview';
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
// Using v1beta to access thinking_config and JSON response features
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
    // Fallback if API key is missing
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not configured. Using mock data.');
        return getMockExplanation(word);
    }

    try {
        const prompt = `
            Act as an expert educator. Provide a detailed, clear explanation for the word: "${word}".
            Return the response strictly as a JSON object with these keys:
            - definition: A clear, educational definition.
            - pronunciation: Phonetic pronunciation (e.g., /ˌedʒ.uˈkeɪ.ʃən/).
            - partOfSpeech: noun, verb, adjective, etc.
            - examples: An array of 2-3 engaging example sentences.
            - etymology: The origin story of the word.
            - funFact: A surprising fact to help students remember it.
        `;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.2, // Low temperature for consistent JSON
                    maxOutputTokens: 1500, // Plenty of room for the answer
                    response_mime_type: "application/json",
                },
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Gemini API Error:', errorData);
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) throw new Error("Empty response from Gemini");

        const parsed = JSON.parse(text);

        return {
            word: word.toUpperCase(),
            definition: parsed.definition || 'No definition found.',
            pronunciation: parsed.pronunciation,
            partOfSpeech: parsed.partOfSpeech || 'unknown',
            examples: parsed.examples || [],
            etymology: parsed.etymology,
            funFact: parsed.funFact,
        };

    } catch (error) {
        console.error('AI Request failed:', error);
        // Return mock data so the app doesn't crash for the student
        return getMockExplanation(word);
    }
}


function getMockExplanation(word: string): WordExplanation {
    return {
        word: word.toUpperCase(),
        definition: `Educational content for "${word}" is currently being prepared.`,
        pronunciation: `/${word.toLowerCase()}/`,
        partOfSpeech: 'noun',
        examples: [`Learning about "${word}" helps build your vocabulary!`],
        etymology: 'Vocabulary building module',
        funFact: 'Did you know that learning new words improves brain plasticity?'
    };
}

export default { explainWord };
