import { FeatureBase } from './feature-base.js';
import { featureRegistry } from '../services/feature-registry.js';
import { extractEnvironment } from '../utils/parser-utils.js';

export class ListsFeature extends FeatureBase {
  constructor() {
    super();
    this.name = 'lists';
    this.priority = 30;
  }

  matches(line, context) {
    return context.inDocument && line.match(/^\\begin\{(itemize|enumerate)\}/);
  }

  parse(line, context) {
    const envMatch = line.match(/\\begin\{(itemize|enumerate)\}/);
    if (!envMatch) return null;

    const envType = envMatch[1];
    const { content, endIndex } = extractEnvironment(context.lines, context.lineIndex, envType);

    context.lineIndex = endIndex;

    const items = [];
    const itemLines = content.split('\n');
    for (const itemLine of itemLines) {
        if (itemLine.trim().startsWith('\\item')) {
            const itemText = itemLine.replace('\\item', '').trim();
            const formattingFeature = featureRegistry.findFeature(itemText, context);
            if (formattingFeature) {
                items.push(formattingFeature.parse(itemText, context));
            } else {
                items.push(itemText);
            }
        }
    }

    return {
      type: 'list',
      ordered: envType === 'enumerate',
      items: items
    };
  }

  canRender(elementType) {
    return elementType === 'list';
  }

  render(element, pdfGenerator) {
    pdfGenerator.renderList(element);
  }
}