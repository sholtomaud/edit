# Feature: Bibliography and Citation Support

**Requirement ID**: #21  
**Priority**: Medium-High  
**Status**: ⚪ Pending  
**Created**: 2026-01-04

## Objective

Implement comprehensive bibliography management with BibLaTeX-style parsing and rendering. Support inline citations (`\cite{}`, `\citep{}`, `\citet{}`), bibliography database parsing (`.bib` files), automatic reference list generation, and multiple citation styles.

## Requirements

### Citation Commands
1. `\cite{key}` - Basic citation (Author, Year)
2. `\citep{key}` - Parenthetical citation (Author, Year)
3. `\citet{key}` - Textual citation Author (Year)
4. `\citep[pages]{key}` - Citation with page numbers
5. `\cite{key1,key2,key3}` - Multiple citations
6. `\citeauthor{key}` - Author name only
7. `\citeyear{key}` - Year only
8. `\nocite{*}` - Include all bibliography entries

### Bibliography Management
9. Parse BibTeX/BibLaTeX `.bib` file format
10. Support common entry types (article, book, inproceedings, etc.)
11. Extract required fields (author, title, year, journal, etc.)
12. Handle special characters and LaTeX in `.bib` fields
13. Generate formatted bibliography at document end

### Citation Styles
14. APA style (default)
15. MLA style
16. Chicago style
17. IEEE style
18. Harvard style
19. Vancouver style
20. Custom style configuration

### Features
21. Automatic sorting (alphabetical or by appearance)
22. Hyperlinks from citations to bibliography
23. Back-references from bibliography to citations
24. Duplicate citation detection
25. Missing reference warnings
26. Bibliography section formatting

## Affected Files

**New Files**:
- `features/bibliography.js` (main feature module)
- `services/bib-parser.js` (BibTeX parser)
- `services/citation-formatter.js` (citation style formatter)
- `config/citation-styles.js` (style definitions)
- `utils/bib-utils.js` (helper functions)

**Modified Files**:
- `services/feature-registry.js` (register bibliography feature)
- `services/latex-parser.js` (handle \bibliography{} command)
- `services/pdf-generator.js` (render bibliography section)
- `config/latex-examples.js` (add example with citations)

## Acceptance Criteria

- [ ] `.bib` file can be uploaded or pasted
- [ ] BibTeX parser correctly extracts entries
- [ ] All common entry types supported (article, book, etc.)
- [ ] `\cite{}` renders as "(Author, Year)"
- [ ] `\citep{}` renders as "(Author, Year)"
- [ ] `\citet{}` renders as "Author (Year)"
- [ ] Multiple citations render correctly
- [ ] Page numbers display in citations
- [ ] Bibliography generates at end of document
- [ ] Bibliography entries formatted per style
- [ ] Bibliography sorted correctly
- [ ] Citations link to bibliography (in PDF)
- [ ] Missing references show warning
- [ ] At least 3 citation styles implemented
- [ ] User can select citation style
- [ ] Special characters handled in `.bib` fields

## Implementation Notes

### BibTeX Format

```bibtex
@article{einstein1905,
  author = {Albert Einstein},
  title = {On the Electrodynamics of Moving Bodies},
  journal = {Annalen der Physik},
  year = {1905},
  volume = {322},
  number = {10},
  pages = {891--921}
}

@book{knuth1984,
  author = {Donald E. Knuth},
  title = {The TeXbook},
  publisher = {Addison-Wesley},
  year = {1984}
}
```

### BibTeX Parser

```javascript
// services/bib-parser.js
export class BibParser {
  parse(bibContent) {
    const entries = {};
    const entryRegex = /@(\w+)\{([^,]+),\s*([^@]*)\}/gs;
    
    let match;
    while ((match = entryRegex.exec(bibContent)) !== null) {
      const [, type, key, fields] = match;
      entries[key] = this.parseEntry(type, key, fields);
    }
    
    return entries;
  }

  parseEntry(type, key, fieldsStr) {
    const entry = { type, key, fields: {} };
    const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}|(\w+)\s*=\s*"([^"]*)"/g;
    
    let match;
    while ((match = fieldRegex.exec(fieldsStr)) !== null) {
      const fieldName = match[1] || match[3];
      const fieldValue = match[2] || match[4];
      entry.fields[fieldName] = this.cleanField(fieldValue);
    }
    
    return entry;
  }

  cleanField(value) {
    // Remove LaTeX commands, handle special chars
    return value
      .replace(/\\textit\{([^}]+)\}/g, '$1')
      .replace(/\\textbf\{([^}]+)\}/g, '$1')
      .replace(/~/g, ' ')
      .trim();
  }
}
```

### Citation Formatter

```javascript
// services/citation-formatter.js
export class CitationFormatter {
  constructor(style = 'apa') {
    this.style = style;
  }

  formatCitation(entry, type = 'cite', options = {}) {
    switch (this.style) {
      case 'apa':
        return this.formatAPA(entry, type, options);
      case 'mla':
        return this.formatMLA(entry, type, options);
      case 'chicago':
        return this.formatChicago(entry, type, options);
      default:
        return this.formatAPA(entry, type, options);
    }
  }

  formatAPA(entry, type, options) {
    const author = this.extractLastName(entry.fields.author);
    const year = entry.fields.year;
    const pages = options.pages;

    switch (type) {
      case 'cite':
      case 'citep':
        return pages 
          ? `(${author}, ${year}, p. ${pages})`
          : `(${author}, ${year})`;
      case 'citet':
        return pages
          ? `${author} (${year}, p. ${pages})`
          : `${author} (${year})`;
      case 'citeauthor':
        return author;
      case 'citeyear':
        return year;
      default:
        return `(${author}, ${year})`;
    }
  }

  extractLastName(authorField) {
    // Handle "Last, First" or "First Last"
    if (authorField.includes(',')) {
      return authorField.split(',')[0].trim();
    }
    const parts = authorField.split(' ');
    return parts[parts.length - 1];
  }

  formatBibliography(entry) {
    switch (this.style) {
      case 'apa':
        return this.formatBibAPA(entry);
      case 'mla':
        return this.formatBibMLA(entry);
      default:
        return this.formatBibAPA(entry);
    }
  }

  formatBibAPA(entry) {
    const { author, year, title } = entry.fields;
    
    if (entry.type === 'article') {
      const { journal, volume, number, pages } = entry.fields;
      return `${author} (${year}). ${title}. ${journal}, ${volume}(${number}), ${pages}.`;
    } else if (entry.type === 'book') {
      const { publisher } = entry.fields;
      return `${author} (${year}). ${title}. ${publisher}.`;
    }
    
    return `${author} (${year}). ${title}.`;
  }
}
```

### Bibliography Feature Module

```javascript
// features/bibliography.js
import { FeatureBase } from './feature-base.js';
import { BibParser } from '../services/bib-parser.js';
import { CitationFormatter } from '../services/citation-formatter.js';

export class BibliographyFeature extends FeatureBase {
  constructor() {
    super();
    this.name = 'bibliography';
    this.priority = 40;
    this.bibParser = new BibParser();
    this.formatter = new CitationFormatter('apa');
    this.bibDatabase = {};
    this.citations = [];
  }

  loadBibliography(bibContent) {
    this.bibDatabase = this.bibParser.parse(bibContent);
  }

  matches(line, context) {
    return line.match(/\\cite(p|t|author|year)?\{/) || 
           line.match(/\\bibliography\{/) ||
           line.match(/\\nocite\{/);
  }

  parse(line, context) {
    // Parse \cite commands
    const citeMatch = line.match(/\\(cite[pt]?|citeauthor|citeyear)(\[([^\]]+)\])?\{([^}]+)\}/);
    if (citeMatch) {
      const [, command, , options, keys] = citeMatch;
      const keyList = keys.split(',').map(k => k.trim());
      
      this.citations.push(...keyList);
      
      return {
        type: 'citation',
        command: command,
        keys: keyList,
        options: options ? { pages: options } : {},
        text: line
      };
    }

    // Parse \bibliography command
    const bibMatch = line.match(/\\bibliography\{([^}]+)\}/);
    if (bibMatch) {
      return {
        type: 'bibliography-section',
        file: bibMatch[1]
      };
    }

    return null;
  }

  render(element, generator, context) {
    if (element.type === 'citation') {
      this.renderCitation(element, generator, context);
    } else if (element.type === 'bibliography-section') {
      this.renderBibliography(element, generator, context);
    }
  }

  renderCitation(element, generator, context) {
    const citations = element.keys.map(key => {
      const entry = this.bibDatabase[key];
      if (!entry) {
        console.warn(`Missing bibliography entry: ${key}`);
        return `[${key}?]`;
      }
      return this.formatter.formatCitation(entry, element.command, element.options);
    });

    const citationText = citations.join('; ');
    generator.doc.text(citationText, generator.margin, generator.y);
  }

  renderBibliography(element, generator, context) {
    generator.y += 10;
    generator.doc.setFontSize(18);
    generator.doc.setFont(undefined, 'bold');
    generator.doc.text('References', generator.margin, generator.y);
    generator.doc.setFont(undefined, 'normal');
    generator.y += 10;

    // Get unique citations
    const uniqueCitations = [...new Set(this.citations)];
    
    // Sort alphabetically by author
    const sortedEntries = uniqueCitations
      .map(key => this.bibDatabase[key])
      .filter(entry => entry)
      .sort((a, b) => 
        a.fields.author.localeCompare(b.fields.author)
      );

    // Render each bibliography entry
    generator.doc.setFontSize(12);
    sortedEntries.forEach(entry => {
      const bibText = this.formatter.formatBibliography(entry);
      const lines = generator.doc.splitTextToSize(
        bibText, 
        generator.pageWidth - 2 * generator.margin
      );
      
      lines.forEach(line => {
        generator.checkPageBreak(7);
        generator.doc.text(line, generator.margin, generator.y);
        generator.y += 7;
      });
      
      generator.y += 3; // Space between entries
    });
  }
}
```

### Usage in LaTeX

```latex
\documentclass{article}

\begin{document}

\section{Introduction}

Quantum computing was first proposed by \citet{feynman1982}.
Recent advances \citep{nielsen2000,preskill2018} have shown promise.

According to \citeauthor{shor1994}, factoring can be done efficiently.
This was demonstrated in \citeyear{shor1994}.

\section{Related Work}

Multiple studies \citep[pp. 23-45]{knuth1984,lamport1986} 
have explored this topic.

\bibliography{references}

\end{document}
```

### BibTeX File Upload

Add file upload to UI:

```javascript
// In toolbar or settings
<input type="file" accept=".bib" id="bib-upload">

document.getElementById('bib-upload').addEventListener('change', (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  
  reader.onload = (event) => {
    const bibContent = event.target.result;
    bibliographyFeature.loadBibliography(bibContent);
    eventBus.emit('bibliography:loaded', { entries: bibliographyFeature.bibDatabase });
  };
  
  reader.readAsText(file);
});
```

## Dependencies

**Prerequisite Requirements**: 
- #4 (Modular Architecture) - MUST be completed first for feature modules
- #1 (Basic LaTeX Parsing) - Should be working

**Blocks**: None

## Testing Checklist

### BibTeX Parsing
- [ ] Article entries parse correctly
- [ ] Book entries parse correctly
- [ ] All common entry types supported
- [ ] Fields extracted correctly
- [ ] Special characters handled
- [ ] LaTeX commands in fields cleaned
- [ ] Multiple authors handled

### Citation Rendering
- [ ] `\cite{}` formats correctly
- [ ] `\citep{}` formats correctly
- [ ] `\citet{}` formats correctly
- [ ] `\citeauthor{}` shows author only
- [ ] `\citeyear{}` shows year only
- [ ] Page numbers display correctly
- [ ] Multiple citations separated properly

### Bibliography Generation
- [ ] Bibliography section appears
- [ ] Entries formatted correctly
- [ ] Entries sorted correctly
- [ ] All cited works included
- [ ] No uncited works included (unless \nocite{*})
- [ ] Proper spacing between entries

### Citation Styles
- [ ] APA style correct
- [ ] MLA style correct (if implemented)
- [ ] Chicago style correct (if implemented)
- [ ] Style switching works
- [ ] User can select style

### Error Handling
- [ ] Missing reference shows warning
- [ ] Malformed .bib shows error
- [ ] Empty .bib handled gracefully
- [ ] Invalid citation command ignored

### Edge Cases
- [ ] Very long author lists
- [ ] Missing required fields
- [ ] Duplicate citation keys
- [ ] Special characters in titles
- [ ] URLs and DOIs

## User Stories

**As an academic**, I want to cite sources properly so that my paper meets publication standards.

**As a researcher**, I want to manage my bibliography in a .bib file so that I can reuse it across multiple papers.

**As a student**, I want automatic citation formatting so that I don't have to manually format references.

**As an author**, I want to switch citation styles easily so that I can submit to different journals.

## Example Documents

### Simple Citation Example

```latex
\documentclass{article}
\title{Sample Paper}
\author{John Doe}

\begin{document}
\maketitle

\section{Introduction}
As noted by \citet{smith2020}, this is important.

\bibliography{refs}
\end{document}
```

### Multiple Citations Example

```latex
Several studies \citep{jones2019,brown2021,davis2022} 
have explored this phenomenon.
```

### Citations with Pages

```latex
The theory \citep[p. 42]{einstein1905} was revolutionary.
```

## Success Metrics

- 95% of common citation commands supported
- All major citation styles available
- Bibliography generation time < 100ms
- Correct formatting for 99% of valid .bib entries
- No crashes on malformed input

## Estimated Effort

**Time**: 10-14 hours  
**Complexity**: High  
**Risk**: Medium

### Breakdown
- BibTeX parser: 3-4 hours
- Citation formatter: 3-4 hours
- Bibliography feature module: 2-3 hours
- Citation styles: 2-3 hours
- Testing and polish: 2-3 hours

## Related Requirements

- **#4**: Modular Architecture (critical dependency)
- **#7**: Advanced LaTeX Support (complementary)
- **#12**: Error Handling (for missing references)

## Future Enhancements

- [ ] BibLaTeX extended features
- [ ] Author-year vs numeric styles
- [ ] Footnote citations
- [ ] Cross-references
- [ ] URL/DOI hyperlinks in bibliography
- [ ] Export bibliography to other formats
- [ ] Visual bibliography editor
- [ ] Citation style editor
- [ ] Integration with Zotero/Mendeley

## Completion Checklist

When marking this requirement as complete:

- [ ] All acceptance criteria met
- [ ] All test cases pass
- [ ] At least 3 citation styles implemented
- [ ] BibTeX parser handles common formats
- [ ] Example .bib file provided
- [ ] Documentation updated
- [ ] User guide for citations written
- [ ] Requirement moved to `requirements/completed/`
- [ ] REQUIREMENTS.md status updated to 🟢
- [ ] Completion date added to this file

## Notes

- Start with APA style as default (most common in academia)
- BibTeX format is complex; focus on common use cases first
- Consider using existing BibTeX grammar if available
- Citation style switching should be seamless
- Bibliography should always appear at end of document
- This feature greatly increases the app's utility for academic users
