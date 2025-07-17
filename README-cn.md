# SVG to Excalidraw Converter

一个将 SVG 文件转换为 Excalidraw 格式的命令行工具。本工具符合 Excalidraw 官方数据格式标准，生成的文件可以直接在 Excalidraw 中打开和编辑。

## 特性

- ✅ **官方格式兼容**: 生成完全符合 Excalidraw 官方格式的 JSON 文件
- 🎨 **丰富的元素支持**: 支持矩形、圆形、椭圆、路径和文本元素
- 🎯 **属性保持**: 保持颜色、透明度、描边宽度等 SVG 属性
- � **智能解析**: 处理复杂的 SVG 路径数据和坐标变换
- 🚀 **简单易用**: 单个命令即可完成转换
- 🔧 **可配置**: 支持详细输出模式

## 安装

### 从源码安装

```bash
# 克隆仓库
git clone <repository-url>
cd svg-to-excelidraw-bin

# 安装依赖
pnpm install

# 全局安装 (推荐方法)
sudo ln -sf $(pwd)/bin/svg-to-excelidraw.js /usr/local/bin/svg-to-excelidraw-bin

# 或者使用 pnpm (可能需要配置 PATH)
pnpm link --global
```

### 开发环境

```bash
# 安装依赖
pnpm install

# 运行示例
pnpm run example
pnpm run complex
```

### 本地开发
```bash
git clone <repository>
cd svg-to-excelidraw-bin
pnpm install
# 创建全局链接
sudo ln -sf $(pwd)/bin/svg-to-excelidraw.js /usr/local/bin/svg-to-excelidraw-bin
```

## 使用方法

### 基本用法
```bash
svg-to-excelidraw-bin input.svg
```
输出: `input.excalidraw.json`

### 指定输出文件
```bash
svg-to-excelidraw-bin input.svg -o output.excalidraw.json
```

### 详细输出
```bash
svg-to-excelidraw-bin input.svg --verbose
```

### 查看帮助
```bash
svg-to-excelidraw-bin --help
```

## 示例

项目包含两个示例文件：

### 简单示例 (`example.svg`)
```xml
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <rect x="50" y="50" width="100" height="100" fill="blue" stroke="black" stroke-width="2"/>
  <circle cx="100" cy="100" r="30" fill="red" opacity="0.7"/>
  <text x="100" y="160" text-anchor="middle" font-family="Arial" font-size="16">Hello SVG</text>
</svg>
```

### 复杂示例 (`complex-example.svg`)
包含矩形、圆形、路径和文本的综合示例。

转换命令：
```bash
svg-to-excelidraw-bin complex-example.svg -o complex-output.excalidraw.json --verbose
```

## 开发

### 本地测试
```bash
# 运行开发版本
pnpm dev example.svg

# 或直接运行
node bin/svg-to-excelidraw.js example.svg --verbose
```

### 项目结构
```
svg-to-excelidraw-bin/
├── bin/
│   └── svg-to-excelidraw.js    # 命令行入口
├── src/
│   └── converter.js            # 转换逻辑 (自实现的 SVG 解析器)
├── example.svg                 # 简单示例
├── complex-example.svg         # 复杂示例
├── package.json
└── README.md
```

## 技术实现

### SVG 解析
- 使用 `@xmldom/xmldom` 解析 SVG XML
- 自实现的 SVG 元素到 Excalidraw 元素转换
- 支持基本的路径数据解析

### 支持的 SVG 元素
| SVG 元素 | Excalidraw 类型 | 状态 |
|---------|----------------|------|
| `<rect>` | rectangle | ✅ 完全支持 |
| `<circle>` | ellipse | ✅ 完全支持 |
| `<ellipse>` | ellipse | ✅ 基本支持 |
| `<path>` | freedraw | ✅ 基本支持 |
| `<text>` | text | ✅ 基本支持 |
| `<line>` | line | 🚧 计划中 |
| `<polygon>` | freedraw | 🚧 计划中 |
| `<polyline>` | freedraw | 🚧 计划中 |

### 支持的属性
- `x`, `y`, `width`, `height`
- `cx`, `cy`, `r`, `rx`, `ry`
- `fill`, `stroke`, `stroke-width`
- `opacity`
- `font-size`, `font-family`
- 基本的 `d` 路径数据 (M, L, C, Z 命令)

## 使用 Excalidraw 文件

生成的 `.excalidraw.json` 文件可以：

1. **直接导入 Excalidraw**: 访问 [excalidraw.com](https://excalidraw.com)，点击文件菜单选择"打开"
2. **在 VS Code 中使用**: 安装 Excalidraw 插件
3. **编程使用**: 作为 JSON 数据处理

## 已知问题和限制

⚠️ **重要提醒**: 本工具在处理复杂 SVG 文件时存在限制。详细信息请参考 [KNOWN_ISSUES.md](./KNOWN_ISSUES.md)：

- **复杂路径问题**: 转换复杂SVG路径时可能丢失细节（如MCP图标示例）
- **SVG命令支持有限**: 对曲线和弧形的支持较为基础
- **性能考虑**: 大文件处理存在限制
- **功能缺失**: 一些高级SVG特性尚未支持

**建议**: 对于复杂SVG文件，请务必测试转换结果并使用提供的分析工具：

```bash
# 检查转换质量
node visual-check.js input.svg output.excalidraw.json

# 分析路径转换细节
node analyze-path.js input.svg output.excalidraw.json

# 验证输出格式
node validate.js
```

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交 Issue 和 Pull Request 来改进这个工具！

---

**语言版本:**
- [English](README.md)
- [中文](README-cn.md) (当前)
