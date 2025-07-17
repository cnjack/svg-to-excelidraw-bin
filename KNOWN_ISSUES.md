# Known Issues

This document tracks known limitations and issues with the SVG to Excalidraw converter.

## Complex Path Conversion Issues

### Issue: MCP Icon Path Simplification Loss

**Problem:**
When converting complex SVG paths like `mcp_test.svg`, the converter simplifies the path too aggressively, resulting in loss of visual detail and shape accuracy.

**Example:**
- **Input:** Complex path with 350 characters containing multiple `M`, `L`, `l`, and `z` commands
- **Output:** Only 13 control points in Excalidraw freedraw element
- **Result:** Significant loss of curve details and path complexity

**Technical Details:**
```
Original SVG path: M962.56 483.008l-419.072 419.008 50.304 50.304-45.248 45.248-95.552-95.488...
Converted points: 13 points (37.1 points per 1000 characters)
Visual accuracy: Reduced - missing intermediate curve points and fine details
```

**Root Cause:**
The current path parser only extracts major control points and doesn't interpolate curve segments or handle complex path commands with sufficient granularity.

**Impact:**
- ❌ Loss of visual fidelity for complex icons
- ❌ Missing curve details in rounded shapes
- ❌ Simplified geometry may not represent original design intent

**Workaround:**
For complex paths requiring high fidelity:
1. Manually trace the shape in Excalidraw
2. Use simpler SVG shapes when possible
3. Break complex paths into multiple simpler elements

**Status:** Known limitation - requires enhanced path parsing algorithm

---

## Path Command Support Limitations

### Issue: Limited SVG Path Command Support

**Problem:**
The converter has basic support for SVG path commands but lacks comprehensive handling of advanced features.

**Currently Supported:**
- ✅ `M` (moveTo) - absolute
- ✅ `m` (moveTo) - relative  
- ✅ `L` (lineTo) - absolute
- ✅ `l` (lineTo) - relative
- ✅ `Z/z` (closePath)
- ⚠️  `C/c` (cubicCurveTo) - simplified (end points only)
- ⚠️  `Q/q` (quadraticCurveTo) - simplified (end points only)
- ⚠️  `A/a` (arcTo) - simplified (end points only)

**Missing/Limited:**
- ❌ `S/s` (smooth cubicCurveTo)
- ❌ `T/t` (smooth quadraticCurveTo)
- ❌ `H/h` (horizontal lineTo)
- ❌ `V/v` (vertical lineTo)
- ❌ Proper curve interpolation
- ❌ Arc parameter handling

**Impact:**
- Reduced accuracy for curved shapes
- Missing smooth transitions
- Potential coordinate errors in complex paths

**Status:** Enhancement needed

---

## Coordinate System Issues

### Issue: ViewBox to Canvas Coordinate Mapping

**Problem:**
While basic coordinate transformation works, complex viewBox scenarios may cause positioning issues.

**Potential Issues:**
- SVG with negative viewBox values
- Non-proportional viewBox scaling
- Nested coordinate systems
- Transform attributes on path elements

**Status:** Requires testing with diverse SVG sources

---

## Performance Considerations

### Issue: Large Path Processing

**Problem:**
Very large SVG files with thousands of path points may cause performance issues.

**Recommendations:**
- Consider point reduction algorithms for very dense paths
- Implement progressive loading for large files
- Add file size warnings

**Status:** Future enhancement

---

## Feature Gaps

### Missing SVG Features

**Text Positioning:**
- ✅ Basic text support implemented
- ⚠️  Text-anchor support added but may need refinement
- ❌ Text along path not supported
- ❌ Complex text layouts

**Styling:**
- ✅ Basic stroke and fill colors
- ✅ Stroke width and opacity
- ❌ Gradients
- ❌ Patterns
- ❌ Complex stroke styles (dashed, dotted)

**Shapes:**
- ❌ Native SVG shapes (rect, circle, ellipse) - currently converted to paths
- ❌ Group elements
- ❌ Clip paths and masks

---

## Recommendations for Users

### Best Practices:
1. **Simple Paths:** Work best with the current converter
2. **Icon Fonts:** Consider using simple geometric shapes
3. **Testing:** Always verify conversion results with the visual-check tool
4. **Fallback:** Keep original SVG files for reference

### Quality Check:
Use the provided analysis tools:
```bash
node visual-check.js input.svg output.excalidraw.json
node analyze-path.js input.svg output.excalidraw.json
```

---

*Last updated: July 17, 2025*
*Tool version: 1.0.0*
