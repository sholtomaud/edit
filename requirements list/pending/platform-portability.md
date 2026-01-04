# Feature: Platform Portability Architecture

**Requirement ID**: #22  
**Priority**: High (Design concern for #4)  
**Status**: ⚪ Pending  
**Created**: 2026-01-04

## Objective

Design the application architecture to be platform-agnostic, allowing the core engine to run in both web browsers and VSCode with minimal code changes. This enables future porting to a VSCode extension while building the web version first.

## Requirements

### Core Principles
1. **Separation of concerns** - Core logic independent of platform
2. **Platform adapter pattern** - Abstract platform-specific operations
3. **No browser-specific APIs in core** - All browser APIs behind adapters
4. **Shared codebase** - 90%+ code reusable between platforms
5. **Clean interfaces** - Well-defined boundaries between layers

### Platform Abstraction Layer
6. File I/O abstraction (read/write files)
7. Storage abstraction (settings, cache)
8. UI abstraction (dialogs, notifications)
9. External tool integration abstraction (Zotero, etc.)
10. Network abstraction (API calls, CDN loading)

### Code Organization
11. Core engine has zero platform dependencies
12. All services platform-agnostic
13. All feature modules platform-agnostic
14. Only adapter layer has platform-specific code
15. Components use adapter for platform operations

### VSCode Readiness
16. Document workspace requirements (future)
17. Design for file-based projects (not just in-memory)
18. Consider multi-file LaTeX projects
19. Plan for Zotero integration points
20. Design settings structure for VSCode config

## Affected Files

**New Files**:
- `adapters/platform-adapter.js` (base interface)
- `adapters/web-adapter.js` (browser implementation)
- `adapters/vscode-adapter.js` (stub for future)
- `adapters/README.md` (porting guide)

**Modified Files**:
- All components (use adapter instead of direct APIs)
- All services (accept adapter in constructor)
- `index.html` (instantiate web adapter)

## Acceptance Criteria

- [ ] PlatformAdapter interface defined
- [ ] WebAdapter implements all methods
- [ ] VSCodeAdapter stub exists with TODO comments
- [ ] No `window.localStorage` in core code
- [ ] No `window.fetch` in core code
- [ ] No browser File API in core code
- [ ] All file operations go through adapter
- [ ] All storage operations go through adapter
- [ ] All UI dialogs go through adapter
- [ ] Core code can run in Node.js (theoretically)
- [ ] Porting guide documents conversion process
- [ ] No refactoring needed to core for VSCode port

## Implementation Notes

### Platform Adapter Interface

```javascript
// adapters/platform-adapter.js
export class PlatformAdapter {
  constructor() {
    if (new.target === PlatformAdapter) {
      throw new Error('PlatformAdapter is abstract');
    }
  }

  // File Operations
  async readFile(path) {
    throw new Error('Must implement readFile');
  }

  async writeFile(path, content) {
    throw new Error('Must implement writeFile');
  }

  async pickFile(options = {}) {
    throw new Error('Must implement pickFile');
  }

  async fileExists(path) {
    throw new Error('Must implement fileExists');
  }

  // Storage Operations
  async getItem(key) {
    throw new Error('Must implement getItem');
  }

  async setItem(key, value) {
    throw new Error('Must implement setItem');
  }

  async removeItem(key) {
    throw new Error('Must implement removeItem');
  }

  // UI Operations
  async showMessage(message, type = 'info') {
    throw new Error('Must implement showMessage');
  }

  async showError(message) {
    throw new Error('Must implement showError');
  }

  async confirm(message) {
    throw new Error('Must implement confirm');
  }

  async prompt(message, defaultValue = '') {
    throw new Error('Must implement prompt');
  }

  // External Integrations
  async getZoteroEntries() {
    throw new Error('Must implement getZoteroEntries');
  }

  async getBibliographyFile(name) {
    throw new Error('Must implement getBibliographyFile');
  }

  // Network Operations
  async loadExternalScript(url) {
    throw new Error('Must implement loadExternalScript');
  }

  // Platform Info
  getPlatformName() {
    throw new Error('Must implement getPlatformName');
  }

  supportsFeature(feature) {
    throw new Error('Must implement supportsFeature');
  }
}
```

### Web Adapter Implementation

```javascript
// adapters/web-adapter.js
import { PlatformAdapter } from './platform-adapter.js';

export class WebAdapter extends PlatformAdapter {
  constructor() {
    super();
    this.storage = new Map(); // In-memory storage for web
  }

  // File Operations
  async readFile(path) {
    throw new Error('Direct file paths not supported in web. Use pickFile() instead.');
  }

  async writeFile(path, content) {
    // Trigger download
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = path;
    a.click();
    URL.revokeObjectURL(url);
  }

  async pickFile(options = {}) {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      if (options.accept) input.accept = options.accept;
      
      input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return reject(new Error('No file selected'));
        
        const content = await file.text();
        resolve({ name: file.name, content });
      };
      
      input.click();
    });
  }

  async fileExists(path) {
    return false; // Web version doesn't have persistent file system
  }

  // Storage Operations (in-memory for web)
  async getItem(key) {
    return this.storage.get(key);
  }

  async setItem(key, value) {
    this.storage.set(key, value);
  }

  async removeItem(key) {
    this.storage.delete(key);
  }

  // UI Operations
  async showMessage(message, type = 'info') {
    // Could use custom toast component
    console.log(`[${type}]`, message);
    // eventBus.emit('ui:notification', { message, type });
  }

  async showError(message) {
    alert(`Error: ${message}`);
  }

  async confirm(message) {
    return confirm(message);
  }

  async prompt(message, defaultValue = '') {
    return prompt(message, defaultValue);
  }

  // External Integrations
  async getZoteroEntries() {
    throw new Error('Zotero integration not available in web version. Please export .bib file from Zotero.');
  }

  async getBibliographyFile(name) {
    throw new Error('Cannot access local files in web version. Please upload .bib file.');
  }

  // Network Operations
  async loadExternalScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = url;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Platform Info
  getPlatformName() {
    return 'web';
  }

  supportsFeature(feature) {
    const features = {
      'zotero': false,
      'filesystem': false,
      'multifile': false,
      'upload': true,
      'download': true
    };
    return features[feature] || false;
  }
}
```

### VSCode Adapter Stub

```javascript
// adapters/vscode-adapter.js
import { PlatformAdapter } from './platform-adapter.js';

export class VSCodeAdapter extends PlatformAdapter {
  constructor(vscode) {
    super();
    this.vscode = vscode;
    // TODO: Initialize VSCode-specific services
  }

  // File Operations
  async readFile(path) {
    // TODO: Use vscode.workspace.fs.readFile()
    throw new Error('VSCode adapter not yet implemented');
  }

  async writeFile(path, content) {
    // TODO: Use vscode.workspace.fs.writeFile()
    throw new Error('VSCode adapter not yet implemented');
  }

  async pickFile(options = {}) {
    // TODO: Use vscode.window.showOpenDialog()
    throw new Error('VSCode adapter not yet implemented');
  }

  async fileExists(path) {
    // TODO: Check if file exists in workspace
    throw new Error('VSCode adapter not yet implemented');
  }

  // Storage Operations
  async getItem(key) {
    // TODO: Use context.globalState or workspaceState
    throw new Error('VSCode adapter not yet implemented');
  }

  async setItem(key, value) {
    // TODO: Use context.globalState.update()
    throw new Error('VSCode adapter not yet implemented');
  }

  async removeItem(key) {
    // TODO: Remove from globalState
    throw new Error('VSCode adapter not yet implemented');
  }

  // UI Operations
  async showMessage(message, type = 'info') {
    // TODO: Use vscode.window.showInformationMessage()
    throw new Error('VSCode adapter not yet implemented');
  }

  async showError(message) {
    // TODO: Use vscode.window.showErrorMessage()
    throw new Error('VSCode adapter not yet implemented');
  }

  async confirm(message) {
    // TODO: Use showWarningMessage with Yes/No buttons
    throw new Error('VSCode adapter not yet implemented');
  }

  async prompt(message, defaultValue = '') {
    // TODO: Use vscode.window.showInputBox()
    throw new Error('VSCode adapter not yet implemented');
  }

  // External Integrations
  async getZoteroEntries() {
    // TODO: Read Zotero SQLite database or Better BibTeX export
    // This is a major advantage of VSCode version!
    throw new Error('VSCode adapter not yet implemented');
  }

  async getBibliographyFile(name) {
    // TODO: Search workspace for .bib file
    throw new Error('VSCode adapter not yet implemented');
  }

  // Network Operations
  async loadExternalScript(url) {
    // TODO: VSCode extensions can bundle dependencies
    throw new Error('VSCode adapter not yet implemented');
  }

  // Platform Info
  getPlatformName() {
    return 'vscode';
  }

  supportsFeature(feature) {
    const features = {
      'zotero': true,          // Can read Zotero DB!
      'filesystem': true,      // Full file system access
      'multifile': true,       // Can handle \include{} across files
      'upload': false,         // Not needed
      'download': false        // Direct file writes
    };
    return features[feature] || false;
  }
}
```

### Using Adapter in Services

```javascript
// services/latex-parser.js
export class LaTeXParser {
  constructor(adapter) {
    this.adapter = adapter;
  }

  async parseFile(path) {
    const content = await this.adapter.readFile(path);
    return this.parse(content);
  }

  async handleInclude(includePath, context) {
    if (!this.adapter.supportsFeature('multifile')) {
      throw new Error('Multi-file projects not supported on this platform');
    }
    
    const includeContent = await this.adapter.readFile(includePath);
    return this.parse(includeContent);
  }
}
```

### Using Adapter in Components

```javascript
// components/toolbar.js
export class Toolbar extends HTMLElement {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  async handleUploadBib() {
    try {
      const file = await this.adapter.pickFile({ accept: '.bib' });
      eventBus.emit('bibliography:loaded', file);
    } catch (err) {
      await this.adapter.showError(err.message);
    }
  }

  async handleLoadZotero() {
    if (!this.adapter.supportsFeature('zotero')) {
      await this.adapter.showMessage(
        'Zotero integration only available in VSCode extension',
        'warning'
      );
      return;
    }

    try {
      const entries = await this.adapter.getZoteroEntries();
      eventBus.emit('bibliography:loaded', { entries });
    } catch (err) {
      await this.adapter.showError(err.message);
    }
  }
}
```

### Initialization

```javascript
// index.html or main.js
import { WebAdapter } from './adapters/web-adapter.js';
import { StateManager } from './services/state-manager.js';
import { LaTeXParser } from './services/latex-parser.js';

// Initialize platform adapter
const adapter = new WebAdapter();

// Pass adapter to all services
const parser = new LaTeXParser(adapter);
const stateManager = new StateManager(adapter);

// Store globally for components
window.platformAdapter = adapter;
```

## Porting Guide

### Converting to VSCode Extension

When ready to create VSCode extension:

1. **Copy core files** (no changes needed):
   - `services/`
   - `features/`
   - `utils/` (mostly)

2. **Implement VSCodeAdapter**:
   - Fill in all TODO methods
   - Use VSCode APIs

3. **Create extension entry point**:
   ```javascript
   // extension.js
   import { VSCodeAdapter } from './adapters/vscode-adapter.js';
   import { LaTeXParser } from './services/latex-parser.js';

   export function activate(context) {
     const adapter = new VSCodeAdapter(vscode);
     const parser = new LaTeXParser(adapter);
     
     // Register commands, views, etc.
   }
   ```

4. **Replace UI components**:
   - Web components → VSCode webviews or native UI
   - Or keep web components in webview panel

5. **Add VSCode-specific features**:
   - Command palette commands
   - Status bar items
   - File watchers
   - Zotero integration

## Dependencies

**Prerequisite Requirements**: 
- Should be designed during #4 (Modular Architecture)

**Blocks**: None, but enables future VSCode port

## Testing Checklist

- [ ] No direct browser API calls in core code
- [ ] All file operations use adapter
- [ ] All storage operations use adapter
- [ ] All UI operations use adapter
- [ ] Core services work with mock adapter
- [ ] Can swap adapters without changing core
- [ ] VSCodeAdapter stub compiles (even if not functional)
- [ ] Porting guide is complete and accurate

## Success Metrics

- 95%+ code reuse when porting to VSCode
- Zero refactoring of core logic needed
- Adapter pattern well documented
- Future developers can add new platform easily

## Estimated Effort

**Time**: 2-3 hours (as part of #4)  
**Complexity**: Medium  
**Risk**: Low

## Related Requirements

- **#4**: Modular Architecture (implement together)
- **#23**: VSCode Extension Port (future, enabled by this)

## Completion Checklist

- [ ] PlatformAdapter interface complete
- [ ] WebAdapter fully implemented
- [ ] VSCodeAdapter stub created
- [ ] All core code uses adapter
- [ ] No platform-specific code in core
- [ ] Porting guide written
- [ ] Example shown in documentation

## Notes

- This is a design principle more than a feature
- Should be implemented as part of #4 (Modular Architecture)
- Adds minimal overhead now, saves weeks of work later
- VSCode extension market is valuable (developers with $)
- Zotero integration is killer feature for VSCode version
