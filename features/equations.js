import { FeatureBase } from './feature-base.js';
import { extractEnvironment } from '../utils/parser-utils.js';

export class EquationsFeature extends FeatureBase {
  constructor() {
    super();
    this.name = 'equations';
    this.priority = 40;
  }

  matches(line, context) {
    return context.inDocument && line.match(/^\\begin\{equation\}/);
  }

  parse(line, context) {
    const { content, endIndex } = extractEnvironment(context.lines, context.lineIndex, 'equation');
    context.lineIndex = endIndex;

    return {
      type: 'equation',
      numbered: true,
      content: content.trim()
    };
  }

  canRender(elementType) {
    return elementType === 'equation';
  }

  render(element, pdfGenerator) {
    pdfGenerator.renderEquation(element);
  }
}