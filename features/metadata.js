import { FeatureBase } from './feature-base.js';

export class MetadataFeature extends FeatureBase {
  constructor() {
    super();
    this.name = 'metadata';
    this.priority = 1;
  }

  matches(line, context) {
    return !context.inDocument && line.match(/^\\(title|author|date)\{/);
  }

  parse(line, context) {
    const match = line.match(/^\\(title|author|date)\{([^}]+)\}/);
    if (match) {
      return {
        type: 'metadata',
        key: match[1],
        value: match[2]
      };
    }
    return null;
  }
}

export class MakeTitleFeature extends FeatureBase {
    constructor() {
        super();
        this.name = 'maketitle';
        this.priority = 20;
    }

    matches(line, context) {
        return context.inDocument && line.trim() === '\\maketitle';
    }

    parse(line, context) {
        return {
            type: 'maketitle'
        };
    }

    canRender(elementType) {
        return elementType === 'maketitle';
    }

    render(element, pdfGenerator) {
        // Handled by the PDF generator's title page logic
    }
}
