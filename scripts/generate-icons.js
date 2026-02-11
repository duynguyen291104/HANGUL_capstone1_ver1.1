const fs = require('fs');
const path = require('path');

// Simple PNG generator (1x1 blue pixel, will be placeholder)
const createPlaceholderPNG = (size) => {
  // PNG header + simple blue square
  const header = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A
  ]);
  
  // Simple 1x1 blue image data
  const width = size;
  const height = size;
  
  // For simplicity, create SVG instead and save as .png extension
  const svg = `
<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#3b82f6"/>
  <text x="50%" y="50%" text-anchor="middle" dy=".35em" fill="white" font-size="${size * 0.5}" font-family="Arial, sans-serif" font-weight="bold">한</text>
</svg>`;
  
  return svg;
};

// Create icons
const publicDir = path.join(__dirname, '..', 'public');

[192, 512].forEach(size => {
  const svg = createPlaceholderPNG(size);
  fs.writeFileSync(
    path.join(publicDir, `icon-${size}.svg`),
    svg
  );
  console.log(`✅ Created icon-${size}.svg`);
});

console.log('\n📝 Note: SVG icons created. For PNG, please:');
console.log('1. Open http://localhost:3000/create-icons.html in browser');
console.log('2. Or use online tool: https://realfavicongenerator.net/');
