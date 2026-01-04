# Feature: Better Math Rendering Support

**Requirement ID**: #8  
**Priority**: Medium  
**Status**: ⚪ Pending  
**Created**: 2026-01-04

## Objective

Improve mathematical equation rendering in PDFs by supporting a comprehensive set of LaTeX math commands and symbols, providing output that closely matches traditional LaTeX typesetting quality.

## Requirements

### Basic Math Features
1. Fractions (`\frac{numerator}{denominator}`)
2. Square roots (`\sqrt{x}`, `\sqrt[n]{x}`)
3. Superscripts (`x^2`, `x^{2n}`)
4. Subscripts (`x_i`, `x_{ij}`)
5. Greek letters (α, β, γ, Δ, Σ, etc.)
6. Mathematical operators (∑, ∏, ∫, ∂, ∇)

### Advanced Math Features
7. Matrices (`\begin{matrix}`, `\begin{pmatrix}`, `\begin{bmatrix}`)
8. Multi-line equations (`\begin{align}`)
9. Cases/piecewise functions (`\begin{cases}`)
10. Limits, integrals, and sums with proper positioning
11. Over/under braces (`\overbrace`, `\underbrace`)
12. Accents (hat, tilde, bar, dot, etc.)

### Display Math
13. Inline math with proper baseline alignment
14. Display math with centered positioning
15. Equation numbering
16. Proper spacing around operators

## Affected Files

**New Files**:
- `services/math-renderer.js` (new service for math typesetting)
- `utils/math-symbols.js` (symbol mappings and Unicode)

**Modified Files**:
- `services/latex-parser.js` (enhanced math parsing)
- `services/pdf-generator.js` (integrate math renderer)
- `config/parser-config.js` (math command definitions)

## Acceptance Criteria

- [ ] All basic math features render correctly
- [ ] Greek letters display as proper Unicode symbols
- [ ] Fractions have proper numerator/denominator layout
- [ ] Subscripts and superscripts are correctly positioned
- [ ] Square roots display with proper radical symbol
- [ ] Matrices render with correct alignment
- [ ] Summation/integral symbols scale appropriately
- [ ] Inline math doesn't break line height
- [ ] Display math is properly centered
- [ ] Equation numbers align correctly
- [ ] Math output is visually similar to LaTeX
- [ ] No console errors during math rendering
- [ ] Performance: renders complex equation in <100ms

## Implementation Notes

### Approach: Custom Math Renderer

Since we cannot use external libraries (KaTeX, MathJax), we need a custom solution:

1. **Parse math expressions** into an AST (Abstract Syntax Tree)
2. **Convert to layout tree** with positioning information
3. **Render using jsPDF** text and graphics primitives

### Math Parser Structure

```javascript
// services/math-renderer.js
export class MathRenderer {
  constructor(pdf) {
    this.pdf = pdf;
  }

  renderInline(mathExpr, x, y) {
    const ast = this.parse(mathExpr);
    const layout = this.layout(ast, 'inline');
    this.render(layout, x, y);
  }

  renderDisplay(mathExpr, x, y) {
    const ast = this.parse(mathExpr);
    const layout = this.layout(ast, 'display');
    this.render(layout, x, y);
  }

  parse(expr) {
    // Convert LaTeX to AST
    // e.g., "x^2" → { type: 'superscript', base: 'x', sup: '2' }
  }

  layout(ast, mode) {
    // Calculate positions and sizes
  }

  render(layout, x, y) {
    // Draw using jsPDF primitives
  }
}
```

### Symbol Mapping

```javascript
// utils/math-symbols.js
export const GREEK_LETTERS = {
  'alpha': 'α', 'beta': 'β', 'gamma': 'γ',
  'delta': 'δ', 'epsilon': 'ε', 'zeta': 'ζ',
  'eta': 'η', 'theta': 'θ', 'iota': 'ι',
  // ... complete alphabet
  'Alpha': 'Α', 'Beta': 'Β', 'Gamma': 'Γ',
  // ... uppercase
};

export const MATH_OPERATORS = {
  'sum': '∑', 'prod': '∏', 'int': '∫',
  'partial': '∂', 'nabla': '∇', 'infty': '∞',
  'pm': '±', 'times': '×', 'div': '÷',
  // ... complete set
};
```

### Fraction Rendering

```javascript
renderFraction(num, denom, x, y, size) {
  const lineY = y;
  const numY = y - size * 0.4;
  const denomY = y + size * 0.6;
  
  // Render numerator above
  this.renderExpression(num, x, numY, size * 0.7);
  
  // Render fraction line
  this.pdf.line(x, lineY, x + width, lineY);
  
  // Render denominator below
  this.renderExpression(denom, x, denomY, size * 0.7);
}
```

### Square Root Rendering

```javascript
renderSqrt(expr, x, y, size) {
  // Draw radical symbol using paths
  const height = size * 1.2;
  const width = this.getExprWidth(expr);
  
  // Draw the √ shape
  this.pdf.lines([
    [0, height * 0.5],
    [size * 0.15, height * 0.7],
    [size * 0.3, 0],
    [width + size * 0.2, 0]
  ], x, y);
  
  // Render expression inside
  this.renderExpression(expr, x + size * 0.4, y + height * 0.3, size);
}
```

### Superscript/Subscript Positioning

```javascript
renderScript(base, script, type, x, y, size) {
  // Render base
  this.renderExpression(base, x, y, size);
  const baseWidth = this.getExprWidth(base);
  
  // Calculate script position
  const scriptSize = size * 0.7;
  const scriptX = x + baseWidth;
  const scriptY = type === 'sup' ? y - size * 0.4 : y + size * 0.3;
  
  // Render script
  this.renderExpression(script, scriptX, scriptY, scriptSize);
}
```

## Dependencies

**Prerequisite Requirements**: 
- #4 (Modular Architecture) - Recommended but not required
- #1 (Basic LaTeX Parsing) - Must be working

**Blocks**: None

## Testing Checklist

### Basic Math
- [ ] `$x + y$` renders correctly
- [ ] `$x^2$` superscript positioned correctly
- [ ] `$x_i$` subscript positioned correctly
- [ ] `$\frac{1}{2}$` fraction displays properly
- [ ] `$\sqrt{x}$` square root renders
- [ ] `$\alpha + \beta$` Greek letters display

### Complex Math
- [ ] `$x^{2n+1}$` complex superscript
- [ ] `$x_{i,j}$` complex subscript
- [ ] `$\frac{a+b}{c+d}$` fraction with expressions
- [ ] `$\sqrt[3]{x}$` nth root
- [ ] Nested fractions render correctly
- [ ] Combined super/subscripts work

### Display Math
- [ ] `\begin{equation}` centers properly
- [ ] Equation numbers appear correctly
- [ ] Multi-line equations align
- [ ] Large operators scale appropriately

### Edge Cases
- [ ] Empty expressions don't crash
- [ ] Malformed math shows error
- [ ] Very long expressions wrap or scale
- [ ] Nested structures don't overflow

### Performance
- [ ] Simple equation renders in <10ms
- [ ] Complex equation renders in <100ms
- [ ] Page with 20 equations renders in <2s

## Example Test Cases

```latex
% Basic inline math
This is $E = mc^2$ inline.

% Fractions
$$\frac{-b \pm \sqrt{b^2 - 4ac}}{2a}$$

% Greek letters
$$\alpha + \beta = \gamma$$

% Summation
$$\sum_{i=1}^{n} i = \frac{n(n+1)}{2}$$

% Integration
$$\int_0^{\infty} e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$

% Matrix
$$\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}$$

% Cases
$$f(x) = \begin{cases}
x^2 & \text{if } x \geq 0 \\
-x^2 & \text{if } x < 0
\end{cases}$$
```

## Known Limitations

1. **No font metrics**: Unlike TeX, we don't have precise font metrics, so spacing may not be perfect
2. **Limited fonts**: jsPDF has limited font support; may need to approximate some symbols
3. **Complex layouts**: Very complex nested structures may require manual adjustment
4. **Performance**: Pure JavaScript rendering is slower than native TeX

## Alternatives Considered

### Option 1: Embed KaTeX (Rejected)
- **Pros**: Professional quality, feature-complete
- **Cons**: Violates no-library constraint, requires CSS rendering

### Option 2: Server-side rendering (Rejected)
- **Pros**: Perfect LaTeX quality
- **Cons**: Requires backend, violates client-side constraint

### Option 3: Canvas-based rendering (Rejected)
- **Pros**: Precise pixel control
- **Cons**: Doesn't integrate with jsPDF text, rasterized output

### Option 4: Custom renderer (Selected)
- **Pros**: Full control, no dependencies, integrates with jsPDF
- **Cons**: Significant implementation effort, approximate quality

## Phased Implementation

### Phase 1 (MVP)
- Greek letters
- Basic superscripts/subscripts
- Simple fractions
- Common operators

### Phase 2 (Enhanced)
- Square roots
- Summations/integrals with limits
- Matrices (basic)
- Better spacing

### Phase 3 (Advanced)
- Multi-line equations
- Cases/piecewise
- Complex nested structures
- Over/underbraces

## Success Metrics

- 95% of common math expressions render correctly
- Visual quality is "good enough" for technical documents
- No crashes on malformed input
- Performance meets <100ms target for complex equations

## Estimated Effort

**Phase 1**: 8-12 hours  
**Phase 2**: 6-8 hours  
**Phase 3**: 8-10 hours  
**Total**: 22-30 hours  
**Complexity**: High  
**Risk**: Medium-High (complex problem domain)

## Related Requirements

- **#1**: Basic LaTeX Parsing (dependency)
- **#2**: PDF Generation (dependency)
- **#7**: Advanced LaTeX Support (tables, figures complement this)

## Completion Checklist

When marking this requirement as complete:

- [ ] All acceptance criteria met
- [ ] All test cases pass
- [ ] Documentation updated with supported commands
- [ ] Examples added to latex-examples.js
- [ ] Performance benchmarks documented
- [ ] Requirement moved to `requirements/completed/`
- [ ] REQUIREMENTS.md status updated to 🟢
- [ ] Completion date added to this file

## Notes

- This is the most complex technical challenge in the project
- Consider implementing in phases rather than all at once
- Quality doesn't need to match LaTeX exactly, just be "good enough"
- Focus on common use cases first (80/20 rule)
- Document unsupported features clearly for users
