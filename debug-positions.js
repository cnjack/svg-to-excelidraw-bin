#!/usr/bin/env node

const fs = require('fs');
const { DOMParser } = require('@xmldom/xmldom');

/**
 * Debug script to compare SVG and Excalidraw positions
 */

function debugPositions(svgFile, excalidrawFile) {
  console.log('🔍 Position Debug Analysis');
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
  
  let elementIndex = 0;
  
  // Check rectangles
  const rects = svg.getElementsByTagName('rect');
  console.log(`📐 RECTANGLES (${rects.length}):`);
  for (let i = 0; i < rects.length; i++) {
    const rect = rects[i];
    const svgX = parseFloat(rect.getAttribute('x')) || 0;
    const svgY = parseFloat(rect.getAttribute('y')) || 0;
    const svgW = parseFloat(rect.getAttribute('width')) || 0;
    const svgH = parseFloat(rect.getAttribute('height')) || 0;
    
    const excElement = excalidrawData.elements[elementIndex];
    console.log(`  Rect ${i+1}:`);
    console.log(`    SVG:        x=${svgX}, y=${svgY}, w=${svgW}, h=${svgH}`);
    console.log(`    Excalidraw: x=${excElement.x}, y=${excElement.y}, w=${excElement.width}, h=${excElement.height}`);
    console.log(`    Match: ${svgX === excElement.x && svgY === excElement.y && svgW === excElement.width && svgH === excElement.height ? '✅' : '❌'}`);
    elementIndex++;
  }
  console.log('');
  
  // Check circles
  const circles = svg.getElementsByTagName('circle');
  console.log(`⭕ CIRCLES (${circles.length}):`);
  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i];
    const svgCx = parseFloat(circle.getAttribute('cx')) || 0;
    const svgCy = parseFloat(circle.getAttribute('cy')) || 0;
    const svgR = parseFloat(circle.getAttribute('r')) || 0;
    
    const excElement = excalidrawData.elements[elementIndex];
    const expectedX = svgCx - svgR;
    const expectedY = svgCy - svgR;
    const expectedW = svgR * 2;
    const expectedH = svgR * 2;
    
    console.log(`  Circle ${i+1}:`);
    console.log(`    SVG:        cx=${svgCx}, cy=${svgCy}, r=${svgR}`);
    console.log(`    Expected:   x=${expectedX}, y=${expectedY}, w=${expectedW}, h=${expectedH}`);
    console.log(`    Excalidraw: x=${excElement.x}, y=${excElement.y}, w=${excElement.width}, h=${excElement.height}`);
    console.log(`    Match: ${expectedX === excElement.x && expectedY === excElement.y && expectedW === excElement.width && expectedH === excElement.height ? '✅' : '❌'}`);
    elementIndex++;
  }
  console.log('');
  
  // Check ellipses
  const ellipses = svg.getElementsByTagName('ellipse');
  console.log(`🥚 ELLIPSES (${ellipses.length}):`);
  for (let i = 0; i < ellipses.length; i++) {
    const ellipse = ellipses[i];
    const svgCx = parseFloat(ellipse.getAttribute('cx')) || 0;
    const svgCy = parseFloat(ellipse.getAttribute('cy')) || 0;
    const svgRx = parseFloat(ellipse.getAttribute('rx')) || 0;
    const svgRy = parseFloat(ellipse.getAttribute('ry')) || 0;
    
    const excElement = excalidrawData.elements[elementIndex];
    const expectedX = svgCx - svgRx;
    const expectedY = svgCy - svgRy;
    const expectedW = svgRx * 2;
    const expectedH = svgRy * 2;
    
    console.log(`  Ellipse ${i+1}:`);
    console.log(`    SVG:        cx=${svgCx}, cy=${svgCy}, rx=${svgRx}, ry=${svgRy}`);
    console.log(`    Expected:   x=${expectedX}, y=${expectedY}, w=${expectedW}, h=${expectedH}`);
    console.log(`    Excalidraw: x=${excElement.x}, y=${excElement.y}, w=${excElement.width}, h=${excElement.height}`);
    console.log(`    Match: ${expectedX === excElement.x && expectedY === excElement.y && expectedW === excElement.width && expectedH === excElement.height ? '✅' : '❌'}`);
    elementIndex++;
  }
  console.log('');
  
  // Check text elements
  const texts = svg.getElementsByTagName('text');
  console.log(`📝 TEXT ELEMENTS (${texts.length}):`);
  for (let i = 0; i < texts.length; i++) {
    const text = texts[i];
    const svgX = parseFloat(text.getAttribute('x')) || 0;
    const svgY = parseFloat(text.getAttribute('y')) || 0;
    const textAnchor = text.getAttribute('text-anchor') || 'start';
    const fontSize = parseFloat(text.getAttribute('font-size')) || 20;
    const content = text.textContent || '';
    
    const excElement = excalidrawData.elements[elementIndex];
    
    console.log(`  Text ${i+1}: "${content}"`);
    console.log(`    SVG:        x=${svgX}, y=${svgY}, anchor=${textAnchor}, fontSize=${fontSize}`);
    console.log(`    Excalidraw: x=${excElement.x}, y=${excElement.y}, textAlign=${excElement.textAlign}, fontSize=${excElement.fontSize}`);
    console.log(`    Text Match: ${content === excElement.text ? '✅' : '❌'}`);
    elementIndex++;
  }
  
  console.log('');
  console.log('🎉 Analysis complete!');
}

// Usage
if (process.argv.length < 4) {
  console.log('Usage: node debug-positions.js <svg-file> <excalidraw-file>');
  process.exit(1);
}

const svgFile = process.argv[2];
const excalidrawFile = process.argv[3];

debugPositions(svgFile, excalidrawFile);
