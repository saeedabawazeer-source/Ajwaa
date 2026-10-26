// ─────────────────────────────────────────────────────────────────────
// GEMINI FOOD DETECTION — photo → nutrition via free Gemini API
// Get your free API key at https://aistudio.google.com (1500 req/day free)
// The key is stored in localStorage: 'gemini_api_key'
// ─────────────────────────────────────────────────────────────────────

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export function getGeminiKey() { return localStorage.getItem('gemini_api_key') || ''; }
export function setGeminiKey(k) { localStorage.setItem('gemini_api_key', k.trim()); }

export async function detectFoodFromPhoto(base64Image, mimeType = 'image/jpeg') {
    const key = getGeminiKey();
    if (!key) return { error: 'no_key' };

    const prompt = `Analyze this food photo. You are an expert nutritionist specialized in Middle Eastern and Arabian Gulf (GCC) cuisine. Identify the dish. If it is a composite local dish (like Kabsa, Mandi, Biryani, Harees, Shakshuka, Shawarma), break it down into its core regional ingredients, estimate their portions in grams, and calculate the macro split. Account for standard regional cooking methods (use of ghee, basmati rice density). Return ONLY a JSON object with this exact structure: {"dish_name": string, "dish_name_ar": string, "confidence": number (0-1), "calories": integer, "protein_g": integer, "carbs_g": integer, "fat_g": integer, "ingredients": [{"name": string, "grams": integer, "calories": integer}]}`;

    try {
        const res = await fetch(`${GEMINI_URL}?key=${key}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { inline_data: { mime_type: mimeType, data: base64Image } },
                        { text: prompt },
                    ]
                }],
                generation_config: {
                    temperature: 0.1,
                    max_output_tokens: 1024,
                    response_mime_type: 'application/json',
                }
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            if (res.status === 429) return { error: 'rate_limited' };
            if (res.status === 400 && errText.includes('API key')) return { error: 'invalid_key' };
            return { error: 'api_error' };
        }

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) return { error: 'no_response' };

        // Parse JSON (handle markdown code blocks)
        const clean = text.replace(/```json\n?|\n?```/g, '').trim();
        const parsed = JSON.parse(clean);
        return {
            dish: parsed.dish_name || parsed.dish_name_en || 'Unknown',
            dishAr: parsed.dish_name_ar || '',
            confidence: parsed.confidence || 0.8,
            cals: Math.round(parsed.calories || parsed.total_estimated_calories || 0),
            protein: Math.round(parsed.protein_g || parsed.total_macros?.protein_g || 0),
            carbs: Math.round(parsed.carbs_g || parsed.total_macros?.carbs_g || 0),
            fat: Math.round(parsed.fat_g || parsed.total_macros?.fat_g || 0),
            ingredients: parsed.ingredients || parsed.ingredients_breakdown || [],
        };
    } catch (e) {
        console.error('Gemini detect error:', e);
        return { error: 'network' };
    }
}