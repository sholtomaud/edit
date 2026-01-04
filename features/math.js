
import { GREEK_LETTERS, MATH_OPERATORS } from '../utils/math-symbols.js';

class MathFeature {
    constructor() {
        this.name = 'math';
        this.priority = 100;
    }

    matches(line) {
        return line.includes('$');
    }

    parse(line) {
        const inlineMathRegex = /\\$(.+?)\\$/g;
        let match;
        const content = [];

        while ((match = inlineMathRegex.exec(line)) !== null) {
            content.push({
                type: 'math',
                content: this.parseMathContent(match[1]),
                display: 'inline'
            });
        }

        if (content.length === 0) {
            const displayMathRegex = /\\$\\$(.+?)\\$\\$/g;
            match = displayMathRegex.exec(line);
            if (match) {
                content.push({
                    type: 'math',
                    content: this.parseMathContent(match[1]),
                    display: 'block'
                });
            }
        }

        return content.length > 0 ? content[0] : null;
    }

    parseMathContent(math) {
        return math.replace(/\\([a-zA-Z]+)/g, (match, command) => {
            if (GREEK_LETTERS[command]) {
                return GREEK_LETTERS[command];
            }
            if (MATH_OPERATORS[command]) {
                return MATH_OPERATORS[command];
            }
            return match;
        });
    }

    render(element, pdfGenerator) {
        pdfGenerator.renderMath(element);
    }

    canRender(elementType) {
        return elementType === 'math';
    }
}

export const mathFeature = new MathFeature();
