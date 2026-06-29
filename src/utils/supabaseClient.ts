import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
    const message =
        'Missing Supabase configuration. Please create a .env file in the project root with ' +
        'VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY set (see .env.example and README.md).';
    // eslint-disable-next-line no-console
    console.error(message);
}

// Supabase's createClient() throws synchronously if given an empty URL, which
// would crash the whole app to a blank white screen before React can render
// anything (including a helpful error message). Use a clearly-fake but
// well-formed placeholder URL when not configured, so the app still boots
// and individual data calls fail gracefully instead of crashing on load.
export const supabase = createClient(
    supabaseUrl || 'https://not-configured.supabase.co',
    supabaseAnonKey || 'not-configured'
);

export const PRODUCT_IMAGES_BUCKET = 'product-images';

