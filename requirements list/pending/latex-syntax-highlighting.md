# Feature: LaTeX Syntax Highlighting in Monaco Editor

**Requirement ID**: #23  
**Priority**: Medium  
**Status**: ⚪ Pending  
**Created**: 2026-01-04

## Objective

Add proper LaTeX syntax highlighting to the Monaco editor to improve code readability and user experience. Highlight LaTeX commands, environments, math mode, comments, and special characters with appropriate colors.

## Requirements

### Basic Highlighting
1. LaTeX commands (`\section`, `\textbf`, etc.) in distinct color
2. Environment names (`\begin{document}`, `\end{itemize}`)
3. Comments (`%` to end of line)
4. Curly braces `{}` for grouping
5. Square brackets `[]` for optional arguments
6. Special characters (`$`, `&`, `#`, `_`, `^`, `~`, `\`)

### Math Mode Highlighting
7. Inline math (`$...$`) with distinct background or color
8. Display math (`$$...$$`)
9. Equation environment highlighting
10. Math commands in different color than text commands

### Advanced Highlighting
11. Document structure commands (section, chapter, etc.)
12. Formatting commands (textbf, textit, etc.)
13. List environments
14. Citation commands
15. Bibliography commands
16. Custom command definitions

### Color Scheme
17. Syntax colors match Monaco's dark theme
18. Good contrast and readability
19. Distinguish command types visually
20. Optional: Multiple color schemes

## Affected Files

**New Files**:
- `utils/latex-language.js` (Monaco language definition)
- `config/latex-theme.js` (syntax highlighting theme)

**Modified Files**:
- `utils/monaco-loader.js` (register LaTeX language)
- `components/latex-editor.js` (apply LaTeX language to editor)

## Acceptance Criteria

- [ ] LaTeX commands highlighted in distinct color
- [ ] Comments shown in muted color
- [ ] Math mode visually distinct from text
- [ ] Braces and brackets highlighted
- [ ] Environment names highlighted
- [ ] No syntax errors in console
- [ ] Highlighting updates as user types
- [ ] Performance: no lag with large documents
- [ ] Works with Monaco's dark theme
- [ ] All common LaTeX commands recognized
- [ ] User can distinguish command types at a glance

## Implementation Notes

### Monaco Language Registration

Monaco Editor supports custom language definitions using the Monarch syntax highlighting engine.

```javascript
// utils/latex-language.js

export const latexLanguageDefinition = {
  // Set defaultToken to invalid to see what's not tokenized
  defaultToken: 'invalid',
  
  // Keywords (common LaTeX commands)
  keywords: [
    'documentclass', 'usepackage', 'begin', 'end',
    'section', 'subsection', 'subsubsection', 'chapter',
    'title', 'author', 'date', 'maketitle',
    'textbf', 'textit', 'texttt', 'emph',
    'item', 'label', 'ref', 'cite', 'citep', 'citet',
    'bibliography', 'bibliographystyle',
    'includegraphics', 'caption', 'centering',
    'newcommand', 'renewcommand', 'newenvironment',
    'frac', 'sqrt', 'sum', 'int', 'lim', 'infty',
    'alpha', 'beta', 'gamma', 'delta', 'epsilon',
    'textcolor', 'color', 'pagebreak', 'newpage'
  ],
  
  // Math keywords
  mathKeywords: [
    'frac', 'sqrt', 'sum', 'prod', 'int', 'lim',
    'sin', 'cos', 'tan', 'log', 'ln', 'exp',
    'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'theta',
    'infty', 'partial', 'nabla', 'pm', 'times', 'div'
  ],
  
  // Environments
  environments: [
    'document', 'abstract', 'equation', 'align',
    'itemize', 'enumerate', 'description',
    'figure', 'table', 'tabular',
    'center', 'quote', 'verbatim',
    'theorem', 'proof', 'definition',
    'matrix', 'pmatrix', 'bmatrix', 'cases'
  ],

  // The main tokenizer
  tokenizer: {
    root: [
      // Comments
      [/%.*$/, 'comment'],
      
      // Math mode (inline)
      [/\$/, { token: 'string.math', next: '@mathInline' }],
      
      // Display math
      [/\$\$/, { token: 'string.math', next: '@mathDisplay' }],
      
      // LaTeX commands
      [/\\(begin|end)\{(\w+)\}/, {
        cases: {
          '$2@environments': ['keyword', 'keyword.environment'],
          '@default': ['keyword', 'identifier']
        }
      }],
      
      // Regular commands
      [/\\(@keywords)/, 'keyword'],
      [/\\[a-zA-Z]+/, 'type.identifier'],
      
      // Special characters
      [/[{}]/, 'delimiter.curly'],
      [/[\[\]]/, 'delimiter.square'],
      [/[_^]/, 'operator'],
      
      // Numbers
      [/\d+/, 'number'],
      
      // Whitespace
      [/\s+/, 'white']
    ],

    mathInline: [
      [/[^$\\]+/, 'string.math'],
      [/\\(@mathKeywords)/, 'keyword.math'],
      [/\\[a-zA-Z]+/, 'type.identifier.math'],
      [/\$/, { token: 'string.math', next: '@pop' }],
      [/[_^]/, 'operator.math'],
      [/[{}]/, 'delimiter.curly.math']
    ],

    mathDisplay: [
      [/[^$\\]+/, 'string.math'],
      [/\\(@mathKeywords)/, 'keyword.math'],
      [/\\[a-zA-Z]+/, 'type.identifier.math'],
      [/\$\$/, { token: 'string.math', next: '@pop' }],
      [/[_^]/, 'operator.math'],
      [/[{}]/, 'delimiter.curly.math']
    ]
  }
};

// Language configuration for auto-closing brackets, etc.
export const latexLanguageConfig = {
  comments: {
    lineComment: '%'
  },
  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ],
  autoClosingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '$', close: '$' },
    { open: '$$', close: '$$' }
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '$', close: '$' }
  ]
};
```

### Color Theme Definition

```javascript
// config/latex-theme.js

export const latexTheme = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Comments
    { token: 'comment', foreground: '6A9955', fontStyle: 'italic' },
    
    // Commands
    { token: 'keyword', foreground: 'C586C0' },
    { token: 'type.identifier', foreground: '4EC9B0' },
    
    // Environments
    { token: 'keyword.environment', foreground: 'DCDCAA' },
    
    // Math
    { token: 'string.math', foreground: 'CE9178' },
    { token: 'keyword.math', foreground: 'D4A5A5' },
    { token: 'type.identifier.math', foreground: 'C586C0' },
    { token: 'operator.math', foreground: 'D4D4D4' },
    
    // Delimiters
    { token: 'delimiter.curly', foreground: 'FFD700' },
    { token: 'delimiter.square', foreground: 'DA70D6' },
    { token: 'delimiter.curly.math', foreground: 'FFA500' },
    
    // Numbers
    { token: 'number', foreground: 'B5CEA8' },
    
    // Operators
    { token: 'operator', foreground: 'D4D4D4' }
  ],
  colors: {
    'editor.background': '#1E1E1E',
    'editor.foreground': '#D4D4D4'
  }
};
```

### Registering Language in Monaco

```javascript
// utils/monaco-loader.js

import { latexLanguageDefinition, latexLanguageConfig } from './latex-language.js';
import { latexTheme } from '../config/latex-theme.js';

export function initializeMonaco(monaco) {
  // Register LaTeX language
  monaco.languages.register({ id: 'latex' });
  
  // Set language configuration
  monaco.languages.setLanguageConfiguration('latex', latexLanguageConfig);
  
  // Set tokenizer
  monaco.languages.setMonarchTokensProvider('latex', latexLanguageDefinition);
  
  // Define custom theme
  monaco.editor.defineTheme('latex-dark', latexTheme);
}
```

### Using in Editor Component

```javascript
// components/latex-editor.js

import { initializeMonaco } from '../utils/monaco-loader.js';

export class LatexEditor extends HTMLElement {
  connectedCallback() {
    require(['vs/editor/editor.main'], () => {
      // Initialize language support
      initializeMonaco(monaco);
      
      // Create editor with LaTeX language
      this.editor = monaco.editor.create(this.container, {
        value: this.initialValue,
        language: 'latex',  // Use our custom language
        theme: 'latex-dark', // Use our custom theme
        fontSize: 14,
        minimap: { enabled: false },
        automaticLayout: true
      });
    });
  }
}
```

## Advanced Features (Optional)

### Semantic Highlighting

```javascript
// Highlight matched braces
export function registerBraceMatching(monaco) {
  monaco.languages.registerDocumentHighlightProvider('latex', {
    provideDocumentHighlights: (model, position) => {
      // Find matching brace and highlight both
      return findMatchingBraces(model, position);
    }
  });
}
```

### Command Completion

```javascript
// Auto-complete LaTeX commands
export function registerCompletionProvider(monaco) {
  monaco.languages.registerCompletionItemProvider('latex', {
    provideCompletionItems: (model, position) => {
      const suggestions = [
        {
          label: '\\section',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: '\\section{${1:title}}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: '\\textbf',
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: '\\textbf{${1:text}}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        }
        // ... more completions
      ];
      return { suggestions };
    }
  });
}
```

### Hover Information

```javascript
// Show command documentation on hover
export function registerHoverProvider(monaco) {
  monaco.languages.registerHoverProvider('latex', {
    provideHover: (model, position) => {
      const word = model.getWordAtPosition(position);
      if (word && word.word.startsWith('\\')) {
        return {
          contents: [
            { value: `**${word.word}**` },
            { value: getCommandDocumentation(word.word) }
          ]
        };
      }
    }
  });
}
```

## Dependencies

**Prerequisite Requirements**: 
- Monaco Editor must be loaded
- #4 (Modular Architecture) - Should integrate with component system

**Blocks**: None

## Testing Checklist

### Visual Testing
- [ ] Commands are highlighted correctly
- [ ] Comments are muted and italic
- [ ] Math mode is visually distinct
- [ ] Braces are easy to match
- [ ] Colors have good contrast
- [ ] Theme looks professional

### Functional Testing
- [ ] Highlighting updates in real-time
- [ ] No lag when typing
- [ ] Large documents (1000+ lines) perform well
- [ ] All registered commands highlighted
- [ ] Unrecognized commands still visible
- [ ] Syntax errors don't break highlighting

### Edge Cases
- [ ] Nested braces highlighted correctly
- [ ] Comments don't break following lines
- [ ] Math mode with nested $$ works
- [ ] Escaped characters handled
- [ ] Multi-line environments work

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## Example Output

```latex
% This is a comment - should be green/muted

\documentclass{article}           % command in purple
\usepackage{amsmath}              % command in purple

\title{My Document}               % command with argument
\author{John Doe}

\begin{document}                  % environment in yellow

\section{Introduction}            % structure command

This is regular text.

Math inline: $E = mc^2$           % math in orange
Math display: $$x = \frac{-b \pm \sqrt{b^2}}{2a}$$

\textbf{Bold text}                % formatting command
\textit{Italic text}

\begin{itemize}                   % list environment
\item First item
\item Second item
\end{itemize}

\cite{author2020}                 % citation command

\end{document}
```

## Performance Considerations

- Tokenizer should be efficient (O(n) complexity)
- Don't re-tokenize entire document on each keystroke
- Cache tokenization results where possible
- Limit lookahead in regex patterns
- Test with documents of 5000+ lines

## Success Metrics

- Highlighting works for 99% of common LaTeX
- Zero noticeable lag when typing
- User feedback: "Syntax highlighting is helpful"
- Reduces syntax errors (users spot mistakes visually)

## Estimated Effort

**Time**: 3-4 hours  
**Complexity**: Medium  
**Risk**: Low (Monaco has good documentation)

### Breakdown
- Language definition: 1.5 hours
- Theme configuration: 0.5 hours
- Integration: 0.5 hours
- Testing and refinement: 1 hour
- Optional features: +2 hours

## Related Requirements

- **#1**: LaTeX Parsing (benefits from same command list)
- **#4**: Modular Architecture (integrate with editor component)
- **#10**: Editor Enhancements (part of editor improvements)

## Future Enhancements

- [ ] Multiple color themes (light mode, high contrast)
- [ ] User-customizable colors
- [ ] Import TextMate LaTeX grammar
- [ ] Semantic highlighting (use parser output)
- [ ] Syntax error indicators (red squiggly lines)
- [ ] Auto-complete snippets
- [ ] Hover documentation
- [ ] Go to definition
- [ ] Find all references

## Completion Checklist

When marking this requirement as complete:

- [ ] All acceptance criteria met
- [ ] Language definition complete
- [ ] Theme looks professional
- [ ] No performance issues
- [ ] All tests pass
- [ ] Documentation updated
- [ ] Screenshots in docs
- [ ] Requirement moved to `requirements/completed/`
- [ ] REQUIREMENTS.md status updated to 🟢
- [ ] Completion date added to this file

## Notes

- Monaco's Monarch is powerful but has learning curve
- Reference existing LaTeX TextMate grammars for completeness
- Start with common commands, expand iteratively
- Good syntax highlighting significantly improves UX
- This is a "quick win" that makes the editor feel professional
