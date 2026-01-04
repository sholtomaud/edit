AGENTS.md - LLM Development Guide
This document provides instructions for AI assistants (LLMs) working on the LaTeX PDF Editor project. Follow these guidelines when implementing features, fixing bugs, or refactoring code.

Project Overview
Purpose: A browser-based LaTeX editor that parses LaTeX into JSON and renders PDFs client-side.

Tech Stack: Native Web Components, Vanilla JavaScript (ES6+), Monaco Editor, jsPDF

Architecture: Modular component-based system with event-driven communication.

Critical Constraints
MUST Follow
No Third-Party Libraries except:
Monaco Editor (for code editing)
jsPDF (for PDF generation)
Native Web Components Only
No React, Vue, Angular, Svelte, etc.
Use customElements.define()
Use Shadow DOM where appropriate
No Build Tools
No Webpack, Vite, Parcel, Rollup
No transpilation (write ES6+ that runs natively)
No npm packages beyond the two allowed
No Browser Storage APIs
No localStorage or sessionStorage
Store state in-memory using StateManager
State resets on page reload (this is expected behavior)
ES6 Modules Only
Use import/export syntax
Type="module" in script tags
Relative paths for imports
Code Style
Use concise variable names (i, j, el, e)
Prefer functional patterns where appropriate
Keep functions small and focused
Comment complex logic only
Project Structure
latex-pdf-editor/
├── index.html # Entry point - minimal, loads app-shell
├── styles/ # CSS files (no preprocessors)
│ ├── main.css # CSS variables, resets
│ ├── toolbar.css # Toolbar styles
│ ├── editor-pane.css # Editor pane styles
│ └── layout.css # Grid/flex layouts
├── components/ # Web Components (one per file)
│ ├── app-shell.js # Main container
│ ├── latex-editor.js # Monaco wrapper
│ ├── json-viewer.js # JSON display
│ ├── pdf-preview.js # PDF viewer
│ ├── toolbar.js # Action buttons
│ └── status-bar.js # Status messages
├── services/ # Business logic (no UI)
│ ├── latex-parser.js # LaTeX → JSON
│ ├── pdf-generator.js # JSON → PDF
│ ├── state-manager.js # Global state
│ └── event-bus.js # Pub/sub events
├── utils/ # Helper functions
│ ├── monaco-loader.js # Monaco setup
│ └── library-loader.js # External libs
├── config/ # Configuration files
│ ├── latex-examples.js # Sample docs
│ └── parser-config.js # Parser rules
└── requirements/ # Feature specifications
├── REQUIREMENTS.md # Master list (Source of Truth)
├── pending/ # Todo features
├── completed/ # Done features
└── blocked/ # Blocked features



## Development Workflow

### 1. Understanding a Requirement

When given a requirement file (e.g., `requirements/pending/collapsible-json.md`):

1. Read the entire requirement carefully
2. Identify affected files
3. Check acceptance criteria
4. Review implementation notes
5. Understand dependencies

### 2. Implementing a Feature

**Step-by-step process:**

Create/modify the component file
Update related CSS if needed
Update state-manager if new state is needed
Add event handlers if components need to communicate
Test the feature mentally (walk through user flow)
Document any new patterns or decisions


**Component Template:**

```javascript
// components/example-component.js

export class ExampleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Initialize component state
    this._data = null;
  }

  // Called when element is added to DOM
  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  // Called when element is removed from DOM
  disconnectedCallback() {
    this.cleanup();
  }

  // Setter for reactive properties
  set data(value) {
    this._data = value;
    this.render();
  }

  // Render component HTML
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        /* Component-scoped styles */
      </style>
      <div class="component-root">
        <!-- Component HTML -->
      </div>
    `;
  }

  // Attach event listeners
  attachEventListeners() {
    const btn = this.shadowRoot.querySelector('button');
    btn?.addEventListener('click', this.handleClick.bind(this));
  }

  // Event handler
  handleClick(e) {
    // Handle event
  }

  // Cleanup
  cleanup() {
    // Remove event listeners, timers, etc.
  }
}

customElements.define('example-component', ExampleComponent);
Service Template:

javascript

// services/example-service.js

export class ExampleService {
  constructor() {
    this.data = null;
  }

  // Public methods
  processData(input) {
    // Processing logic
    return result;
  }

  // Private methods
  _helperMethod() {
    // Internal logic
  }
}

// Export singleton instance
export const exampleService = new ExampleService();
3. Using State Management
javascript

import { stateManager } from '../services/state-manager.js';

// Get current state
const state = stateManager.getState();

// Update state
stateManager.setState({
  jsonViewerCollapsed: false
});

// Subscribe to changes
const unsubscribe = stateManager.subscribe((newState) => {
  console.log('State changed:', newState);
});

// Later: unsubscribe
unsubscribe();
4. Using Event Bus
javascript

import { eventBus } from '../services/event-bus.js';

// Emit event
eventBus.emit('latex:parsed', { data: parsedJson });

// Listen to event
eventBus.on('latex:parsed', (payload) => {
  console.log('LaTeX parsed:', payload.data);
});
5. Common Event Names
Use these standardized event names:

latex:changed - LaTeX content changed
latex:parsed - LaTeX parsed to JSON
pdf:generated - PDF generated
pdf:downloaded - PDF download triggered
error:occurred - Error happened
ui:notification - Show user notification
Working with Requirements
The requirements/ directory acts as the single source of truth for project status. You must keep these files synchronized with any code changes.

Reading a Requirement File
Example: requirements/pending/collapsible-json.md

Feature: Collapsible JSON Viewer
Objective
Make the JSON output panel collapsible and collapsed by default.

Requirements
Panel should be collapsed on page load
Toggle button in panel header
Smooth animation when expanding/collapsing
Remember state in session
Affected Files
components/json-viewer.js
styles/editor-pane.css
Acceptance Criteria
 Panel is collapsed by default
 Clicking header toggles visibility
 Animation is smooth (300ms)
 State persists during session
Implementation Notes
Use CSS transitions, store state in component property

Creating a New Requirement
When asked to add a feature or proposing a new feature:

Create requirement file: requirements/pending/feature-name.md
Use this template:
Feature: [Feature Name]
Requirement ID: #[Next Number]Priority: Medium | High | LowStatus: ⚪ PendingCreated: YYYY-MM-DD

Objective
[Clear, concise description of what this feature does]

Requirements
[Requirement 1]
[Requirement 2]
Affected Files
path/to/file1.js
path/to/file2.css
Acceptance Criteria
 Criterion 1
 Criterion 2
Implementation Notes
[Technical details, edge cases, design decisions]

Dependencies
[List any requirement IDs that must be completed first]

Testing Checklist
 Feature works in Chrome
 Feature works in Firefox
 Feature works in Safari
Update REQUIREMENTS.md: Add the new requirement to the master list immediately.
Updating Requirements (Synchronization)
Crucial: Code changes often invalidate or update existing requirements. You must actively search for and update related requirement files.

When Modifying Core Files:
Before modifying a file (e.g., services/state-manager.js), scan requirements/pending/ and requirements/blocked/.
Find all requirements listing that file in Affected Files.
Update the Implementation Notes or Acceptance Criteria in those files if the code change impacts their implementation strategy.
When Completing a Dependency:
If you complete Requirement #5, and Requirement #12 lists #5 in Dependencies, update Requirement #12.
Remove #5 from dependencies if it is fully satisfied, or update notes.
Status Hygiene:
Ensure the status in REQUIREMENTS.md always matches the physical location of the file (e.g., if in completed/, status must be 🟢).
Never leave orphaned entries in REQUIREMENTS.md.
Completing a Requirement
After implementation:

Verify: Ensure all acceptance criteria are met.
Update File:
Change status in REQUIREMENTS.md from ⚪ to 🟢.
Add completion date to the requirement file.
Move File: requirements/pending/feature.md → requirements/completed/feature.md.
Clean Up: Remove from pending/ or blocked/ directories.
Common Patterns
Pattern 1: Adding a New LaTeX Command
File: services/latex-parser.js

javascript

parseContent(content) {
  // ... existing code ...
  
  // Add new command check
  else if (line.startsWith('\\newcommand{')) {
    elements.push({
      type: 'custom-command',
      name: this.extractCommandName(line),
      content: this.extractBraces(line)
    });
  }
}
File: services/pdf-generator.js

javascript

renderElement(element) {
  // ... existing switch cases ...
  
  case 'custom-command':
    this.renderCustomCommand(element);
    break;
}

renderCustomCommand(element) {
  // Rendering logic
}
Pattern 2: Adding UI State
File: services/state-manager.js

javascript

constructor() {
  this.state = {
    // ... existing state ...
    newFeatureEnabled: false, // Add new state
  };
}
File: Component using state

javascript

connectedCallback() {
  this.unsubscribe = stateManager.subscribe((state) => {
    if (state.newFeatureEnabled !== this.lastState) {
      this.updateUI(state.newFeatureEnabled);
      this.lastState = state.newFeatureEnabled;
    }
  });
}
Pattern 3: Adding a Toolbar Button
File: components/toolbar.js

javascript

render() {
  this.shadowRoot.innerHTML = `
    <style>/* styles */</style>
    <div class="toolbar">
      <!-- Existing buttons -->
      <button id="new-action-btn">New Action</button>
    </div>
  `;
}

attachEventListeners() {
  // ... existing listeners ...
  this.shadowRoot.querySelector('#new-action-btn')
    .addEventListener('click', () => {
      eventBus.emit('action:new', {});
    });
}
Debugging Guidelines
When encountering errors:

Check console: Always check browser console first
Verify imports: Ensure all imports use correct paths
Check definitions: Verify custom elements are defined
State inspection: Log state to verify data flow
Event flow: Log events to trace communication
Common Issues:

javascript

// ❌ Wrong: absolute path
import { parser } from '/services/latex-parser.js';

// ✅ Correct: relative path
import { parser } from '../services/latex-parser.js';

// ❌ Wrong: missing .js extension
import { parser } from '../services/latex-parser';

// ✅ Correct: include .js
import { parser } from '../services/latex-parser.js';
Response Format
When implementing a requirement, structure your response as:

I'll implement [feature name] as specified in [requirement file].

Changes Made
1. [Component/Service Name]
File: path/to/file.jsChanges:

Added [change 1]
Modified [change 2]
[Code block with full updated file or key changes]

2. [Style Updates]
File: path/to/file.cssChanges:

Added [style 1]
[Code block with CSS changes]

Requirements Updates
Updated status in REQUIREMENTS.md to 🟢
Moved requirements/pending/feature.md to requirements/completed/
Verified dependencies: None remaining.
Testing
To verify:

[Test step 1]
[Test step 2]
[Expected result]
Next Steps
 Move requirement to completed/
 Update REQUIREMENTS.md status
 Test in multiple browsers
Questions to Ask
Before implementing, confirm:

Scope: "Should this feature also handle [edge case]?"
Design: "Should the UI follow [pattern A] or [pattern B]?"
Priority: "Are there any blocking requirements?"
Integration: "Does this affect existing features?"
Final Checklist
Before marking a requirement as complete:

 All acceptance criteria met
 No console errors
 Code follows project patterns
 Events properly emitted/handled
 State updates correctly
 Component cleanup implemented
 Comments added for complex logic
 No third-party libraries added
 No localStorage/sessionStorage used
 Works without build step
 REQUIREMENTS.md updated
 All related requirement files checked and updated
Getting Help
If you're unsure about:

Architecture decisions → Review existing similar components
Naming conventions → Check existing code patterns
Event names → See "Common Event Names" section
State structure → Review state-manager.js
Requirement impacts → Search requirements/ for file references
Remember: When in doubt, ask the human developer for clarification before implementing.
