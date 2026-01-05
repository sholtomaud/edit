
import { GREEK_LETTERS, MATH_OPERATORS } from '../utils/math-symbols.js';

export class MathRenderer {
    constructor(pdfGenerator) {
        this.pdfGenerator = pdfGenerator;
        this.doc = pdfGenerator.doc;
        this.fontSize = 12;
    }

    render(element, x, y) {
        const { content, display } = element;
        this.fontSize = this.doc.getFontSize();
        const ast = this.parse(content);

        if (display === 'block') {
            // Block math is always centered and advances the main y-cursor.
            this.pdfGenerator.checkPageBreak(20);
            const blockY = this.pdfGenerator.y;
            const blockX = this.pdfGenerator.pageWidth / 2;
            this.renderNode(ast, blockX, blockY, this.fontSize, 'center');
            this.pdfGenerator.y += this.getHeight(ast) + 10;
        } else { // 'inline' or unspecified
            // Inline math is rendered at the given x, y without advancing the main cursor.
            // The caller (e.g., renderParagraph) is responsible for advancing coordinates.
            this.renderNode(ast, x, y, this.fontSize);
        }
    }

    tokenize(latex) {
        const tokenRegex = /\\frac|\\([a-zA-Z]+)|[\^_]|\{|\}|[a-zA-Z0-9]|\S/g;
        return latex.match(tokenRegex) || [];
    }

    parse(latex) {
        const tokens = this.tokenize(latex);
        let index = 0;

        const parseExpression = () => {
            const nodes = [];
            while (index < tokens.length && tokens[index] !== '}') {
                nodes.push(parseToken());
            }
            return nodes.length === 1 ? nodes[0] : { type: 'expression', children: nodes };
        };

        const parseGroup = () => {
            if (tokens[index] === '{') {
                index++; // Consume '{'
                const expr = parseExpression();
                index++; // Consume '}'
                return expr;
            }
            return parseToken();
        };

        const parseToken = () => {
            const token = tokens[index++];
            if (token.match(/^[a-zA-Z0-9]$/)) {
                return { type: 'text', value: token };
            } else if (token === '\\frac') {
                return { type: 'fraction', numerator: parseGroup(), denominator: parseGroup() };
            } else if (token.startsWith('\\')) {
                const command = token.substring(1);
                return { type: 'symbol', value: GREEK_LETTERS[command] || MATH_OPERATORS[command] || `?${command}?` };
            } else if (token === '^') {
                return { type: 'superscript', script: parseGroup() };
            } else if (token === '_') {
                return { type: 'subscript', script: parseGroup() };
            }
            return { type: 'text', value: token };
        };

        const nodes = [];
        while(index < tokens.length) {
            const nextNode = parseToken();
            if (nextNode.type === 'superscript' || nextNode.type === 'subscript') {
                nextNode.base = nodes.pop();
                nodes.push(nextNode);
            } else {
                nodes.push(nextNode);
            }
        }

        return nodes.length === 1 ? nodes[0] : { type: 'expression', children: nodes };
    }

    renderNode(node, x, y, size, align = 'left') {
        this.doc.setFontSize(size);

        // Switch to the math font
        const originalFont = this.doc.getFont();
        this.doc.setFont('LatinModern-Math', 'normal');

        if (align === 'center') {
            x -= this.getWidth(node, size) / 2;
        }

        switch (node.type) {
            case 'expression':
                let currentX = x;
                for (const child of node.children) {
                    this.renderNode(child, currentX, y, size);
                    currentX += this.getWidth(child, size);
                }
                break;
            case 'text':
            case 'symbol':
                this.doc.text(node.value, x, y);
                break;
            case 'fraction':
                const numWidth = this.getWidth(node.numerator, size * 0.8);
                const denWidth = this.getWidth(node.denominator, size * 0.8);
                const maxWidth = Math.max(numWidth, denWidth);

                this.renderNode(node.numerator, x + (maxWidth - numWidth) / 2, y - size * 0.35, size * 0.8);
                this.doc.setLineWidth(0.2);
                this.doc.line(x, y, x + maxWidth, y);
                this.renderNode(node.denominator, x + (maxWidth - denWidth) / 2, y + size * 0.7, size * 0.8);
                break;
            case 'superscript':
                this.renderNode(node.base, x, y, size);
                const baseWidth = this.getWidth(node.base, size);
                this.renderNode(node.script, x + baseWidth, y - size * 0.5, size * 0.7);
                break;
            case 'subscript':
                this.renderNode(node.base, x, y, size);
                const baseWidthSub = this.getWidth(node.base, size);
                this.renderNode(node.script, x + baseWidthSub, y + size * 0.3, size * 0.7);
                break;
        }

        // Revert to the original font
        this.doc.setFont(originalFont.fontName, originalFont.fontStyle);
    }

    getWidth(node, size) {
        if (!node) return 0;

        const originalFont = this.doc.getFont();
        this.doc.setFont('LatinModern-Math', 'normal');
        this.doc.setFontSize(size);

        let width = 0;
        switch (node.type) {
            case 'expression':
                return node.children.reduce((w, n) => w + this.getWidth(n, size), 0);
            case 'text':
            case 'symbol':
                return this.doc.getTextWidth(node.value);
            case 'fraction':
                return Math.max(this.getWidth(node.numerator, size * 0.7), this.getWidth(node.denominator, size * 0.7));
            case 'superscript':
            case 'subscript':
                width = this.getWidth(node.base, size) + this.getWidth(node.script, size * 0.7);
                break;
            default:
                width = 0;
        }

        this.doc.setFont(originalFont.fontName, originalFont.fontStyle);
        return width;
    }

    getHeight(node, size = this.fontSize) {
        if (!node) return 0;
        switch (node.type) {
            case 'expression':
                return Math.max(...node.children.map(n => this.getHeight(n, size)));
            case 'text':
            case 'symbol':
                return size;
            case 'fraction':
                return this.getHeight(node.numerator, size * 0.7) + this.getHeight(node.denominator, size * 0.7);
            case 'superscript':
                return this.getHeight(node.base, size) + this.getHeight(node.script, size * 0.7) * 0.5;
            case 'subscript':
                 return this.getHeight(node.base, size) + this.getHeight(node.script, size * 0.7) * 0.5;
            default:
                return size;
        }
    }
}
