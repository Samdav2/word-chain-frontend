/**
 * AI Service for word explanations using Gemini API
 * Configure your API key in environment variables
 */

// Gemini API configuration
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent';

export interface WordExplanation {
    word: string;
    definition: string;
    pronunciation?: string;
    partOfSpeech: string;
    examples: string[];
    etymology?: string;
    funFact?: string;
}

/**
 * Get a detailed explanation of a word using Gemini AI
 */
export async function explainWord(word: string): Promise<WordExplanation> {
    // If no API key, return mock data
    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not configured. Using mock data.');
        return getMockExplanation(word);
    }

    try {
        const prompt = `Provide a detailed explanation for the word "${word}" in JSON format with these fields:
        - definition: A clear, educational definition
        - pronunciation: Phonetic pronunciation
        - partOfSpeech: noun, verb, adjective, etc.
        - examples: Array of 2-3 example sentences
        - etymology: Brief origin of the word
        - funFact: An interesting fact about this word

        Return ONLY valid JSON, no markdown.`;

        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.3,
                    maxOutputTokens: 500,
                },
            }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
                word: word.toUpperCase(),
                definition: parsed.definition || 'Definition not available',
                pronunciation: parsed.pronunciation,
                partOfSpeech: parsed.partOfSpeech || 'unknown',
                examples: parsed.examples || [],
                etymology: parsed.etymology,
                funFact: parsed.funFact,
            };
        }

        return getMockExplanation(word);
    } catch (error) {
        console.error('AI explanation error:', error);
        return getMockExplanation(word);
    }
}

/**
 * Get mock explanation when API is unavailable
 */
function getMockExplanation(word: string): WordExplanation {
    const mockDefinitions: Record<string, WordExplanation> = {
        'ATOM': {
            word: 'ATOM',
            definition: 'The smallest unit of ordinary matter that forms a chemical element.',
            pronunciation: '/ˈætəm/',
            partOfSpeech: 'noun',
            examples: [
                'An atom consists of protons, neutrons, and electrons.',
                'Water molecules are made of hydrogen and oxygen atoms.',
            ],
            etymology: 'From Greek "atomos" meaning indivisible',
            funFact: 'If an atom were the size of a football stadium, the nucleus would be the size of a pea!',
        },
        'CELL': {
            word: 'CELL',
            definition: 'The smallest structural and functional unit of an organism.',
            pronunciation: '/sel/',
            partOfSpeech: 'noun',
            examples: [
                'The human body contains trillions of cells.',
                'Plant cells have rigid cell walls.',
            ],
            etymology: 'From Latin "cella" meaning small room',
            funFact: 'Red blood cells travel about 12,000 miles through your body every day!',
        },
    };

    return mockDefinitions[word.toUpperCase()] || {
        word: word.toUpperCase(),
        definition: `A word used in vocabulary building exercises.`,
        pronunciation: `/${word.toLowerCase()}/`,
        partOfSpeech: 'noun',
        examples: [
            `The word "${word}" can be formed by changing one letter.`,
            `"${word}" is part of this word chain puzzle.`,
        ],
        etymology: 'English vocabulary word',
        funFact: `"${word}" has ${word.length} letters and is perfect for word chain games!`,
    };
}

export default { explainWord };
