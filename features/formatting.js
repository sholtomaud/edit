import { FeatureBase } from './feature-base.js';

export class FormattingFeature extends FeatureBase {
  constructor() {
    super();
    this.name = 'formatting';
    this.priority = 50;
  }

  matches(line, context) {
    return context.inDocument && /(\\textbf\{|\\textit\{|\$)/.test(line);
  }

  parse(line, context) {
    let formatted = line;
    const formats = [];

    // Handle bold
    const boldRegex = /\\textbf\{([^}]+)\}/g;
    formatted = formatted.replace(boldRegex, (match, content) => {
        formats.push({ type: 'bold', content });
        return content;
    });

    // Handle italic
    const italicRegex = /\\textit\{([^}]+)\}/g;
    formatted = formatted.replace(italicRegex, (match, content) => {
        formats.push({ type: 'italic', content });
        return content;
    });

    // Handle inline math
    const mathRegex = /\$([^$]+)\$/g;
    formatted = formatted.replace(mathRegex, (match, content) => {
        formats.push({ type: 'math', content });
        return content;
    });

    return formats.length > 0 ? { text: formatted, formats } : formatted;
  }
}