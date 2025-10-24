import { kv } from '@vercel/kv';

export default async function handler(request, response) {
    const { shortcode } = request.query;
    if (!shortcode) {
        return response.status(400).send('Shortcode is required');
    }
    
    try {
        const longUrl = await kv.get(shortcode);

        if (longUrl && typeof longUrl === 'string') {
            return response.redirect(301, longUrl);
        } else {
            return response.status(404).send('URL not found');
        }
    } catch (error) {
        console.error(error);
        return response.status(500).send('Internal Server Error');
    }
}
