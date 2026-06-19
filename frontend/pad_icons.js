const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function padLogo() {
  const inputPath = path.join(__dirname, 'public', 'logo.jpeg');
  const sizes = [512, 192, 96, 48, 32];
  
  // Verify input exists
  if (!fs.existsSync(inputPath)) {
    console.error('Original logo.jpeg not found!');
    return;
  }

  // The Android adaptive icon "safe zone" is a circle with radius 33% of the image size.
  // This means the logo should ideally be within a centered square of about 66% of the final size.
  // Let's resize the logo to 65% of the target size, and pad the rest with black.

  for (const size of sizes) {
    const innerSize = Math.floor(size * 0.65);
    const outputPath = path.join(__dirname, 'public', `logo-${size}.jpg`);

    try {
      await sharp(inputPath)
        .resize(innerSize, innerSize, {
          fit: 'contain',
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        })
        .extend({
          top: Math.floor((size - innerSize) / 2),
          bottom: Math.ceil((size - innerSize) / 2),
          left: Math.floor((size - innerSize) / 2),
          right: Math.ceil((size - innerSize) / 2),
          background: { r: 0, g: 0, b: 0, alpha: 1 }
        })
        .jpeg({ quality: 95 })
        .toFile(outputPath);
      console.log(`Generated padded ${outputPath}`);
    } catch (err) {
      console.error(`Error generating ${size}:`, err);
    }
  }
}

padLogo();
