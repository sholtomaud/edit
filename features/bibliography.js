
import { BibParser } from '../services/bib-parser.js';
import { CitationFormatter } from '../services/citation-formatter.js';

class BibliographyFeature {
  constructor() {
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

  matches(line) {
    return line.match(/\\cite(p|t|author|year)?\{/) ||
           line.match(/\\bibliography\{/) ||
           line.match(/\\nobibliography\{/);
  }

  parse(line) {
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

    const bibMatch = line.match(/\\bibliography\{([^}]+)\}/);
    if (bibMatch) {
      return {
        type: 'bibliography-section',
        file: bibMatch[1]
      };
    }

    return null;
  }

  render(element, pdfGenerator) {
    if (element.type === 'citation') {
      this.renderCitation(element, pdfGenerator);
    } else if (element.type === 'bibliography-section') {
      this.renderBibliography(element, pdfGenerator);
    }
  }

  renderCitation(element, pdfGenerator) {
    const citations = element.keys.map(key => {
      const entry = this.bibDatabase[key];
      if (!entry) {
        console.warn(`Missing bibliography entry: ${key}`);
        return `[${key}?]`;
      }
      return this.formatter.formatCitation(entry, element.command, element.options);
    });

    const citationText = citations.join('; ');
    // This is a simplified rendering. A real implementation would need to handle
    // text wrapping and positioning within the current line.
    pdfGenerator.doc.text(citationText, pdfGenerator.margin, pdfGenerator.y);
  }

  renderBibliography(element, pdfGenerator) {
    pdfGenerator.y += 10;
    pdfGenerator.doc.setFontSize(18);
    pdfGenerator.doc.setFont(undefined, 'bold');
    pdfGenerator.doc.text('References', pdfGenerator.margin, pdfGenerator.y);
    pdfGenerator.doc.setFont(undefined, 'normal');
    pdfGenerator.y += 10;

    const uniqueCitations = [...new Set(this.citations)];

    const sortedEntries = uniqueCitations
      .map(key => this.bibDatabase[key])
      .filter(entry => entry)
      .sort((a, b) =>
        (a.fields.author || '').localeCompare(b.fields.author || '')
      );

    pdfGenerator.doc.setFontSize(12);
    sortedEntries.forEach(entry => {
      const bibText = this.formatter.formatBibliography(entry);
      const lines = pdfGenerator.doc.splitTextToSize(
        bibText,
        pdfGenerator.pageWidth - 2 * pdfGenerator.margin
      );

      lines.forEach(line => {
        pdfGenerator.checkPageBreak(7);
        pdfGenerator.doc.text(line, pdfGenerator.margin, pdfGenerator.y);
        pdfGenerator.y += 7;
      });

      pdfGenerator.y += 3;
    });
  }

  canRender(elementType) {
    return elementType === 'citation' || elementType === 'bibliography-section';
  }
}

export const bibliographyFeature = new BibliographyFeature();
