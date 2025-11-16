import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Supabase credentials from env
const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const BUCKET_NAME = 'audio-practices';
const AUDIO_DIRS = [
  path.join(__dirname, '../public/practices p1'),
  path.join(__dirname, '../public/adaptive-practices'),
];

interface UploadStats {
  total: number;
  uploaded: number;
  skipped: number;
  failed: number;
}

async function ensureBucketExists() {
  console.log(`\n🪣 Checking if bucket "${BUCKET_NAME}" exists...`);
  
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('❌ Error listing buckets:', listError);
    throw listError;
  }

  const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

  if (!bucketExists) {
    console.log(`📦 Creating bucket "${BUCKET_NAME}"...`);
    const { error: createError } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: 10485760, // 10MB per file
    });

    if (createError) {
      console.error('❌ Error creating bucket:', createError);
      throw createError;
    }
    console.log('✅ Bucket created successfully');
  } else {
    console.log('✅ Bucket already exists');
  }
}

function getAllAudioFiles(dir: string, baseDir: string = dir): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`⚠️  Directory not found: ${dir}`);
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      files.push(...getAllAudioFiles(fullPath, baseDir));
    } else if (entry.isFile() && /\.(mp3|wav|ogg|m4a)$/i.test(entry.name)) {
      const relativePath = path.relative(baseDir, fullPath);
      files.push(relativePath);
    }
  }

  return files;
}

async function uploadFile(filePath: string, baseDir: string): Promise<boolean> {
  const fullPath = path.join(baseDir, filePath);
  const fileBuffer = fs.readFileSync(fullPath);
  
  // Convert Windows paths to forward slashes for Supabase
  const storagePath = filePath.replace(/\\/g, '/');
  
  // Check if file already exists
  const { data: existing } = await supabase.storage
    .from(BUCKET_NAME)
    .list(path.dirname(storagePath));

  const fileName = path.basename(storagePath);
  if (existing?.some(f => f.name === fileName)) {
    console.log(`⏭️  Skipping (already exists): ${storagePath}`);
    return true;
  }

  // Upload file
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(storagePath, fileBuffer, {
      contentType: 'audio/mpeg',
      cacheControl: '31536000', // 1 year cache
      upsert: false,
    });

  if (error) {
    console.error(`❌ Failed to upload ${storagePath}:`, error.message);
    return false;
  }

  console.log(`✅ Uploaded: ${storagePath}`);
  return true;
}

async function uploadAllAudio() {
  const stats: UploadStats = {
    total: 0,
    uploaded: 0,
    skipped: 0,
    failed: 0,
  };

  console.log('\n🎵 Starting audio upload to Supabase Storage...\n');

  // Ensure bucket exists
  await ensureBucketExists();

  // Collect all audio files
  const allFiles: Array<{ path: string; baseDir: string }> = [];
  
  for (const dir of AUDIO_DIRS) {
    const files = getAllAudioFiles(dir);
    allFiles.push(...files.map(f => ({ path: f, baseDir: dir })));
  }

  stats.total = allFiles.length;
  console.log(`\n📁 Found ${stats.total} audio files to upload\n`);

  // Upload files
  for (const { path: filePath, baseDir } of allFiles) {
    const success = await uploadFile(filePath, baseDir);
    
    if (success) {
      const fullPath = path.join(baseDir, filePath);
      const fileBuffer = fs.readFileSync(fullPath);
      
      // Check if already existed
      const { data: existing } = await supabase.storage
        .from(BUCKET_NAME)
        .list(path.dirname(filePath.replace(/\\/g, '/')));
      
      const fileName = path.basename(filePath);
      if (existing?.some(f => f.name === fileName)) {
        stats.skipped++;
      } else {
        stats.uploaded++;
      }
    } else {
      stats.failed++;
    }
  }

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Upload Summary:');
  console.log('='.repeat(50));
  console.log(`Total files:     ${stats.total}`);
  console.log(`✅ Uploaded:     ${stats.uploaded}`);
  console.log(`⏭️  Skipped:      ${stats.skipped}`);
  console.log(`❌ Failed:       ${stats.failed}`);
  console.log('='.repeat(50));

  // Generate public URL example
  if (stats.uploaded > 0 || stats.skipped > 0) {
    const examplePath = allFiles[0].path.replace(/\\/g, '/');
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(examplePath);
    
    console.log('\n📍 Example public URL:');
    console.log(data.publicUrl);
    console.log('\n✅ All audio files are now accessible via CDN!');
  }
}

// Run upload
uploadAllAudio()
  .then(() => {
    console.log('\n✨ Upload complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n💥 Upload failed:', error);
    process.exit(1);
  });
