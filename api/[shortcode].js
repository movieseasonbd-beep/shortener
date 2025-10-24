import { kv } from '@vercel/kv';

export const config = {
  runtime: 'edge', // Vercel-কে বলে দেওয়া হচ্ছে এটি Edge Function হিসেবে চলবে
};

export default async function handler(request) {
    // URL থেকে shortcode বের করা হচ্ছে
    const { searchParams } = new URL(request.url);
    const shortcode = searchParams.get('shortcode');

    if (!shortcode) {
        return new Response('Shortcode is required', { status: 400 });
    }
    
    try {
        const longUrl = await kv.get(shortcode);

        if (longUrl && typeof longUrl === 'string') {
            // 301 Redirect এর জন্য Response অবজেক্ট ব্যবহার করা হচ্ছে
            return new Response(null, {
                status: 301,
                headers: {
                    'Location': longUrl,
                },
            });
        } else {
            return new Response('URL not found', { status: 404 });
        }
    } catch (error) {
        console.error('Error in redirect function:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
