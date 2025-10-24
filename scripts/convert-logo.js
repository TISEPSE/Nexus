import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertLogo() {
  const svgPath = path.join(__dirname, '..', 'public', 'nexus-logo.svg');
  const pngPath = path.join(__dirname, '..', 'public', 'nexus-logo.png');
  const iconPath = path.join(__dirname, '..', 'src-tauri', 'icons', 'icon.png');

  try {
    // Read SVG file
    const svgBuffer = fs.readFileSync(svgPath);

    // Convert to PNG (1024x1024 for high quality)
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(pngPath);

    console.log('✓ Created public/nexus-logo.png (1024x1024)');

    // Also create the icon.png for Tauri (same size)
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png()
      .toFile(iconPath);

    console.log('✓ Created src-tauri/icons/icon.png (1024x1024)');

    // Also update dist if it exists
    const distPngPath = path.join(__dirname, '..', 'dist', 'nexus-logo.png');
    const distSvgPath = path.join(__dirname, '..', 'dist', 'nexus-logo.svg');

    if (fs.existsSync(path.dirname(distPngPath))) {
      await sharp(svgBuffer)
        .resize(1024, 1024)
        .png()
        .toFile(distPngPath);
      fs.copyFileSync(svgPath, distSvgPath);
      console.log('✓ Updated dist/nexus-logo files');
    }

  } catch (error) {
    console.error('Error converting logo:', error);
    process.exit(1);
  }
}

convertLogo();
