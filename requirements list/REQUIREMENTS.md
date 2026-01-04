# LaTeX PDF Editor - Requirements

## Status Legend
- 🟢 Completed
- 🟡 In Progress  
- 🔴 Blocked
- ⚪ Pending

## Version History

- **v0.1** (Initial) - Basic parsing and PDF generation
- **v0.2** (Current) - Modular refactor and tooling

---

## Core Features

### 1. LaTeX Parsing (v0.1) 🟢
**Status**: Completed  
**Priority**: High  
**Completion Date**: 2026-01-04

- [x] Document metadata extraction (title, author, date)
- [x] Section and subsection parsing
- [x] Paragraph text with inline formatting
- [x] Bold text (`\textbf{}`)
- [x] Italic text (`\textit{}`)
- [x] Inline math (`$...$`)
- [x] Numbered equations (`\begin{equation}`)
- [x] Unordered lists (`\begin{itemize}`)
- [x] Ordered lists (`\begin{enumerate}`)

### 2. PDF Generation (v0.1) 🟢
**Status**: Completed  
**Priority**: High  
**Completion Date**: 2026-01-04

- [x] Title page rendering
- [x] Section hierarchy
- [x] Paragraph text wrapping
- [x] List rendering (bullets and numbers)
- [x] Basic equation display
- [x] Automatic page breaks
- [x] PDF download functionality

### 3. User Interface (v0.1) 🟢
**Status**: Completed  
**Priority**: Medium  
**Completion Date**: 2026-01-04

- [x] Monaco editor integration
- [x] Three-pane layout (editor, JSON, preview)
- [x] Parse button
- [x] Generate PDF button
- [x] Download PDF button
- [x] Sample LaTeX document loaded on start

---

## Infrastructure & Tooling (v0.2)

### 4. Modular Architecture 🟡
**Status**: In Progress
**Priority**: 🔥 CRITICAL (Highest)  
**Requirement File**: `requirements/pending/modular-architecture.md`  
**Depends on**: None  
**Blocks**: #6, #7, #8, #9, #12, #21, #22, #23

**Requirements**:
- [ ] Convert to Web Components architecture
- [ ] Create app-shell component
- [ ] Extract Monaco editor to component
- [ ] Extract JSON viewer to component
- [ ] Extract PDF preview to component
- [ ] Extract toolbar to component
- [ ] Implement StateManager service
- [ ] Implement EventBus service
- [ ] Implement FeatureRegistry (plugin system)
- [ ] Split parser into modular service
- [ ] Split PDF generator into modular service
- [ ] Each LaTeX feature as separate plugin module

**Estimated Effort**: 11-16 hours  
**Why Critical**: Enables plugin architecture where new LaTeX features can be added as independent modules without touching core code

### 5. GitHub Actions Deployment ⚪
**Status**: Pending  
**Priority**: High  
**Requirement File**: `requirements/pending/github-pages-deployment.md`  
**Depends on**: None  
**Blocks**: None

**Requirements**:
- [ ] Create `.github/workflows/deploy.yml`
- [ ] Configure GitHub Pages deployment
- [ ] Deploy on push to main branch
- [ ] Set up custom domain support (optional)
- [ ] Add deployment status badge to README

**Estimated Effort**: 15-30 minutes

### 22. Platform Portability Architecture ⚪
**Status**: Pending  
**Priority**: High  
**Requirement File**: `requirements/pending/platform-portability.md`  
**Depends on**: Should be implemented with #4  
**Blocks**: #26 (Future VSCode Extension)

**Requirements**:
- [ ] PlatformAdapter interface defined
- [ ] WebAdapter implementation (full)
- [ ] VSCodeAdapter stub (for future)
- [ ] No browser APIs in core code
- [ ] All file operations through adapter
- [ ] All storage operations through adapter
- [ ] All UI operations through adapter
- [ ] Porting guide documented

**Estimated Effort**: 2-3 hours (as part of #4)  
**Why Important**: Enables future VSCode extension port with 90%+ code reuse

### 24. Requirements Management CLI Tool ⚪
**Status**: Pending  
**Priority**: High  
**Requirement File**: `requirements/pending/requirements-cli-tool.md`  
**Depends on**: None  
**Blocks**: None (but helps all development)

**Requirements**:
- [ ] CLI executable (`requirements` command)
- [ ] Auto-generate requirement IDs
- [ ] Interactive prompts with dropdowns
- [ ] Dependency selection with "ID: Title"
- [ ] Category/priority dropdowns
- [ ] Validate requirement files
- [ ] Dependency analysis
- [ ] Critical path detection
- [ ] LLM tool schema output
- [ ] JSON mode for LLM agents

**Estimated Effort**: 8-12 hours  
**Why Important**: Systematizes requirement creation, reduces human error, enables LLM agent integration

### 27. Debug PDF Preview ⚪
**Status**: Pending
**Priority**: High
**Requirement File**: `requirements/pending/005-debug-pdf-preview.md`
**Depends on**: #4
**Blocks**: None

**Requirements**:
- [ ] Investigate `components/pdf-preview.js`
- [ ] Check `datauristring` generation
- [ ] Verify iframe interaction
- [ ] Check browser console for errors

**Estimated Effort**: 2-4 hours
**Why Important**: The PDF preview is a core feature of the application and is currently broken.

---

## User Experience Enhancements

### 6. Collapsible JSON Viewer ⚪
**Status**: Pending  
**Priority**: Medium  
**Requirement File**: `requirements/pending/collapsible-json-viewer.md`  
**Depends on**: #4  
**Blocks**: None

**Requirements**:
- [ ] JSON panel collapsed by default
- [ ] Toggle button in panel header
- [ ] Smooth collapse/expand animation (300ms)
- [ ] State persists during session
- [ ] Syntax highlighting for JSON

**Estimated Effort**: 2-3 hours

### 23. LaTeX Syntax Highlighting ⚪
**Status**: Pending  
**Priority**: Medium  
**Requirement File**: `requirements/pending/latex-syntax-highlighting.md`  
**Depends on**: Monaco Editor loaded  
**Blocks**: None

**Requirements**:
- [ ] LaTeX commands highlighted
- [ ] Comments shown in muted color
- [ ] Math mode visually distinct
- [ ] Braces and brackets highlighted
- [ ] Environment names highlighted
- [ ] Monaco Monarch language definition
- [ ] Custom color theme
- [ ] Auto-closing pairs for {}, [], $

**Estimated Effort**: 3-4 hours  
**Why Important**: Quick win that significantly improves UX and makes editor feel professional

### 10. Editor Enhancements ⚪
**Status**: Pending  
**Priority**: Low

**Requirements**:
- [ ] Keyboard shortcuts (Ctrl+S to download, etc.)
- [ ] Auto-save to session state
- [ ] Find and replace
- [ ] Line numbers toggle
- [ ] Minimap toggle
- [ ] Theme switching (light/dark)

---

## Advanced Features

### 7. Advanced LaTeX Support ⚪
**Status**: Pending  
**Priority**: Medium  
**Depends on**: #4 (should be feature modules)

**Requirements**:
- [ ] Tables (`\begin{tabular}`)
- [ ] Figures (`\begin{figure}`)
- [ ] Images (`\includegraphics`)
- [ ] References (`\ref{}`, `\label{}`)
- [ ] Citations (`\cite{}`)
- [ ] Custom commands (`\newcommand`)
- [ ] Multi-column layout
- [ ] Footnotes

### 8. Better Math Rendering ⚪
**Status**: Pending  
**Priority**: Medium  
**Requirement File**: `requirements/pending/better-math-support.md`  
**Depends on**: #4

**Requirements**:
- [ ] Proper fraction rendering
- [ ] Greek letters
- [ ] Subscripts and superscripts
- [ ] Square roots and radicals
- [ ] Matrices
- [ ] Custom math renderer (no external libs)

**Estimated Effort**: 22-30 hours (phased implementation)  
**Notes**: Must maintain no-build-tools constraint

### 21. Bibliography and Citation Support ⚪
**Status**: Pending  
**Priority**: Medium-High  
**Requirement File**: `requirements/pending/bibliography-support.md`  
**Depends on**: #4  
**Blocks**: None

**Requirements**:
- [ ] BibTeX/BibLaTeX file parsing
- [ ] `\cite{}`, `\citep{}`, `\citet{}` commands
- [ ] Multiple citation styles (APA, MLA, Chicago, IEEE)
- [ ] Automatic bibliography generation
- [ ] Citation formatting
- [ ] `.bib` file upload
- [ ] Zotero integration (VSCode version only)

**Estimated Effort**: 10-14 hours  
**Why Important**: Critical for academic users, killer feature for VSCode version with Zotero

### 9. PDF Styling Options ⚪
**Status**: Pending  
**Priority**: Low  
**Requirement File**: `requirements/pending/custom-styling.md`  
**Depends on**: #4

**Requirements**:
- [ ] Font selection (serif, sans-serif, mono)
- [ ] Font size adjustment
- [ ] Margin control
- [ ] Line spacing options
- [ ] Color schemes
- [ ] Page size (A4, Letter, etc.)
- [ ] Style presets (Academic, Modern, Minimal)

**Estimated Effort**: 6-8 hours

### 11. JSON Export/Import ⚪
**Status**: Pending  
**Priority**: Low

**Requirements**:
- [ ] Export JSON to file
- [ ] Import JSON from file
- [ ] Direct JSON editing mode
- [ ] JSON validation
- [ ] Convert JSON back to LaTeX

---

## Quality & Testing

### 12. Error Handling ⚪
**Status**: Pending  
**Priority**: Medium  
**Depends on**: #4

**Requirements**:
- [ ] Status bar component for messages
- [ ] Parse error highlighting
- [ ] Friendly error messages
- [ ] Warning for unsupported commands
- [ ] Validation feedback

### 13. Browser Compatibility Testing ⚪
**Status**: Pending  
**Priority**: High

**Requirements**:
- [ ] Test in Chrome 90+
- [ ] Test in Firefox 88+
- [ ] Test in Safari 14+
- [ ] Test in Edge 90+
- [ ] Document browser requirements

### 14. Accessibility ⚪
**Status**: Pending  
**Priority**: Medium

**Requirements**:
- [ ] Keyboard navigation
- [ ] ARIA labels
- [ ] Screen reader support
- [ ] High contrast mode
- [ ] Focus indicators

### 15. Performance Optimization ⚪
**Status**: Pending  
**Priority**: Low

**Requirements**:
- [ ] Lazy load Monaco editor
- [ ] Debounce parse operations
- [ ] Virtual scrolling for large documents
- [ ] Web Worker for parsing
- [ ] Service Worker for offline support

---

## Documentation

### 16. User Documentation ⚪
**Status**: Pending  
**Priority**: Medium

**Requirements**:
- [ ] User guide
- [ ] LaTeX command reference
- [ ] Example documents
- [ ] FAQ section
- [ ] Video tutorial

### 17. Developer Documentation ⚪
**Status**: Pending  
**Priority**: High

**Requirements**:
- [x] README.md
- [x] AGENTS.md
- [ ] Architecture diagrams
- [ ] API documentation
- [ ] Contributing guide
- [ ] Component documentation

---

## Future Considerations

### 18. Collaborative Features 🔴
**Status**: Blocked (requires backend)

**Requirements**:
- Real-time collaboration
- Document sharing
- Version history
- Comments and annotations

**Notes**: Out of scope for current no-backend constraint

### 19. Template Library ⚪
**Status**: Pending  
**Priority**: Low

**Requirements**:
- [ ] Pre-built document templates
- [ ] Academic paper template
- [ ] Resume template
- [ ] Letter template
- [ ] Presentation template
- [ ] Custom template creation

### 20. Advanced PDF Features ⚪
**Status**: Pending  
**Priority**: Low

**Requirements**:
- [ ] Table of contents generation
- [ ] Hyperlinks
- [ ] Bookmarks
- [ ] Metadata embedding
- [ ] Multi-page rendering with headers/footers

### 26. VSCode Extension Port 🔴
**Status**: Blocked  
**Priority**: Medium (Future)  
**Depends on**: #4, #22

**Requirements**:
- Port core engine to VSCode extension
- Implement VSCodeAdapter fully
- Add Zotero integration
- Multi-file LaTeX project support
- Workspace file access
- Command palette commands

**Notes**: Enabled by #22 (Platform Portability). Web version must be working first.

---

## Priority Queue

### 🔥 Critical (Do First)
1. **#4** - Modular Architecture (blocks 11+ requirements)
2. **#22** - Platform Portability (implement with #4)

### ⚠️ High Priority (Do Soon)
3. **#27** - Debug PDF Preview
4. **#5** - GitHub Pages Deployment
5. **#24** - Requirements CLI Tool
6. **#13** - Browser Compatibility Testing

### ➡️ Medium Priority (Quick Wins)
7. **#23** - LaTeX Syntax Highlighting (3-4 hours, big UX win)
8. **#6** - Collapsible JSON Viewer
9. **#12** - Error Handling
10. **#21** - Bibliography Support

### ⬇️ Medium-Low Priority
11. **#8** - Better Math Rendering (large effort)
12. **#7** - Advanced LaTeX Support
13. **#16** - User Documentation

### ⬇️ Low Priority
14. **#9** - PDF Styling Options
15. **#10** - Editor Enhancements
16. **#11** - JSON Export/Import
17. **#19** - Template Library

---

## Statistics

- **Total Requirements**: 27
- **Completed**: 3 (11%)
- **In Progress**: 1 (4%)
- **Pending**: 21 (78%)
- **Blocked**: 2 (7%)

**Estimated Total Effort**: ~92-124 hours

---

## Notes

- All features must work without backend
- No third-party libraries except Monaco and jsPDF
- Maintain fast load times (<3s on slow connection)
- Keep total bundle size under 5MB
- Support modern browsers only (ES6+)
- Design for VSCode portability from the start (#22)

---

## Changelog

### 2026-01-05
- Added #27: Debug PDF Preview (High Priority)
- Updated #4: Modular Architecture to "In Progress" and unchecked sub-tasks.
- Corrected requirement numbering to be stable.

### 2026-01-04
- Created initial requirements document
- Documented v0.1 completed features
- Outlined v0.2 refactoring plan
- Added #4: Modular Architecture (CRITICAL)
- Added #5: GitHub Pages deployment
- Added #21: Bibliography support (NEW)
- Added #22: Platform portability architecture (NEW)
- Added #23: LaTeX syntax highlighting (NEW)
- Added #24: Requirements CLI tool (NEW)
- Added #26: VSCode extension port (Future)
- Reorganized priority queue with critical path focus
