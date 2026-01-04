
import { featureRegistry } from './feature-registry.js';

export class LaTeXParser {
    parse(latex) {
        const doc = {
            type: 'document',
            metadata: {},
            content: []
        };

        const lines = latex.split('\n');
        let inDocument = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();

            if (line.startsWith('\\begin{document}')) {
                inDocument = true;
                continue;
            }
            if (line.startsWith('\\end{document}')) {
                inDocument = false;
                continue;
            }

            const context = { lineIndex: i, lines, inDocument };
            const feature = featureRegistry.findFeature(line, context);

            if (feature) {
                const element = featureRegistry.parseWith(feature, line, context);
                if (element) {
                    if (element.type === 'metadata') {
                        doc.metadata[element.key] = element.value;
                    } else if (element.type === 'paragraph') {
                        doc.content.push(element);
                    } else {
                        doc.content.push(element);
                    }
                }
            } else if (inDocument && line.length > 0 && !line.startsWith('\\')) {
                 doc.content.push({ type: 'paragraph', content: [{ type: 'text', content: line }] });
            }
        }

        return doc;
    }
}

export const latexParser = new LaTeXParser();
