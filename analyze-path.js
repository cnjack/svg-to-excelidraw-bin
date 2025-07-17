#!/usr/bin/env node

const fs = require('fs');
const { DOMParser } = require('@xmldom/xmldom');

/**
 * Analyze path conversion quality
 */

function analyzePath(svgFile, excalidrawFile) {
  console.log('🔍 Path Conversion Analysis');
  console.log('=' .repeat(50));
  
  // Read and parse SVG
  const svgContent = fs.readFileSync(svgFile, 'utf8');
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
  const svg = svgDoc.documentElement;
  
  // Read Excalidraw JSON
  const excalidrawContent = fs.readFileSync(excalidrawFile, 'utf8');
  const excalidrawData = JSON.parse(excalidrawContent);
  
  console.log(`📄 SVG File: ${svgFile}`);
  console.log(`📄 Excalidraw File: ${excalidrawFile}`);
  console.log('');
  
  // Get SVG dimensions
  const svgWidth = parseFloat(svg.getAttribute('width')) || 'viewBox';
  const svgHeight = parseFloat(svg.getAttribute('height')) || 'viewBox';
  const viewBox = svg.getAttribute('viewBox');
  
  console.log(`📐 SVG Dimensions:`);
  console.log(`  Width: ${svgWidth}`);
  console.log(`  Height: ${svgHeight}`);
  console.log(`  ViewBox: ${viewBox}`);
  console.log('');
  
  // Analyze paths
  const paths = svg.getElementsByTagName('path');
  console.log(`🛤️  PATHS (${paths.length}):`);
  
  for (let i = 0; i < paths.length; i++) {
    const path = paths[i];
    const d = path.getAttribute('d') || '';
    const fill = path.getAttribute('fill') || 'black';
    const stroke = path.getAttribute('stroke') || 'none';
    const strokeWidth = path.getAttribute('stroke-width') || '1';
    
    console.log(`  Path ${i + 1}:`);
    console.log(`    Original d: ${d.substring(0, 100)}${d.length > 100 ? '...' : ''}`);
    console.log(`    Length: ${d.length} characters`);
    console.log(`    Fill: ${fill}`);
    console.log(`    Stroke: ${stroke}`);
    console.log(`    Stroke Width: ${strokeWidth}`);
    
    // Count commands
    const commands = d.match(/[MLCZmlcz]/g) || [];
    const commandCounts = {};
    commands.forEach(cmd => {
      commandCounts[cmd.toUpperCase()] = (commandCounts[cmd.toUpperCase()] || 0) + 1;
    });
    
    console.log(`    Commands:`, commandCounts);
    console.log('');
  }
  
  // Analyze converted elements
  console.log(`🎨 CONVERTED ELEMENTS (${excalidrawData.elements.length}):`);
  
  excalidrawData.elements.forEach((element, index) => {
    if (element.type === 'freedraw') {
      console.log(`  Freedraw ${index + 1}:`);
      console.log(`    Position: x=${element.x}, y=${element.y}`);
      console.log(`    Size: w=${element.width}, h=${element.height}`);
      console.log(`    Points: ${element.points.length}`);
      console.log(`    Stroke: ${element.strokeColor}`);
      console.log(`    Background: ${element.backgroundColor}`);
      console.log(`    Stroke Width: ${element.strokeWidth}`);
      
      if (element.points.length > 0) {
        console.log(`    First point: [${element.points[0].join(', ')}]`);
        console.log(`    Last point: [${element.points[element.points.length - 1].join(', ')}]`);
      }
      console.log('');
    }
  });
  
  // Quality assessment
  console.log(`📊 CONVERSION QUALITY ASSESSMENT:`);
  
  const pathElements = excalidrawData.elements.filter(e => e.type === 'freedraw');
  const originalPaths = svg.getElementsByTagName('path').length;
  
  console.log(`  Original paths: ${originalPaths}`);
  console.log(`  Converted freedraw elements: ${pathElements.length}`);
  console.log(`  Conversion ratio: ${pathElements.length}/${originalPaths} = ${((pathElements.length / originalPaths) * 100).toFixed(1)}%`);
  
  if (pathElements.length > 0) {
    const totalPoints = pathElements.reduce((sum, el) => sum + el.points.length, 0);
    const avgPoints = totalPoints / pathElements.length;
    console.log(`  Average points per path: ${avgPoints.toFixed(1)}`);
    
    const maxPoints = Math.max(...pathElements.map(el => el.points.length));
    const minPoints = Math.min(...pathElements.map(el => el.points.length));
    console.log(`  Point range: ${minPoints} - ${maxPoints}`);
  }
  
  console.log('');
  console.log('🎉 Analysis complete!');
}

// Usage
if (process.argv.length < 4) {
  console.log('Usage: node analyze-path.js <svg-file> <excalidraw-file>');
  process.exit(1);
}

const svgFile = process.argv[2];
const excalidrawFile = process.argv[3];

analyzePath(svgFile, excalidrawFile);
