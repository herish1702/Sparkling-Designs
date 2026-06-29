/**
 * One-time migration script.
 *
 * Scans public/images/products_raw/<Category>/*.jpg|jpeg|png, uploads every
 * image to Supabase Storage (bucket: product-images), and inserts one
 * product row per image into the `products` table — using the same
 * naming/pricing conventions as the original hand-written seed data.
 *
 * Usage:
 *   1. Run scripts/supabase_schema.sql in the Supabase SQL editor first.
 *   2. Set these two environment variables (do NOT commit the service key):
 *        SUPABASE_URL=https://xxxx.supabase.co
 *        SUPABASE_SERVICE_ROLE_KEY=eyJ...   (Project Settings > API > service_role)
 *   3. node scripts/migrate-products.mjs
 *
 * The service_role key is required (not the anon key) because this script
 * needs to bypass Row Level Security to bulk-insert/upload in one go.
 * Never put the service_role key in frontend code or commit it to git.
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_RAW_DIR = path.join(__dirname, '..', 'public', 'images', 'products_raw');
const BUCKET = 'product-images';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('ERROR: Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    console.error('Example:');
    console.error('  SUPABASE_URL=https://xxxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJ... node scripts/migrate-products.mjs');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// Category folder name -> { slug, label, descriptionTemplate, material, colors, sizes }
const CATEGORY_MAP = {
    '3D Kundan Hair Bands': {
        slug: 'hair-bands',
        namePrefix: '3D Kundan Hair Band',
        codePrefix: 'KS-HB',
        description: 'Exquisite 3D Kundan hair band with intricate stonework.',
        material: 'Premium Kundan Stones, Gold-Plated Base',
        colors: ['Red', 'Dark Blue', 'Pink', 'Orange', 'Green', 'Yellow', 'Purple', 'Gold', 'White'],
        sizes: ['Small', 'Medium', 'Large'],
    },
    'Alligator clips': {
        slug: 'hair-clips',
        namePrefix: 'Alligator Clip',
        codePrefix: 'KS-AC',
        description: 'Beautifully crafted alligator hair clip.',
        material: 'Metal Alloy, Gold-Plated, Kundan Stones',
        colors: ['Red', 'Dark Blue', 'Pink', 'Orange', 'Green', 'Yellow', 'Purple', 'Gold', 'White'],
        sizes: ['2.0', '2.2', '2.4', '2.6', '2.8'],
    },
    'Bangles': {
        slug: 'bangles',
        namePrefix: 'Kundan Bangles',
        codePrefix: 'KS-BG',
        description: 'Traditional handcrafted bangles set.',
        material: 'Gold-Plated Brass, Kundan Stones',
        colors: ['Gold', 'Matte Gold', 'Antique Gold', 'Silver'],
        sizes: ['2.2 inch', '2.4 inch', '2.6 inch'],
    },
    'Bracelets': {
        slug: 'bracelets',
        namePrefix: 'Kundan Bracelet',
        codePrefix: 'KS-BR',
        description: 'Elegant bracelet with Kundan stones and pearl accents.',
        material: 'Crackle Beads',
        colors: ['Black', 'White', 'Red', 'Pink', 'Green', 'Yellow', 'Orange'],
        sizes: ['Adjustable'],
    },
    'Center Clips': {
        slug: 'center-clips',
        namePrefix: 'Center Clip',
        codePrefix: 'KS-CC',
        description: 'Stunning center clip with detailed Kundan work.',
        material: 'Kundan Stones',
        colors: ['Red', 'Dark Blue', 'Pink', 'Orange', 'Green', 'Yellow', 'Purple', 'Gold', 'White'],
        sizes: ['5 cm', '7 cm', '8 cm'],
    },
    'Combo': {
        slug: 'combos',
        namePrefix: 'Combo Offer',
        codePrefix: 'KS-CB',
        description: 'Curated combo set with matching Kundan jewelry pieces.',
        material: 'Kundan Stones, Gold-Plated',
        colors: ['Red', 'Dark Blue', 'Pink', 'Orange', 'Green', 'Yellow', 'Purple', 'Gold', 'White'],
        sizes: ['Standard Set'],
    },
    'Ear Rings': {
        slug: 'earrings',
        namePrefix: 'Kundan Ear Rings',
        codePrefix: 'KS-ER',
        description: 'Handcrafted ear rings with premium Kundan stones.',
        material: 'Gold-Plated, Kundan Stones, Faux Pearls',
        colors: ['Red', 'Dark Blue', 'Pink', 'Orange', 'Green', 'Yellow', 'Purple', 'Gold', 'White'],
        sizes: ['Standard'],
    },
    'Invisible Chains': {
        slug: 'necklace-chains',
        namePrefix: 'Invisible Chain',
        codePrefix: 'KS-NC',
        description: 'Premium invisible chain necklace.',
        material: 'AD Stones Pendant',
        colors: ['White'],
        sizes: ['Standard'],
    },
    'Saree Pins': {
        slug: 'saree-pins',
        namePrefix: 'Kundan Saree Pin',
        codePrefix: 'KS-SP',
        description: 'Traditional saree pin with authentic Kundan stones.',
        material: 'Kundan Stones, Gold-Plated Brass',
        colors: ['Red', 'Dark Blue', 'Pink', 'Orange', 'Green', 'Yellow', 'Purple', 'Gold', 'White'],
        sizes: ['Standard'],
    },
};

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function randomPriceFor(slug) {
    // Roughly mirrors the original price ranges per category
    const ranges = {
        'hair-bands': [45, 150],
        'hair-clips': [40, 130],
        'bangles': [60, 150],
        'bracelets': [65, 65],
        'center-clips': [40, 150],
        'earrings': [40, 150],
        'necklace-chains': [100, 150],
        'saree-pins': [30, 30],
        'combos': [100, 150],
    };
    const [min, max] = ranges[slug] || [40, 150];
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    return `₹${value}`;
}

function randomRating() {
    return +(4.5 + Math.random() * 0.5).toFixed(1);
}

async function uploadFile(localPath, storagePath) {
    const fileBuffer = fs.readFileSync(localPath);
    const ext = path.extname(localPath).toLowerCase();
    const contentType = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg';

    const { error } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, fileBuffer, { contentType, upsert: true });

    if (error) {
        throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
    }

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    return data.publicUrl;
}

function sanitizeForPath(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9.]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function main() {
    const folders = fs.readdirSync(PRODUCTS_RAW_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

    console.log(`Found ${folders.length} category folders.`);

    const productsToInsert = [];
    let totalImages = 0;
    let uploadedCount = 0;

    for (const folderName of folders) {
        const meta = CATEGORY_MAP[folderName];
        if (!meta) {
            console.warn(`  Skipping unrecognized folder: "${folderName}"`);
            continue;
        }

        const folderPath = path.join(PRODUCTS_RAW_DIR, folderName);
        const files = fs.readdirSync(folderPath)
            .filter((f) => IMAGE_EXTENSIONS.has(path.extname(f).toLowerCase()))
            .sort();

        console.log(`\n[${folderName}] -> category "${meta.slug}", ${files.length} images`);
        totalImages += files.length;

        let designIndex = 1;
        for (const fileName of files) {
            const localPath = path.join(folderPath, fileName);
            const ext = path.extname(fileName).toLowerCase();
            const storagePath = `products/${meta.slug}/${sanitizeForPath(path.basename(fileName, ext))}-${Date.now()}-${designIndex}${ext}`;

            process.stdout.write(`  Uploading (${designIndex}/${files.length}): ${fileName} ... `);
            try {
                const publicUrl = await uploadFile(localPath, storagePath);
                console.log('done');
                uploadedCount++;

                productsToInsert.push({
                    name: `${meta.namePrefix} - Design ${designIndex}`,
                    code: `${meta.codePrefix}-${String(designIndex).padStart(3, '0')}`,
                    category: meta.slug,
                    description: meta.description,
                    material: meta.material,
                    colors: meta.colors,
                    sizes: meta.sizes,
                    images: [publicUrl],
                    price: randomPriceFor(meta.slug),
                    featured: designIndex <= 3,
                    new_arrival: designIndex <= 5,
                    best_seller: designIndex % 4 === 0,
                    newly_added: false,
                    customization_available: meta.slug !== 'saree-pins',
                    rating: randomRating(),
                });
            } catch (err) {
                console.log('FAILED');
                console.error(`    ${err.message}`);
            }
            designIndex++;
        }
    }

    console.log(`\nUploaded ${uploadedCount}/${totalImages} images.`);
    console.log(`Inserting ${productsToInsert.length} products into the database...`);

    // Insert in batches of 50 to stay well within request size limits
    const BATCH_SIZE = 50;
    let insertedCount = 0;
    for (let i = 0; i < productsToInsert.length; i += BATCH_SIZE) {
        const batch = productsToInsert.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('products').insert(batch);
        if (error) {
            console.error(`  Batch insert failed at offset ${i}: ${error.message}`);
        } else {
            insertedCount += batch.length;
            console.log(`  Inserted ${insertedCount}/${productsToInsert.length}`);
        }
    }

    console.log('\nMigration complete.');
    console.log(`  Images uploaded: ${uploadedCount}`);
    console.log(`  Products inserted: ${insertedCount}`);
}

main().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
