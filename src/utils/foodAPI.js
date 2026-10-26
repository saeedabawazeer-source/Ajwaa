// OpenFoodFacts API — free, open food database with 3M+ products
const BASE = 'https://world.openfoodfacts.org';

export async function searchFood(query) {
    try {
        const r = await fetch(`${BASE}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&json=1&page_size=12`);
        const d = await r.json();
        if (!d.products) return [];
        return d.products.filter(p => p.product_name && p.nutriments).map(p => ({
            name: p.product_name,
            brand: p.brands || '',
            image: p.image_thumb_url || p.image_small_url || '',
            cals: Math.round(p.nutriments['energy-kcal_100g'] || p.nutriments['energy-kcal_serving'] || 0),
            protein: Math.round((p.nutriments.proteins_100g || 0) * 10) / 10,
            carbs: Math.round((p.nutriments.carbohydrates_100g || 0) * 10) / 10,
            fat: Math.round((p.nutriments.fat_100g || 0) * 10) / 10,
            serving: p.serving_size || '100g',
        }));
    } catch { return []; }
}

export async function lookupBarcode(code) {
    try {
        const r = await fetch(`${BASE}/api/v0/product/${code}.json`);
        const d = await r.json();
        if (!d.product || d.status !== 1) return null;
        const p = d.product;
        return {
            name: p.product_name || 'Unknown',
            brand: p.brands || '',
            image: p.image_thumb_url || p.image_small_url || '',
            cals: Math.round(p.nutriments?.['energy-kcal_100g'] || p.nutriments?.['energy-kcal_serving'] || 0),
            protein: Math.round((p.nutriments?.proteins_100g || 0) * 10) / 10,
            carbs: Math.round((p.nutriments?.carbohydrates_100g || 0) * 10) / 10,
            fat: Math.round((p.nutriments?.fat_100g || 0) * 10) / 10,
            serving: p.serving_size || '100g',
        };
    } catch { return null; }
}