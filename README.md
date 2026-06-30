# Sparkling Designs — Website

## What changed in this update

1. **Rebrand**: "Kundan Shine" → "Sparkling Designs" everywhere (navbar, footer, page titles, admin login, WhatsApp message text).
<<<<<<< HEAD
2. **Admin login is hardcoded**: username `9551918485`, password `Test123*`. Only these credentials work.
3. **Contact Us (footer)**: address changed to "Velachery, Chennai - 42", email line removed.
4. **Real shared backend (Supabase)**: products and product images now live in a Supabase database + storage bucket instead of browser `localStorage`. This is the fix for:
   - Admin-uploaded/edited products not showing on the live site
   - Product images not displaying
   - Changes made in Admin not being visible to other visitors
5. **Image upload in Admin**: you can now drag-and-drop image files (or click to browse) directly in Add/Edit Product — they're uploaded to Supabase Storage automatically. The old "paste an image URL" option is still there too, as a fallback.
=======
2. **Contact Us (footer)**: address changed to "Velachery, Chennai - 42", email line removed.
3. **Real shared backend (Supabase)**: products and product images now live in a Supabase database + storage bucket instead of browser `localStorage`. This is the fix for:
   - Admin-uploaded/edited products not showing on the live site
   - Product images not displaying
   - Changes made in Admin not being visible to other visitors
4. **Image upload in Admin**: you can now drag-and-drop image files (or click to browse) directly in Add/Edit Product — they're uploaded to Supabase Storage automatically. The old "paste an image URL" option is still there too, as a fallback.
>>>>>>> c17bb6e9678f3071a714cacfd212991783d7f4b9

## One-time setup you need to do

### 1. Create a free Supabase project
Go to [supabase.com](https://supabase.com), sign up, and create a new project (pick any name/region/password — the password is just for direct DB access, you won't need it for the app).

### 2. Run the database setup script
In your Supabase project dashboard: **SQL Editor → New query**, paste in the entire contents of `supabase/setup.sql` from this project, and click **Run**. This creates the `products` table and the `product-images` storage bucket with the right permissions.

### 3. Get your project credentials
In your Supabase dashboard: **Project Settings → API**. You'll need two values:
- **Project URL** (looks like `https://xxxxx.supabase.co`)
- **anon public** key (a long string starting with `eyJ...`)

### 4. Add credentials to the app
Copy `.env.example` to a new file named `.env` in the project root, and fill in the two values from step 3:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```
This `.env` file is already in `.gitignore` so it won't be committed.

### 5. Migrate the existing 137 product photos
This uploads every image currently in `public/images/products_raw/` into Supabase Storage and creates one product per image in the database.

You'll need a **different** key for this one step only: the **service_role** key (also under Project Settings → API — keep this one secret, never put it in the app itself).

From the project root:
```bash
npm install
SUPABASE_URL=https://xxxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJ... node scripts/migrate-products.mjs
```
This only needs to be run once. It will print progress as it uploads each image and inserts products.

### 6. Run the site
```bash
npm install
npm run dev
```
Visit the local URL it gives you. The Catalog, Home page, and Admin dashboard should now all show the same 137 products, and images should load correctly.

### 7. Deploy
When you deploy to your hosting provider (Vercel, Netlify, etc.), set the same two environment variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`) in that provider's dashboard — the same way you'd set any other environment variable for the build.

## Notes

- The `products.json` file in the project root is old unused placeholder data — it's not read by the app anywhere, safe to ignore or delete.
- Admin write access (add/edit/delete products) currently relies only on the app's own login screen, not a database-level login. For a small storefront like this that's a reasonable trade-off, but it does mean the database itself doesn't check who's writing. If you'd like database-level protection too (so even a direct API call needs a real login), that's a follow-up we can add using Supabase Auth.
