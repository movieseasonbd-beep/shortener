import { kv } from '@vercel/kv';
import { nanoid } from 'nanoid';

export default async function handler(request, response) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    const { url } = request.body;
    if (!url) {
        return response.status(400).json({ error: 'URL is required' });
    }

    try {
        new URL(url); // URL টি বৈধ কিনা তা পরীক্ষা করা হচ্ছে
    } catch (error) {
        return response.status(400).json({ error: 'Invalid URL format' });
    }

    const shortCode = nanoid(7); 
    await kv.set(shortCode, url); 

    const shortUrl = `https://${request.headers.host}/${shortCode}`;
    
    return response.status(200).json({ shortUrl });
}
