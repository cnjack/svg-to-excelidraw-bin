#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to validate Excalidraw file format
 */

function validateExcalidrawFile(filePath) {
  try {
    console.log(`📋 Validating file: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      console.error('❌ File not found');
      return false;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Check basic structure
    const requiredFields = ['type', 'version', 'elements', 'appState'];
    const missingFields = requiredFields.filter(field => !(field in data));
    
    if (missingFields.length > 0) {
      console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    if (data.type !== 'excalidraw') {
      console.error(`❌ Wrong type: expected 'excalidraw', got '${data.type}'`);
      return false;
    }
    
    console.log(`✅ Format correct: Excalidraw v${data.version}`);
    console.log(`📊 Element count: ${data.elements.length}`);
    
    // Validate each element
    data.elements.forEach((element, index) => {
      const requiredElementFields = ['id', 'type', 'x', 'y', 'width', 'height'];
      const missingElementFields = requiredElementFields.filter(field => !(field in element));
      
      if (missingElementFields.length > 0) {
        console.warn(`⚠️ Element ${index} missing fields: ${missingElementFields.join(', ')}`);
      } else {
        console.log(`✅ Element ${index}: ${element.type} (${element.x}, ${element.y})`);
      }
    });
    
    console.log('🎉 Validation complete!');
    return true;
    
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    return false;
  }
}

// Validate example files in current directory
const files = [
  'example.excalidraw.json',
  'complex-example.excalidraw.json',
  'mcp_test.excalidraw.json'
];

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  console.log('\n' + '='.repeat(50));
  validateExcalidrawFile(filePath);
});
