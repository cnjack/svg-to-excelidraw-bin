#!/usr/bin/env node

/**
 * Test path parsing directly to see how well it handles complex paths
 */

function parsePathData(pathData) {
  const points = [];
  const commands = pathData.match(/[MLCZmlcz][^MLCZmlcz]*/g) || [];
  
  let currentX = 0, currentY = 0;
  
  console.log(`🔍 Parsing path with ${commands.length} commands:`);
  
  commands.forEach((command, index) => {
    const type = command[0];
    const coords = command.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    
    console.log(`  Command ${index + 1}: ${type} with ${coords.length} coordinates`);
    
    switch (type.toLowerCase()) {
      case 'm': // moveTo
        if (coords.length >= 2) {
          currentX = type === 'M' ? coords[0] : currentX + coords[0];
          currentY = type === 'M' ? coords[1] : currentY + coords[1];
          points.push([currentX, currentY]);
          console.log(`    MoveTo: (${currentX}, ${currentY})`);
        }
        break;
      case 'l': // lineTo
        for (let i = 0; i < coords.length; i += 2) {
          if (i + 1 < coords.length) {
            currentX = type === 'L' ? coords[i] : currentX + coords[i];
            currentY = type === 'L' ? coords[i + 1] : currentY + coords[i + 1];
            points.push([currentX, currentY]);
            console.log(`    LineTo: (${currentX}, ${currentY})`);
          }
        }
        break;
      case 'c': // cubicCurveTo (simplified handling, only take end point)
        for (let i = 0; i < coords.length; i += 6) {
          if (i + 5 < coords.length) {
            currentX = type === 'C' ? coords[i + 4] : currentX + coords[i + 4];
            currentY = type === 'C' ? coords[i + 5] : currentY + coords[i + 5];
            points.push([currentX, currentY]);
            console.log(`    CurveTo: (${currentX}, ${currentY}) [simplified]`);
          }
        }
        break;
      case 'q': // quadraticCurveTo (simplified handling, only take end point)
        for (let i = 0; i < coords.length; i += 4) {
          if (i + 3 < coords.length) {
            currentX = type === 'Q' ? coords[i + 2] : currentX + coords[i + 2];
            currentY = type === 'Q' ? coords[i + 3] : currentY + coords[i + 3];
            points.push([currentX, currentY]);
            console.log(`    QuadCurveTo: (${currentX}, ${currentY}) [simplified]`);
          }
        }
        break;
      case 'a': // arc (simplified handling, only take end point)
        for (let i = 0; i < coords.length; i += 7) {
          if (i + 6 < coords.length) {
            currentX = type === 'A' ? coords[i + 5] : currentX + coords[i + 5];
            currentY = type === 'A' ? coords[i + 6] : currentY + coords[i + 6];
            points.push([currentX, currentY]);
            console.log(`    ArcTo: (${currentX}, ${currentY}) [simplified]`);
          }
        }
        break;
      case 'z': // closePath
        console.log(`    ClosePath`);
        break;
      default:
        console.log(`    Unknown command: ${type}`);
    }
  });
  
  console.log(`\n📊 Result: ${points.length} points extracted`);
  return points;
}

// Test with mcp_test.svg path
const testPath = "M962.56 483.008l-419.072 419.008 50.304 50.304-45.248 45.248-95.552-95.488 419.008-419.072L716.16 327.04 380.928 662.4l-45.248-45.312 335.232-335.232-155.904-155.84L96 545.024 50.752 499.84 515.008 35.52l447.552 447.488zM560.256 281.92L241.92 600.32l155.84 155.84L716.16 437.76l45.248 45.248-363.712 363.712-246.4-246.4 363.712-363.712 45.248 45.312z";

console.log('🧪 Testing Path Parser with mcp_test.svg path:');
console.log('='.repeat(60));

const points = parsePathData(testPath);

console.log('\n📋 First 5 points:');
points.slice(0, 5).forEach((point, i) => {
  console.log(`  ${i + 1}: [${point[0]}, ${point[1]}]`);
});

console.log('\n📋 Last 5 points:');
points.slice(-5).forEach((point, i) => {
  console.log(`  ${points.length - 4 + i}: [${point[0]}, ${point[1]}]`);
});

// Calculate bounding box
const xs = points.map(p => p[0]);
const ys = points.map(p => p[1]);
const minX = Math.min(...xs);
const minY = Math.min(...ys);
const maxX = Math.max(...xs);
const maxY = Math.max(...ys);

console.log('\n🎯 Bounding Box:');
console.log(`  Min: (${minX}, ${minY})`);
console.log(`  Max: (${maxX}, ${maxY})`);
console.log(`  Size: ${maxX - minX} x ${maxY - minY}`);

console.log('\n🎉 Analysis complete!');
