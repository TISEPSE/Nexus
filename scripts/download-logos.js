#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
import http from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, '..');
const LOGOS_DIR = path.join(PROJECT_ROOT, 'public', 'logos');
const AI_DATA_PATH = path.join(PROJECT_ROOT, 'src', 'data', 'aiData.ts');

// Create logos directory
if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
  console.log('✅ Created logos directory');
}

// Helper: Download file from URL
async function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadFile(response.headers.location, destPath)
          .then(resolve)
          .catch(reject);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`HTTP ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(destPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });

      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

// Helper: Get file extension from URL
function getExtension(url) {
  const match = url.match(/\.(png|jpg|jpeg|svg|ico|webp)(\?|$)/i);
  return match ? match[1].toLowerCase() : 'png';
}

// Helper: Sanitize filename
function sanitizeFilename(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Parse aiData.ts to extract logo URLs
function parseAiData() {
  const content = fs.readFileSync(AI_DATA_PATH, 'utf-8');
  const tools = [];

  // Extract each tool object
  const toolMatches = content.matchAll(/{\s*id:\s*'([^']+)'[\s\S]*?logo:\s*(\[[\s\S]*?\]|'[^']*'|new URL[\s\S]*?)[\s\S]*?}/g);

  for (const match of toolMatches) {
    const id = match[1];
    const logoValue = match[2];

    // Skip if already local
    if (logoValue.includes('import.meta.url') || logoValue.includes('data:image')) {
      console.log(`⏭️  Skipping ${id} - already local`);
      continue;
    }

    // Extract URLs
    let urls = [];
    if (logoValue.startsWith('[')) {
      // Array of URLs
      const urlMatches = logoValue.matchAll(/'([^']+)'/g);
      urls = Array.from(urlMatches).map(m => m[1]);
    } else {
      // Single URL
      const urlMatch = logoValue.match(/'([^']+)'/);
      if (urlMatch) {
        urls = [urlMatch[1]];
      }
    }

    if (urls.length > 0) {
      tools.push({ id, urls });
    }
  }

  return tools;
}

// Download logos for all tools
async function downloadLogos(tools) {
  const results = [];
  let downloaded = 0;
  let failed = 0;
  let skipped = 0;

  for (const tool of tools) {
    let success = false;
    let localPath = null;

    // Try each URL (fallback support)
    for (const url of tool.urls) {
      if (url.startsWith('data:') || url.startsWith('/')) {
        skipped++;
        continue;
      }

      const ext = getExtension(url);
      const filename = `${sanitizeFilename(tool.id)}.${ext}`;
      const destPath = path.join(LOGOS_DIR, filename);

      // Skip if already exists
      if (fs.existsSync(destPath)) {
        localPath = `/logos/${filename}`;
        success = true;
        skipped++;
        break;
      }

      try {
        await downloadFile(url, destPath);
        downloaded++;
        process.stdout.write(`\r✅ Downloaded: ${downloaded} | ❌ Failed: ${failed} | ⏭️ Skipped: ${skipped}`);

        localPath = `/logos/${filename}`;
        success = true;
        break; // Stop at first success
      } catch (error) {
        // Silent fail, just count it
      }
    }

    if (success) {
      results.push({ id: tool.id, localPath });
    } else {
      failed++;
      process.stdout.write(`\r✅ Downloaded: ${downloaded} | ❌ Failed: ${failed} | ⏭️ Skipped: ${skipped}`);
    }

    // Reduce delay to 50ms for faster downloads
    await new Promise(resolve => setTimeout(resolve, 50));
  }

  console.log('\n'); // New line after progress
  return results;
}

// Update aiData.ts with local paths
function updateAiData(results) {
  let content = fs.readFileSync(AI_DATA_PATH, 'utf-8');

  for (const { id, localPath } of results) {
    // Replace logo array or string with local path
    const regex = new RegExp(
      `(id:\\s*'${id}'[\\s\\S]*?logo:\\s*)\\[?[\\s\\S]*?\\]?('.*?'|,)`,
      'g'
    );

    content = content.replace(regex, (match, before, after) => {
      if (after === ',') {
        return `${before}'${localPath}',`;
      }
      return `${before}'${localPath}'${after}`;
    });
  }

  fs.writeFileSync(AI_DATA_PATH, content);
  console.log('\n✅ Updated aiData.ts');
}

// Main execution
async function main() {
  console.log('🚀 Starting logo download script...\n');

  const tools = parseAiData();
  console.log(`📋 Found ${tools.length} tools with external logos\n`);

  const results = await downloadLogos(tools);
  console.log(`\n\n📊 Downloaded ${results.length} / ${tools.length} logos successfully`);

  if (results.length > 0) {
    updateAiData(results);
  }

  console.log('\n✨ Done!');
}

main().catch(console.error);
