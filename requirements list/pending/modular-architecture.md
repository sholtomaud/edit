# Feature: Modular Architecture Refactor

**Requirement ID**: #4  
**Priority**: 🔥 CRITICAL - HIGHEST  
**Status**: ⚪ Pending  
**Created**: 2026-01-04

## Objective

Refactor the monolithic single-file application into a modular, component-based architecture using native Web Components. Create an extensible plugin system where new LaTeX features can be added as independent modules without modifying core code.

## Requirements

### Core Architecture
1. Convert to native Web Components (no frameworks)
2. Implement StateManager for centralized state
3. Implement EventBus for component communication
4. Create app-shell as main container component
5. Split parser into modular service
6. Split PDF generator into modular service

### Component Extraction
7. Extract Monaco editor into `latex-editor` component
8. Extract JSON viewer into `json-viewer` component
9. Extract PDF preview into `pdf-preview` component
10. Extract toolbar into `toolbar` component
11. Create status-bar component for notifications

### Extensibility System
12. **Plugin-based parser**: Parser accepts registered feature modules
13. **Plugin-based renderer**: PDF generator accepts registered renderers
14. **Feature registration API**: Simple API to add new LaTeX commands
15. **Isolated feature modules**: Each LaTeX feature in separate file
16. **Hot-pluggable**: Features can be enabled/disabled without core changes

### File Structure
17. Separate concerns into folders (components/, services/, utils/, config/)
18. One component per file
19. One service per file
20. Clear import/export patterns

## Affected Files

**New Files Created**:
```
components/
├── app-shell.js
├── latex-editor.js
├── json-viewer.js
├── pdf-preview.js
├── toolbar.js
└── status-bar.js

services/
├── latex-parser.js
├── pdf-generator.js
├── state-manager.js
├── event-bus.js
└── feature-registry.js

utils/
├── monaco-loader.js
└── library-loader.js

config/
├── latex-examples.js
└── parser-config.js

features/
├── feature-base.js (base class for features)
├── sections.js
├── lists.js
├── equations.js
├── formatting.js
└── README.md (how to add features)
```

**Modified Files**:
- `index.html` (simplified to load app-shell only)

**Deleted Files**:
- Current monolithic HTML file (content moved to modules)

## Acceptance Criteria

- [ ] All components use native Web Components API
- [ ] No framework dependencies (React, Vue, etc.)
- [ ] StateManager handles all app state
- [ ] EventBus handles all component communication
- [ ] Components are isolated with Shadow DOM
- [ ] Each component has single responsibility
- [ ] Parser accepts feature plugin registration
- [ ] PDF generator accepts renderer plugin registration
- [ ] New LaTeX features can be added as separate files
- [ ] No changes to core code needed for new features
- [ ] All existing functionality works identically
- [ ] No console errors
- [ ] Performance unchanged or improved

## Implementation Notes

### Feature Plugin System

The parser should accept feature modules that define:
1. **Pattern matching**: What LaTeX patterns to match
2. **Parsing logic**: How to convert to JSON
3. **Rendering logic**: How to render in PDF

```javascript
// features/feature-base.js
export class FeatureBase {
  constructor() {
    this.name = 'base';
    this.priority = 100; // Lower = earlier processing
  }

  // Does this feature handle this LaTeX?
  matches(line, context) {
    return false;
  }

  // Parse LaTeX to JSON
  parse(line, context) {
    return null;
  }

  // Render JSON to PDF
  render(element, pdfGenerator, context) {
    // Implementation
  }
}
```

### Example Feature Module

```javascript
// features/sections.js
import { FeatureBase } from './feature-base.js';

export class SectionsFeature extends FeatureBase {
  constructor() {
    super();
    this.name = 'sections';
    this.priority = 10; // Process early
  }

  matches(line, context) {
    return line.match(/^\\(sub)*section\{/);
  }

  parse(line, context) {
    const match = line.match(/^\\(sub)*section\{([^}]+)\}/);
    if (!match) return null;

    const level = (match[1] || '').length / 3 + 1; // subsub = 3 chars = level 2
    return {
      type: 'section',
      level: level,
      title: match[2]
    };
  }

  render(element, generator, context) {
    generator.renderSection(element);
  }
}
```

### Feature Registry

```javascript
// services/feature-registry.js
export class FeatureRegistry {
  constructor() {
    this.features = [];
  }

  register(feature) {
    this.features.push(feature);
    this.features.sort((a, b) => a.priority - b.priority);
  }

  findFeature(line, context) {
    for (const feature of this.features) {
      if (feature.matches(line, context)) {
        return feature;
      }
    }
    return null;
  }

  parseWith(feature, line, context) {
    return feature.parse(line, context);
  }

  renderWith(feature, element, generator, context) {
    feature.render(element, generator, context);
  }
}

export const featureRegistry = new FeatureRegistry();
```

### Parser Integration

```javascript
// services/latex-parser.js
import { featureRegistry } from './feature-registry.js';

export class LaTeXParser {
  parse(latex) {
    const doc = { type: 'document', metadata: {}, content: [] };
    const lines = latex.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const context = { lineIndex: i, lines };
      
      // Find feature that handles this line
      const feature = featureRegistry.findFeature(line, context);
      
      if (feature) {
        const element = featureRegistry.parseWith(feature, line, context);
        if (element) {
          doc.content.push(element);
        }
      }
    }
    
    return doc;
  }
}
```

### PDF Generator Integration

```javascript
// services/pdf-generator.js
import { featureRegistry } from './feature-registry.js';

export class PDFGenerator {
  renderElement(element) {
    // Find feature that handles this element type
    const feature = this.findFeatureForElement(element);
    
    if (feature) {
      const context = { y: this.y, doc: this.doc };
      featureRegistry.renderWith(feature, element, this, context);
    } else {
      console.warn(`No renderer for element type: ${element.type}`);
    }
  }

  findFeatureForElement(element) {
    return featureRegistry.features.find(f => 
      f.canRender && f.canRender(element)
    );
  }
}
```

### Registering Features at Startup

```javascript
// index.html or main.js
import { featureRegistry } from './services/feature-registry.js';
import { SectionsFeature } from './features/sections.js';
import { ListsFeature } from './features/lists.js';
import { EquationsFeature } from './features/equations.js';
import { FormattingFeature } from './features/formatting.js';

// Register all features
featureRegistry.register(new SectionsFeature());
featureRegistry.register(new ListsFeature());
featureRegistry.register(new EquationsFeature());
featureRegistry.register(new FormattingFeature());

// Now parser and generator can use registered features
```

### Adding a New Feature (Future)

To add bibliography support later:

```javascript
// features/bibliography.js
import { FeatureBase } from './feature-base.js';

export class BibliographyFeature extends FeatureBase {
  constructor() {
    super();
    this.name = 'bibliography';
    this.priority = 50;
  }

  matches(line, context) {
    return line.match(/\\cite(p)?\{/) || line.match(/\\bibliography\{/);
  }

  parse(line, context) {
    // Parse citations and bibliography
  }

  render(element, generator, context) {
    // Render citations and bibliography
  }
}

// Register it
featureRegistry.register(new BibliographyFeature());
```

## Dependencies

**Prerequisite Requirements**: None (this is foundational)

**Blocks**: 
- #6 (Collapsible JSON Viewer) - Needs component architecture
- #8 (Better Math Rendering) - Should be feature module
- #9 (PDF Styling) - Needs state management
- #12 (Error Handling) - Needs event bus
- Most other features benefit from this architecture

## Testing Checklist

### Architecture
- [ ] All components properly isolated
- [ ] StateManager centralizes state
- [ ] EventBus handles all events
- [ ] No direct component-to-component calls
- [ ] No global variables (except singleton services)

### Components
- [ ] app-shell mounts correctly
- [ ] latex-editor wraps Monaco properly
- [ ] json-viewer displays JSON
- [ ] pdf-preview shows PDF
- [ ] toolbar triggers actions
- [ ] status-bar shows messages

### Feature System
- [ ] Features register successfully
- [ ] Parser finds correct feature for LaTeX
- [ ] Parser calls feature.parse() correctly
- [ ] Generator finds correct feature for element
- [ ] Generator calls feature.render() correctly
- [ ] Features process in priority order

### Functionality
- [ ] All v0.1 features still work
- [ ] Parsing produces same JSON
- [ ] PDF output identical to before
- [ ] No regression in functionality
- [ ] Performance same or better

### Extensibility
- [ ] Can add new feature without changing core
- [ ] New feature file added to features/
- [ ] New feature registered at startup
- [ ] New feature works immediately
- [ ] Multiple features don't conflict

## Migration Strategy

### Phase 1: Foundation (2-3 hours)
1. Create folder structure
2. Implement StateManager
3. Implement EventBus
4. Implement FeatureRegistry

### Phase 2: Core Services (2-3 hours)
5. Extract parser to service (with feature support)
6. Extract PDF generator to service (with feature support)
7. Create feature base class

### Phase 3: Components (3-4 hours)
8. Create app-shell
9. Create latex-editor component
10. Create json-viewer component
11. Create pdf-preview component
12. Create toolbar component
13. Create status-bar component

### Phase 4: Feature Modules (2-3 hours)
14. Extract sections to feature module
15. Extract lists to feature module
16. Extract equations to feature module
17. Extract formatting to feature module

### Phase 5: Integration & Testing (2-3 hours)
18. Wire everything together in index.html
19. Test all functionality
20. Fix bugs and edge cases
21. Update documentation

## Success Metrics

- Zero functionality regression
- Code split into 15+ files (vs 1 monolithic file)
- New feature can be added in <1 hour
- No core code changes needed for new features
- Improved code maintainability score
- Performance within 10% of original

## Estimated Effort

**Total Time**: 11-16 hours  
**Complexity**: High  
**Risk**: Medium (but mitigated by thorough testing)

## Related Requirements

**Enables**:
- #6 Collapsible JSON Viewer
- #7 Advanced LaTeX Support
- #8 Better Math Rendering
- #9 PDF Styling Options
- #12 Error Handling
- #21 Bibliography Support (new)

**All future features depend on this architecture**

## Rollback Plan

If refactor fails:
1. Keep old monolithic file as backup
2. Test thoroughly before deleting old code
3. Can revert to single file if needed
4. Git branching strategy for safe refactor

## Completion Checklist

When marking this requirement as complete:

- [ ] All acceptance criteria met
- [ ] All tests pass
- [ ] No functionality regression
- [ ] Feature plugin system working
- [ ] Example new feature added successfully
- [ ] Documentation updated (AGENTS.md, README.md)
- [ ] Architecture diagram created
- [ ] Code reviewed
- [ ] Requirement moved to `requirements/completed/`
- [ ] REQUIREMENTS.md status updated to 🟢
- [ ] Completion date added to this file

## Notes

- **This is the highest priority requirement** - Everything else builds on this
- Take time to do it right - it's foundational
- Test extensively before considering it complete
- The feature plugin system is key to extensibility
- Document the feature creation process thoroughly
- This enables rapid development of all future features
- Consider this an investment that pays dividends forever
