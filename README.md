# SVG to Excalidraw Converter

A command-line tool to convert SVG files to Excalidraw format. This tool generates files that comply with the official Excalidraw data format standards and can be directly opened and edited in Excalidraw.

## Features

- ✅ **Official Format Compatible**: Generates JSON files that fully comply with Excalidraw's official format
- 🎨 **Rich Element Support**: Supports rectangles, circles, ellipses, paths, and text elements
- 🎯 **Attribute Preservation**: Maintains SVG attributes like colors, opacity, stroke width, etc.
- 📐 **Smart Parsing**: Handles complex SVG path data and coordinate transformations
- 🚀 **Easy to Use**: Single command conversion
- 🔧 **Configurable**: Supports verbose output mode

## Installation

### From Source

```bash
# Clone repository
git clone <repository-url>
cd svg-to-excelidraw-bin

# Install dependencies
pnpm install

# Global installation (recommended)
sudo ln -sf $(pwd)/bin/svg-to-excelidraw.js /usr/local/bin/svg-to-excelidraw-bin

# Or use pnpm (may require PATH configuration)
pnpm link --global
```

### Development Environment

```bash
# Install dependencies
pnpm install

# Run examples
pnpm run example
pnpm run complex
```

### Local Development
```bash
git clone <repository>
cd svg-to-excelidraw-bin
pnpm install
# Create global link
sudo ln -sf $(pwd)/bin/svg-to-excelidraw.js /usr/local/bin/svg-to-excelidraw-bin
```

## Usage

### Basic Usage
```bash
svg-to-excelidraw-bin input.svg
```
Output: `input.excalidraw.json`

### Specify Output File
```bash
svg-to-excelidraw-bin input.svg -o output.excalidraw.json
```

### Verbose Output
```bash
svg-to-excelidraw-bin input.svg --verbose
```

### Show Help
```bash
svg-to-excelidraw-bin --help
```

## Examples

The project includes two example files:

### Simple Example (`example.svg`)
```xml
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="100" height="100" fill="blue" stroke="black" stroke-width="2"/>
  <circle cx="100" cy="100" r="30" fill="red" opacity="0.7"/>
  <text x="100" y="160" text-anchor="middle" font-family="Arial" font-size="16">Hello SVG</text>
</svg>
```

### Complex Example (`complex-example.svg`)
Contains a comprehensive example with rectangles, circles, paths, and text.

Conversion command:
```bash
svg-to-excelidraw-bin complex-example.svg -o complex-output.excalidraw.json --verbose
```

## Development

### Local Testing
```bash
# Run development version
pnpm dev example.svg

# Or run directly
node bin/svg-to-excelidraw.js example.svg --verbose
```

### Project Structure
```
svg-to-excelidraw-bin/
├── bin/
│   └── svg-to-excelidraw.js    # CLI entry point
├── src/
│   └── converter.js            # Conversion logic (custom SVG parser)
├── example.svg                 # Simple example
├── complex-example.svg         # Complex example
├── package.json
└── README.md
```

## Technical Implementation

### SVG Parsing
- Uses `@xmldom/xmldom` for SVG XML parsing
- Custom implementation for SVG element to Excalidraw element conversion
- Supports basic path data parsing

### Supported SVG Elements
| SVG Element | Excalidraw Type | Status |
|-------------|-----------------|--------|
| `<rect>` | rectangle | ✅ Full support |
| `<circle>` | ellipse | ✅ Full support |
| `<ellipse>` | ellipse | ✅ Basic support |
| `<path>` | freedraw | ✅ Basic support |
| `<text>` | text | ✅ Basic support |
| `<line>` | line | 🚧 Planned |
| `<polygon>` | freedraw | 🚧 Planned |
| `<polyline>` | freedraw | 🚧 Planned |

### Supported Attributes
- `x`, `y`, `width`, `height`
- `cx`, `cy`, `r`, `rx`, `ry`
- `fill`, `stroke`, `stroke-width`
- `opacity`
- `font-size`, `font-family`
- Basic `d` path data (M, L, C, Z commands)

## Using Excalidraw Files

The generated `.excalidraw.json` files can be:

1. **Directly imported into Excalidraw**: Visit [excalidraw.com](https://excalidraw.com), click File menu and select "Open"
2. **Used in VS Code**: Install the Excalidraw extension
3. **Programmatically processed**: As JSON data

## Tech Stack

This tool uses the following technologies:

- **Node.js**: Runtime environment
- **Commander.js**: Command-line interface
- **@xmldom/xmldom**: SVG XML parsing
- **Official Excalidraw Format**: Ensures full compatibility with Excalidraw

### Core Features

1. **Standards Compliance**: Uses official Excalidraw element structures and properties
2. **Random ID Generation**: Mimics Excalidraw's ID generation algorithm
3. **Seed Values**: Provides consistent random seeds for hand-drawn effects
4. **Coordinate Transformation**: Properly handles coordinate system differences between SVG and Excalidraw
5. **Path Parsing**: Supports complex SVG path commands (M, L, C, Q, A, Z)

### Data Structure

Generated `.excalidraw.json` files contain:

```json
{
  "type": "excalidraw",
  "version": 2,
  "source": "svg-to-excelidraw-bin",
  "elements": [...],
  "appState": {...},
  "files": {}
}
```

Each element contains the complete set of properties required by Excalidraw:
- Base properties: id, type, x, y, width, height
- Visual properties: strokeColor, backgroundColor, opacity
- System properties: seed, versionNonce, index
- Element-specific properties: specialized properties based on element type

## Notes

- Complex SVG paths are simplified to Excalidraw freedraw paths
- Text sizes are estimated and may need manual adjustment in Excalidraw
- Some advanced SVG features (gradients, filters) are not currently supported
- Coordinate system transformation ensures accurate element positioning

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Issues and Pull Requests are welcome to improve this tool!

---

**Language Versions:**
- [English](README.md) (current)
- [中文](README-cn.md)
