#!/usr/bin/env node

/**
 * Visual comparison tool to check SVG to Excalidraw conversion quality
 */

const fs = require('fs');

if (process.argv.length < 4) {
  console.log('📋 Usage: node visual-check.js <svg-file> <excalidraw-file>');
  process.exit(1);
}

const svgFile = process.argv[2];
const excalidrawFile = process.argv[3];

console.log('🔍 Visual Conversion Quality Check');
console.log('='.repeat(50));

// Read and parse SVG file
const svgContent = fs.readFileSync(svgFile, 'utf8');
const excalidrawContent = JSON.parse(fs.readFileSync(excalidrawFile, 'utf8'));

// Extract path from SVG - find the path with actual coordinates
const pathMatches = svgContent.match(/d="([^"]+)"/g);
if (!pathMatches) {
  console.log('❌ No path found in SVG file');
  process.exit(1);
}

// Find the path that contains actual path commands (starts with M, L, etc.)
let originalPath = null;
for (const match of pathMatches) {
  const pathData = match.match(/d="([^"]+)"/)[1];
  if (pathData.match(/[MLCZmlcz]/)) {
    originalPath = pathData;
    break;
  }
}

if (!originalPath) {
  console.log('❌ No valid path data found in SVG file');
  process.exit(1);
}

console.log(`📄 Original SVG path length: ${originalPath.length} characters`);
console.log(`📄 Path preview: ${originalPath.substring(0, 100)}${originalPath.length > 100 ? '...' : ''}`);

// Extract viewBox from SVG
const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
const viewBox = viewBoxMatch ? viewBoxMatch[1].split(' ').map(Number) : [0, 0, 100, 100];
console.log(`📐 SVG viewBox: [${viewBox.join(', ')}]`);

// Analyze Excalidraw output
const freedrawElements = excalidrawContent.elements.filter(el => el.type === 'freedraw');
console.log(`🎨 Excalidraw freedraw elements: ${freedrawElements.length}`);

if (freedrawElements.length === 0) {
  console.log('❌ No freedraw elements found in Excalidraw file');
  process.exit(1);
}

const element = freedrawElements[0];
console.log(`\n📊 Conversion Analysis:`);
console.log(`  Element position: (${element.x}, ${element.y})`);
console.log(`  Element size: ${element.width} × ${element.height}`);
console.log(`  Number of points: ${element.points.length}`);

// Check if coordinates make sense
const pointsStats = {
  minX: Math.min(...element.points.map(p => p[0])),
  maxX: Math.max(...element.points.map(p => p[0])),
  minY: Math.min(...element.points.map(p => p[1])),
  maxY: Math.max(...element.points.map(p => p[1]))
};

console.log(`\n📐 Points bounding box (relative to element):`);
console.log(`  X range: ${pointsStats.minX} to ${pointsStats.maxX}`);
console.log(`  Y range: ${pointsStats.minY} to ${pointsStats.maxY}`);
console.log(`  Calculated size: ${pointsStats.maxX - pointsStats.minX} × ${pointsStats.maxY - pointsStats.minY}`);

// Verify integrity
const sizeMatch = Math.abs((pointsStats.maxX - pointsStats.minX) - element.width) < 0.1 &&
                  Math.abs((pointsStats.maxY - pointsStats.minY) - element.height) < 0.1;

console.log(`\n✅ Integrity checks:`);
console.log(`  Size consistency: ${sizeMatch ? '✅ PASS' : '❌ FAIL'}`);
console.log(`  Points start at origin: ${pointsStats.minX === 0 && pointsStats.minY === 0 ? '✅ PASS' : '❌ FAIL'}`);

// Show first and last few points for manual inspection
console.log(`\n🔍 Sample points (relative coordinates):`);
console.log(`  First 3 points:`);
element.points.slice(0, 3).forEach((point, i) => {
  console.log(`    ${i + 1}: [${point[0].toFixed(2)}, ${point[1].toFixed(2)}]`);
});

console.log(`  Last 3 points:`);
element.points.slice(-3).forEach((point, i) => {
  const index = element.points.length - 3 + i + 1;
  console.log(`    ${index}: [${point[0].toFixed(2)}, ${point[1].toFixed(2)}]`);
});

// Convert back to absolute coordinates for comparison
console.log(`\n🌍 Sample points (absolute coordinates):`);
console.log(`  First 3 points:`);
element.points.slice(0, 3).forEach((point, i) => {
  const absX = point[0] + element.x;
  const absY = point[1] + element.y;
  console.log(`    ${i + 1}: [${absX.toFixed(2)}, ${absY.toFixed(2)}]`);
});

// Quality assessment
let quality = 'Good';
if (element.points.length < 5) quality = 'Poor - Too few points';
else if (element.points.length > 100) quality = 'Excellent - High detail';
else if (element.points.length > 50) quality = 'Very Good - Good detail';

console.log(`\n🏆 Quality Assessment: ${quality}`);
console.log(`   - Point density: ${(element.points.length / originalPath.length * 1000).toFixed(1)} points per 1000 chars`);
console.log(`   - Coverage: ${sizeMatch ? 'Complete' : 'Partial'}`);

console.log(`\n💡 Recommendations:`);
if (element.points.length < 10) {
  console.log(`   - Consider improving path parsing to capture more detail`);
}
if (!sizeMatch) {
  console.log(`   - Check coordinate transformation logic`);
}
if (element.points.length > 100) {
  console.log(`   - Consider path simplification for better performance`);
}

console.log(`\n🎉 Analysis complete!`);
