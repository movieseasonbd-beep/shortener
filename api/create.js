import { kv } from '@vercel/kv';
// nanoid ইম্পোর্ট করার পদ্ধতি পরিবর্তন করা হয়েছে
import { nanoid } from 'nanoid';

export const config = {
  runtime: 'edge', // Vercel-কে বলে দেওয়া হচ্ছে এটি Edge Function হিসেবে চলবে
};

export default async function handler(request) {
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    const { url } = await request.json();
    if (!url) {
        return new Response(JSON.stringify({ error: 'URL is required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        new URL(url);
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Invalid URL format' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    try {
        const shortCode = nanoid(7);
        await kv.set(shortCode, url);

        const host = request.headers.get('host');
        const shortUrl = `https://${host}/${shortCode}`;
        
        return new Response(JSON.stringify({ shortUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error('Error in create function:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}
