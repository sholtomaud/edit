
export class CitationFormatter {
  constructor(style = 'apa') {
    this.style = style;
  }

  formatCitation(entry, type = 'cite', options = {}) {
    switch (this.style) {
      case 'apa':
        return this.formatAPA(entry, type, options);
      default:
        return this.formatAPA(entry, type, options);
    }
  }

  formatAPA(entry, type, options) {
    const author = this.extractLastName(entry.fields.author || 'Unknown Author');
    const year = entry.fields.year || 'n.d.';
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
