#!/usr/bin/env node

const { program } = require('commander');
const { processFile } = require('../src/converter');
const path = require('path');

// Set up basic CLI program information
program
  .name('svg-to-excelidraw-bin')
  .description('Convert SVG files to Excalidraw format')
  .version('1.0.0');

// Add main command
program
  .argument('<input>', 'Input SVG file path')
  .option('-o, --output <path>', 'Output file path')
  .option('-v, --verbose', 'Enable verbose output')
  .action(async (input, options) => {
    console.log('🎨 SVG to Excalidraw Converter');
    console.log('================================');
    
    // Handle relative paths
    const inputPath = path.resolve(input);
    const outputPath = options.output ? path.resolve(options.output) : null;
    
    // Call conversion function
    await processFile(inputPath, outputPath, options);
  });

// Parse command line arguments
program.parse();
