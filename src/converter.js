const fs = require('fs');
const path = require('path');
const { DOMParser } = require('@xmldom/xmldom');

/**
 * Generate Excalidraw-compatible random ID
 * Based on Excalidraw's randomId function implementation
 */
function generateId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

/**
 * Generate random seed for Excalidraw's randomness
 */
function generateSeed() {
  return Math.floor(Math.random() * 2 ** 31);
}

/**
 * Parse SVG path commands into Excalidraw path points
 * @param {string} pathData - SVG path's d attribute
 * @returns {Array} Excalidraw path points array
 */
function parsePathData(pathData) {
  const points = [];
  const commands = pathData.match(/[MLCZmlcz][^MLCZmlcz]*/g) || [];
  
  let currentX = 0, currentY = 0;
  
  commands.forEach(command => {
    const type = command[0];
    const coords = command.slice(1).trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
    
    switch (type.toLowerCase()) {
      case 'm': // moveTo
        if (coords.length >= 2) {
          currentX = type === 'M' ? coords[0] : currentX + coords[0];
          currentY = type === 'M' ? coords[1] : currentY + coords[1];
          points.push([currentX, currentY]);
        }
        break;
      case 'l': // lineTo
        for (let i = 0; i < coords.length; i += 2) {
          if (i + 1 < coords.length) {
            currentX = type === 'L' ? coords[i] : currentX + coords[i];
            currentY = type === 'L' ? coords[i + 1] : currentY + coords[i + 1];
            points.push([currentX, currentY]);
          }
        }
        break;
      case 'c': // cubicCurveTo (simplified handling, only take end point)
        for (let i = 0; i < coords.length; i += 6) {
          if (i + 5 < coords.length) {
            currentX = type === 'C' ? coords[i + 4] : currentX + coords[i + 4];
            currentY = type === 'C' ? coords[i + 5] : currentY + coords[i + 5];
            points.push([currentX, currentY]);
          }
        }
        break;
      case 'q': // quadraticCurveTo (simplified handling, only take end point)
        for (let i = 0; i < coords.length; i += 4) {
          if (i + 3 < coords.length) {
            currentX = type === 'Q' ? coords[i + 2] : currentX + coords[i + 2];
            currentY = type === 'Q' ? coords[i + 3] : currentY + coords[i + 3];
            points.push([currentX, currentY]);
          }
        }
        break;
      case 'a': // arc (simplified handling, only take end point)
        for (let i = 0; i < coords.length; i += 7) {
          if (i + 6 < coords.length) {
            currentX = type === 'A' ? coords[i + 5] : currentX + coords[i + 5];
            currentY = type === 'A' ? coords[i + 6] : currentY + coords[i + 6];
            points.push([currentX, currentY]);
          }
        }
        break;
      case 'z': // closePath
        // Close path, can add connection to first point if needed
        break;
    }
  });
  
  return points;
}

/**
 * Create base element structure that complies with Excalidraw standards
 * @param {string} type - Element type
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate  
 * @param {number} width - Width
 * @param {number} height - Height
 * @param {number} index - Element index
 * @returns {Object} Base element object
 */
function createBaseElement(type, x, y, width, height, index) {
  return {
    id: generateId(),
    type: type,
    x: x,
    y: y,
    width: width,
    height: height,
    angle: 0,
    strokeColor: "#1e1e1e",
    backgroundColor: "transparent",
    fillStyle: "solid",
    strokeWidth: 1,
    strokeStyle: "solid",
    roughness: 1,
    opacity: 100,
    groupIds: [],
    frameId: null,
    index: `a${index}`,
    roundness: type === "rectangle" ? { type: 1 } : null,
    seed: generateSeed(),
    versionNonce: generateSeed(),
    isDeleted: false,
    boundElements: null,
    updated: 1,
    link: null,
    locked: false
  };
}

/**
 * Convert SVG content to Excalidraw format
 * @param {string} svgContent - SVG file content
 * @param {Object} options - Conversion options
 * @returns {Object} Excalidraw format object
 */
function convertSvgToExcalidraw(svgContent, options = {}) {
  if (options.verbose) {
    console.log('Processing SVG content...');
  }
  
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svg = doc.documentElement;
    
    // Get SVG dimensions
    const svgWidth = parseFloat(svg.getAttribute('width')) || 200;
    const svgHeight = parseFloat(svg.getAttribute('height')) || 200;
    
    const elements = [];
    let elementIndex = 0;
    
    // Process rectangle elements
    const rects = svg.getElementsByTagName('rect');
    for (let i = 0; i < rects.length; i++) {
      const rect = rects[i];
      const x = parseFloat(rect.getAttribute('x')) || 0;
      const y = parseFloat(rect.getAttribute('y')) || 0;
      const width = parseFloat(rect.getAttribute('width')) || 0;
      const height = parseFloat(rect.getAttribute('height')) || 0;
      const fill = rect.getAttribute('fill') || 'transparent';
      const stroke = rect.getAttribute('stroke') || '#1e1e1e';
      const strokeWidth = parseFloat(rect.getAttribute('stroke-width')) || 1;
      const opacity = parseFloat(rect.getAttribute('opacity')) || 1;
      
      const element = createBaseElement('rectangle', x, y, width, height, elementIndex++);
      element.strokeColor = stroke === 'none' ? 'transparent' : stroke;
      element.backgroundColor = fill === 'none' ? 'transparent' : fill;
      element.strokeWidth = strokeWidth;
      element.opacity = Math.round(opacity * 100);
      
      elements.push(element);
    }
    
    // Process circle elements
    const circles = svg.getElementsByTagName('circle');
    for (let i = 0; i < circles.length; i++) {
      const circle = circles[i];
      const cx = parseFloat(circle.getAttribute('cx')) || 0;
      const cy = parseFloat(circle.getAttribute('cy')) || 0;
      const r = parseFloat(circle.getAttribute('r')) || 0;
      const fill = circle.getAttribute('fill') || 'transparent';
      const stroke = circle.getAttribute('stroke') || '#1e1e1e';
      const strokeWidth = parseFloat(circle.getAttribute('stroke-width')) || 1;
      const opacity = parseFloat(circle.getAttribute('opacity')) || 1;
      
      const element = createBaseElement('ellipse', cx - r, cy - r, r * 2, r * 2, elementIndex++);
      element.strokeColor = stroke === 'none' ? 'transparent' : stroke;
      element.backgroundColor = fill === 'none' ? 'transparent' : fill;
      element.strokeWidth = strokeWidth;
      element.opacity = Math.round(opacity * 100);
      
      elements.push(element);
    }
    
    // Process ellipse elements
    const ellipses = svg.getElementsByTagName('ellipse');
    for (let i = 0; i < ellipses.length; i++) {
      const ellipse = ellipses[i];
      const cx = parseFloat(ellipse.getAttribute('cx')) || 0;
      const cy = parseFloat(ellipse.getAttribute('cy')) || 0;
      const rx = parseFloat(ellipse.getAttribute('rx')) || 0;
      const ry = parseFloat(ellipse.getAttribute('ry')) || 0;
      const fill = ellipse.getAttribute('fill') || 'transparent';
      const stroke = ellipse.getAttribute('stroke') || '#1e1e1e';
      const strokeWidth = parseFloat(ellipse.getAttribute('stroke-width')) || 1;
      const opacity = parseFloat(ellipse.getAttribute('opacity')) || 1;
      
      const element = createBaseElement('ellipse', cx - rx, cy - ry, rx * 2, ry * 2, elementIndex++);
      element.strokeColor = stroke === 'none' ? 'transparent' : stroke;
      element.backgroundColor = fill === 'none' ? 'transparent' : fill;
      element.strokeWidth = strokeWidth;
      element.opacity = Math.round(opacity * 100);
      
      elements.push(element);
    }
    
    // Process path elements
    const paths = svg.getElementsByTagName('path');
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const d = path.getAttribute('d') || '';
      const fill = path.getAttribute('fill') || 'transparent';
      const stroke = path.getAttribute('stroke') || '#1e1e1e';
      const strokeWidth = parseFloat(path.getAttribute('stroke-width')) || 1;
      const opacity = parseFloat(path.getAttribute('opacity')) || 1;
      
      if (d) {
        const points = parsePathData(d);
        if (points.length > 0) {
          // Calculate bounding box
          const xs = points.map(p => p[0]);
          const ys = points.map(p => p[1]);
          const minX = Math.min(...xs);
          const minY = Math.min(...ys);
          const maxX = Math.max(...xs);
          const maxY = Math.max(...ys);
          
          // Convert absolute coordinates to relative coordinates to bounding box
          const relativePoints = points.map(p => [p[0] - minX, p[1] - minY]);
          
          const element = createBaseElement('freedraw', minX, minY, maxX - minX, maxY - minY, elementIndex++);
          element.strokeColor = stroke === 'none' ? '#1e1e1e' : stroke;
          element.backgroundColor = fill === 'none' ? 'transparent' : fill;
          element.strokeWidth = strokeWidth;
          element.opacity = Math.round(opacity * 100);
          element.points = relativePoints;
          element.pressures = [];
          element.simulatePressure = true;
          element.lastCommittedPoint = null;
          
          elements.push(element);
        }
      }
    }
    
    // Process text elements
    const texts = svg.getElementsByTagName('text');
    for (let i = 0; i < texts.length; i++) {
      const text = texts[i];
      const x = parseFloat(text.getAttribute('x')) || 0;
      const y = parseFloat(text.getAttribute('y')) || 0;
      const content = text.textContent || '';
      const fontSize = parseFloat(text.getAttribute('font-size')) || 20;
      const fill = text.getAttribute('fill') || '#1e1e1e';
      const fontFamily = text.getAttribute('font-family') || 'Virgil';
      const opacity = parseFloat(text.getAttribute('opacity')) || 1;
      
      // Estimate text dimensions - this is a simplified calculation
      const charWidth = fontSize * 0.6; // Estimate character width
      const estimatedWidth = content.length * charWidth;
      const lineHeight = fontSize * 1.2;
      
      const element = createBaseElement('text', x, y - fontSize, estimatedWidth, lineHeight, elementIndex++);
      element.strokeColor = fill;
      element.backgroundColor = 'transparent';
      element.fillStyle = 'solid';
      element.strokeWidth = 1;
      element.opacity = Math.round(opacity * 100);
      element.text = content;
      element.fontSize = fontSize;
      element.fontFamily = fontFamily === 'Virgil' ? 1 : fontFamily === 'Cascadia' ? 2 : 3;
      element.textAlign = 'left';
      element.verticalAlign = 'top';
      element.containerId = null;
      element.originalText = content;
      element.autoResize = true;
      element.lineHeight = 1.25;
      
      elements.push(element);
    }
    
    if (options.verbose) {
      console.log(`✅ SVG parsed successfully. Found ${elements.length} elements.`);
    }
    
    // Build complete Excalidraw data structure
    const excalidrawData = {
      type: "excalidraw",
      version: 2,
      source: "https://github.com/your-username/svg-to-excelidraw-bin",
      elements: elements,
      appState: {
        gridSize: null,
        viewBackgroundColor: "#ffffff",
        currentItemStrokeColor: "#1e1e1e",
        currentItemBackgroundColor: "transparent",
        currentItemFillStyle: "solid",
        currentItemStrokeWidth: 1,
        currentItemStrokeStyle: "solid",
        currentItemRoughness: 1,
        currentItemOpacity: 100,
        currentItemFontFamily: 1,
        currentItemFontSize: 20,
        currentItemTextAlign: "left",
        currentItemStartArrowhead: null,
        currentItemEndArrowhead: null,
        scrollX: 0,
        scrollY: 0,
        zoom: { value: 1 },
        currentItemRoundness: "round",
        gridColor: { Bold: "#C9C9C9", Regular: "#EDEDED" },
        currentStrokeOptions: null,
        previousGridSize: null,
        frameRendering: { enabled: true, clip: true, name: true, outline: true }
      },
      files: {}
    };
    
    return excalidrawData;
    
  } catch (error) {
    console.error('❌ Error during SVG conversion:', error.message);
    throw error;
  }
}

/**
 * Read SVG file and convert
 * @param {string} inputPath - Input file path
 * @param {string} outputPath - Output file path
 * @param {Object} options - Options
 */
async function processFile(inputPath, outputPath, options = {}) {
  try {
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Input file not found: ${inputPath}`);
    }

    // Read SVG file
    const svgContent = fs.readFileSync(inputPath, 'utf8');
    
    if (options.verbose) {
      console.log(`Reading SVG file: ${inputPath}`);
    }

    // Convert to Excalidraw format
    const excalidrawData = convertSvgToExcalidraw(svgContent, options);

    // Determine output path
    const finalOutputPath = outputPath || inputPath.replace(/\.svg$/i, '.excalidraw.json');
    
    // Write output file
    fs.writeFileSync(finalOutputPath, JSON.stringify(excalidrawData, null, 2));
    
    console.log(`✅ Successfully converted to: ${finalOutputPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

module.exports = {
  convertSvgToExcalidraw,
  processFile
};
