# Feature: Custom PDF Styling Options

**Requirement ID**: #9  
**Priority**: Low  
**Status**: ⚪ Pending  
**Created**: 2026-01-04

## Objective

Allow users to customize the appearance of generated PDFs by adjusting fonts, colors, spacing, margins, and page layout to match their preferences or institutional requirements.

## Requirements

### Font Options
1. Font family selection (serif, sans-serif, monospace)
2. Base font size adjustment (8pt - 18pt)
3. Heading font sizes relative to base
4. Code/monospace font for verbatim text

### Layout Options
5. Page size selection (A4, Letter, Legal, A5)
6. Orientation (portrait, landscape)
7. Margin sizes (narrow, normal, wide, custom)
8. Line spacing (single, 1.15, 1.5, double)
9. Paragraph spacing

### Color Options
10. Text color
11. Link color
12. Heading colors
13. Background color (white, cream, light gray)
14. Code block background

### Advanced Options
15. Page numbering (position, format)
16. Header/footer customization
17. Two-column layout toggle
18. Justify text toggle

## Affected Files

**New Files**:
- `components/style-panel.js` (new settings panel component)
- `config/pdf-styles.js` (style presets and defaults)

**Modified Files**:
- `services/state-manager.js` (add pdfStyles state)
- `services/pdf-generator.js` (apply custom styles)
- `components/toolbar.js` (add "Settings" button)
- `styles/main.css` (settings panel styles)

## Acceptance Criteria

- [ ] Settings panel accessible from toolbar
- [ ] All font options apply correctly to PDF
- [ ] Page size changes affect layout properly
- [ ] Margin adjustments work correctly
- [ ] Color changes apply to all relevant elements
- [ ] Line spacing affects paragraph rendering
- [ ] Settings persist during session
- [ ] Preview updates when settings change
- [ ] Preset styles available (Academic, Modern, Minimal)
- [ ] Custom settings can be saved as preset
- [ ] Settings can be reset to default
- [ ] No layout breaks with extreme settings

## Implementation Notes

### Settings Panel Component

```javascript
// components/style-panel.js
export class StylePanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .panel {
          position: fixed;
          right: -350px;
          top: 0;
          width: 350px;
          height: 100vh;
          background: #2d2d30;
          transition: right 0.3s;
          overflow-y: auto;
        }
        .panel.open { right: 0; }
      </style>
      <div class="panel">
        <h3>PDF Style Settings</h3>
        <!-- Settings controls -->
      </div>
    `;
  }
}
```

### Style Configuration

```javascript
// config/pdf-styles.js
export const DEFAULT_STYLES = {
  font: {
    family: 'helvetica',
    baseSize: 12,
    headingScale: [2.0, 1.5, 1.2, 1.0], // h1-h4 relative to base
    monoFamily: 'courier'
  },
  page: {
    size: 'a4',
    orientation: 'portrait',
    margins: { top: 20, right: 20, bottom: 20, left: 20 }
  },
  spacing: {
    lineHeight: 1.5,
    paragraphSpacing: 5
  },
  colors: {
    text: '#000000',
    heading: '#000000',
    link: '#0000EE',
    background: '#FFFFFF'
  }
};

export const PRESETS = {
  academic: {
    font: { family: 'times', baseSize: 12 },
    page: { size: 'letter', margins: { top: 25, right: 25, bottom: 25, left: 25 } },
    spacing: { lineHeight: 2.0 }
  },
  modern: {
    font: { family: 'helvetica', baseSize: 11 },
    page: { size: 'a4', margins: { top: 15, right: 15, bottom: 15, left: 15 } },
    colors: { heading: '#2c3e50' }
  },
  minimal: {
    font: { family: 'helvetica', baseSize: 10 },
    page: { margins: { top: 10, right: 10, bottom: 10, left: 10 } },
    spacing: { lineHeight: 1.2 }
  }
};
```

### Applying Styles in PDF Generator

```javascript
// services/pdf-generator.js
class PDFGenerator {
  constructor(styles = DEFAULT_STYLES) {
    this.styles = styles;
    const { jsPDF } = window.jspdf;
    this.doc = new jsPDF({
      format: this.styles.page.size,
      orientation: this.styles.page.orientation
    });
    this.applyStyles();
  }

  applyStyles() {
    this.doc.setFont(this.styles.font.family);
    this.doc.setFontSize(this.styles.font.baseSize);
    this.doc.setTextColor(this.styles.colors.text);
    this.margin = this.styles.page.margins.left;
    this.lineHeight = this.styles.font.baseSize * this.styles.spacing.lineHeight * 0.35;
  }

  renderSection(element) {
    const scale = this.styles.font.headingScale[element.level - 1] || 1.0;
    const fontSize = this.styles.font.baseSize * scale;
    this.doc.setFontSize(fontSize);
    this.doc.setTextColor(this.styles.colors.heading);
    // ... render section
    this.doc.setFontSize(this.styles.font.baseSize);
    this.doc.setTextColor(this.styles.colors.text);
  }
}
```

### State Management

```javascript
// services/state-manager.js
constructor() {
  this.state = {
    // ... existing state ...
    pdfStyles: { ...DEFAULT_STYLES }
  };
}
```

## User Interface Design

### Settings Panel Layout

```
┌─────────────────────────────────┐
│ PDF Style Settings          [×] │
├─────────────────────────────────┤
│                                 │
│ Presets                         │
│ ○ Academic  ○ Modern  ○ Minimal │
│                                 │
│ ─── Font ───                    │
│ Family:  [Serif      ▼]        │
│ Size:    [12pt       ▼]        │
│                                 │
│ ─── Page ───                    │
│ Size:    [A4         ▼]        │
│ Orient:  ○ Portrait ○ Landscape│
│ Margins: [Normal     ▼]        │
│                                 │
│ ─── Spacing ───                 │
│ Line:    [1.5×       ▼]        │
│ Para:    [5pt        ▼]        │
│                                 │
│ ─── Colors ───                  │
│ Text:    [⬛ #000000]           │
│ Heading: [⬛ #000000]           │
│                                 │
│ [Reset to Default]              │
│ [Apply Changes]                 │
│                                 │
└─────────────────────────────────┘
```

### Toolbar Button

Add "Settings" or "Style" button with gear icon:
```
[ Parse ] [ Generate PDF ] [ Download ] [ ⚙ Settings ]
```

## Dependencies

**Prerequisite Requirements**: 
- #4 (Modular Architecture) - Recommended
- #2 (PDF Generation) - Must be working

**Blocks**: None

## Testing Checklist

### Font Settings
- [ ] Serif font applies correctly
- [ ] Sans-serif font applies correctly
- [ ] Monospace font applies correctly
- [ ] Font sizes scale appropriately
- [ ] Heading hierarchy maintained

### Page Settings
- [ ] A4 size renders correctly
- [ ] Letter size renders correctly
- [ ] Landscape orientation works
- [ ] Portrait orientation works
- [ ] Custom margins apply

### Spacing Settings
- [ ] Line spacing changes affect layout
- [ ] Paragraph spacing works
- [ ] No text overlap at tight spacing
- [ ] No excessive whitespace at wide spacing

### Color Settings
- [ ] Text color changes apply
- [ ] Heading colors work
- [ ] Links render in custom color
- [ ] Background colors work
- [ ] Colors contrast well (accessibility)

### Presets
- [ ] Academic preset loads correctly
- [ ] Modern preset loads correctly
- [ ] Minimal preset loads correctly
- [ ] Switching presets updates all settings
- [ ] Can customize after loading preset

### Edge Cases
- [ ] Extreme font sizes (6pt, 24pt) work
- [ ] Zero margins handled gracefully
- [ ] Invalid color codes rejected
- [ ] Settings persist during session
- [ ] Reset restores defaults correctly

## User Stories

**As an academic**, I want to use Times New Roman with double-spacing and 1-inch margins so that my papers meet journal requirements.

**As a designer**, I want to customize colors and fonts so that my PDFs match my brand guidelines.

**As a student**, I want preset styles so that I don't have to manually configure settings for each document type.

**As a power user**, I want to save my custom settings as a preset so that I can reuse them across multiple documents.

## Example Use Cases

### Academic Paper
```javascript
{
  font: { family: 'times', baseSize: 12 },
  page: { size: 'letter', margins: { all: 25.4 } }, // 1 inch
  spacing: { lineHeight: 2.0 },
  colors: { text: '#000000' }
}
```

### Modern Article
```javascript
{
  font: { family: 'helvetica', baseSize: 11 },
  page: { size: 'a4', margins: { top: 20, right: 15, bottom: 20, left: 15 } },
  spacing: { lineHeight: 1.5 },
  colors: { text: '#333333', heading: '#2c3e50' }
}
```

### Compact Reference
```javascript
{
  font: { family: 'helvetica', baseSize: 9 },
  page: { size: 'a4', margins: { all: 10 } },
  spacing: { lineHeight: 1.2, paragraphSpacing: 3 },
  colors: { text: '#000000' }
}
```

## Edge Cases

1. **Very large fonts**: May cause page overflow - implement warnings
2. **Zero margins**: Allow but warn about printing issues
3. **Invalid colors**: Validate hex codes and provide fallback
4. **Conflicting settings**: Ensure combinations work together
5. **Font availability**: Handle missing fonts gracefully

## Performance Considerations

- Don't regenerate PDF on every slider change (debounce)
- Cache font metrics to avoid recalculation
- Preview changes without full regeneration when possible
- Limit color picker updates to prevent lag

## Accessibility Considerations

- Ensure sufficient color contrast (WCAG AA minimum)
- Provide keyboard navigation in settings panel
- Label all form controls properly
- Warn about low-contrast color choices
- Support high contrast mode

## Future Enhancements

- [ ] Import/export style presets as JSON
- [ ] Share custom styles via URL
- [ ] Theme marketplace or gallery
- [ ] Style preview thumbnails
- [ ] Live preview as settings change
- [ ] Style templates for common document types
- [ ] Advanced typography (kerning, tracking)
- [ ] Custom color palettes

## Success Metrics

- 80% of users use default or preset styles
- 20% customize at least one setting
- Settings panel opens in <50ms
- Style changes apply in <200ms
- No performance degradation with custom styles

## Estimated Effort

**Time**: 6-8 hours  
**Complexity**: Medium  
**Risk**: Low-Medium

### Breakdown
- Settings panel UI: 2 hours
- Style configuration: 1 hour
- PDF generator integration: 2 hours
- Presets and defaults: 1 hour
- Testing and polish: 2 hours

## Related Requirements

- **#2**: PDF Generation (core dependency)
- **#4**: Modular Architecture (preferred architecture)
- **#10**: Editor Enhancements (complementary features)

## Completion Checklist

When marking this requirement as complete:

- [ ] All acceptance criteria met
- [ ] All test cases pass
- [ ] Settings panel fully functional
- [ ] Presets working correctly
- [ ] Documentation updated
- [ ] Examples added for each preset
- [ ] Accessibility verified
- [ ] Requirement moved to `requirements/completed/`
- [ ] REQUIREMENTS.md status updated to 🟢
- [ ] Completion date added to this file

## Notes

- Start with basic font/page settings, add advanced features later
- Focus on most commonly customized settings first
- Provide sensible defaults that work for most users
- Consider adding "Why can't I...?" help tooltips
- Document which jsPDF fonts are available
- Consider PDF/A compliance for archival documents
