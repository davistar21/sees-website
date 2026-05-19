/**
 * One-time script: copies all existing Supabase Storage images → Cloudinary
 * and updates image_url values in the DB.
 *
 * Usage:
 *   node scripts/migrate-images-to-cloudinary.mjs
 *
 * Required env vars (set inline or in a .env):
 *   SUPABASE_URL           — your project URL (same as VITE_SUPABASE_URL)
 *   SUPABASE_SERVICE_KEY   — service role key (NOT the anon key — get it from
 *                            Supabase dashboard → Project Settings → API)
 *   CLOUDINARY_CLOUD_NAME  — same as VITE_CLOUDINARY_CLOUD_NAME
 *   CLOUDINARY_PRESET      — same as VITE_CLOUDINARY_UPLOAD_PRESET
 *
 * Example:
 *   SUPABASE_URL=https://xxx.supabase.co \
 *   SUPABASE_SERVICE_KEY=eyJ... \
 *   CLOUDINARY_CLOUD_NAME=mycloud \
 *   CLOUDINARY_PRESET=sees_unsigned \
 *   node scripts/migrate-images-to-cloudinary.mjs
 */

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const PRESET = process.env.CLOUDINARY_PRESET;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !CLOUD_NAME || !PRESET) {
  console.error("Missing required env vars. See usage comment at top of file.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function uploadUrlToCloudinary(imageUrl, folder) {
  const formData = new FormData();
  formData.append("file", imageUrl);
  formData.append("upload_preset", PRESET);
  formData.append("folder", `sees/${folder}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message ?? `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.secure_url;
}

function isSupabaseUrl(url) {
  return typeof url === "string" && url.includes(".supabase.co");
}

async function migrateColumn(table, idColumn, imageColumn, folder) {
  const { data, error } = await supabase
    .from(table)
    .select(`${idColumn}, ${imageColumn}`)
    .not(imageColumn, "is", null);

  if (error) {
    console.error(`  [${table}] fetch error:`, error.message);
    return;
  }

  const toMigrate = data.filter((row) => isSupabaseUrl(row[imageColumn]));
  console.log(`  [${table}] ${toMigrate.length} / ${data.length} rows need migration`);

  for (const row of toMigrate) {
    try {
      const newUrl = await uploadUrlToCloudinary(row[imageColumn], folder);
      await supabase
        .from(table)
        .update({ [imageColumn]: newUrl })
        .eq(idColumn, row[idColumn]);
      console.log(`    ✓ ${row[idColumn]}`);
    } catch (err) {
      console.error(`    ✗ ${row[idColumn]}: ${err.message}`);
    }
  }
}

// ---------------------------------------------------------------------------
// Events gallery (stored as JSON array of {url, description})
// ---------------------------------------------------------------------------

async function migrateEventsGallery() {
  const { data, error } = await supabase
    .from("events")
    .select("id, gallery_images")
    .not("gallery_images", "is", null);

  if (error) {
    console.error("  [events gallery] fetch error:", error.message);
    return;
  }

  const toMigrate = data.filter(
    (row) =>
      Array.isArray(row.gallery_images) &&
      row.gallery_images.some((img) => isSupabaseUrl(img.url))
  );

  console.log(`  [events/gallery] ${toMigrate.length} events have gallery images to migrate`);

  for (const row of toMigrate) {
    const newGallery = [];
    for (const img of row.gallery_images) {
      if (isSupabaseUrl(img.url)) {
        try {
          const newUrl = await uploadUrlToCloudinary(img.url, "events/gallery");
          newGallery.push({ ...img, url: newUrl });
          console.log(`    ✓ event ${row.id} gallery image`);
        } catch (err) {
          console.error(`    ✗ event ${row.id} gallery image: ${err.message}`);
          newGallery.push(img);
        }
      } else {
        newGallery.push(img);
      }
    }
    await supabase
      .from("events")
      .update({ gallery_images: newGallery })
      .eq("id", row.id);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Starting Supabase → Cloudinary image migration...\n");

  await migrateColumn("team_members",  "id", "image_url", "teams");
  await migrateColumn("executives",    "id", "image_url", "executives");
  await migrateColumn("blog_posts",    "id", "image_url", "blog");
  await migrateColumn("spotlight",     "id", "image_url", "spotlight");
  await migrateColumn("events",        "id", "image_url", "events");
  await migrateColumn("hod_profile",   "id", "image_url", "hod");
  await migrateEventsGallery();

  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
