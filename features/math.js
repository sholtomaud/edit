
import { FeatureBase } from './feature-base.js';

export class MathFeature extends FeatureBase {
    constructor() {
        super();
        this.name = 'math';
        this.priority = 50;
    }

    matches(line) {
        return line.includes('$');
    }

    parse(line) {
        // Handle display math $$...$$
        const displayMatch = line.match(/^\s*\$\$(.+?)\$\$\s*$/);
        if (displayMatch) {
            return {
                type: 'math',
                display: 'block',
                content: displayMatch[1].trim()
            };
        }

        // Handle inline math $...$
        const inlineRegex = /\$(.+?)\$/g;
        let match;
        const nodes = [];
        let lastIndex = 0;

        while ((match = inlineRegex.exec(line)) !== null) {
            // Add text before the math segment
            if (match.index > lastIndex) {
                nodes.push({ type: 'text', content: line.substring(lastIndex, match.index) });
            }
            // Add the math segment
            nodes.push({
                type: 'math',
                display: 'inline',
                content: match[1].trim()
            });
            lastIndex = match.index + match[0].length;
        }

        // Add any remaining text after the last math segment
        if (lastIndex < line.length) {
            nodes.push({ type: 'text', content: line.substring(lastIndex) });
        }

        // If any nodes were found, wrap them in a paragraph.
        if (nodes.length > 0) {
            return { type: 'paragraph', content: nodes };
        }

        return null;
    }

    canRender(elementType) {
        return elementType === 'math';
    }

    render(element, pdfGenerator) {
        pdfGenerator.renderMath(element);
    }
}
