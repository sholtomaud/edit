import { FeatureBase } from './feature-base.js';

export class SectionsFeature extends FeatureBase {
  constructor() {
    super();
    this.name = 'sections';
    this.priority = 10;
  }

  matches(line, context) {
    return context.inDocument && line.match(/^\\(sub)*section\{/);
  }

  parse(line, context) {
    const match = line.match(/^\\(sub)*section\{([^}]+)\}/);
    if (!match) return null;

    const level = (match[1] || '').length / 3 + 1;
    return {
      type: 'section',
      level: level,
      title: match[2]
    };
  }

  canRender(elementType) {
    return elementType === 'section';
  }

  render(element, pdfGenerator) {
    pdfGenerator.renderSection(element);
  }
}