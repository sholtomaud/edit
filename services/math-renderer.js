
import { GREEK_LETTERS, MATH_OPERATORS } from '../utils/math-symbols.js';

export class MathRenderer {
    constructor(pdfGenerator) {
        this.pdfGenerator = pdfGenerator;
        this.doc = pdfGenerator.doc;
        this.fontSize = 12;
    }

    render(element) {
        const { content, display } = element;
        this.fontSize = this.doc.getFontSize();
        const ast = this.parse(content);

        if (display === 'block') {
            this.pdfGenerator.checkPageBreak(20);
            const x = this.pdfGenerator.pageWidth / 2;
            this.renderNode(ast, x, this.pdfGenerator.y, this.fontSize, 'center');
            this.pdfGenerator.y += this.getHeight(ast) + 10;
        } else {
            // Inline rendering is complex and will be handled later.
            // For now, we'll just render it simply.
            this.renderNode(ast, this.pdfGenerator.margin, this.pdfGenerator.y, this.fontSize);
        }
    }

    tokenize(latex) {
        const tokenRegex = /\\frac|\\sqrt|\\([a-zA-Z]+)|[\^_]|\{|\}|[a-zA-Z0-9]|\S/g;
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
            } else if (token === '\\sqrt') {
                return { type: 'sqrt', radicand: parseGroup() };
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
        this.doc.setFont(undefined, 'normal');

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
                this.doc.text(node.value, x, y);
                break;
            case 'symbol':
                this.doc.setFont('LatinModernMath');
                this.doc.text(node.value, x, y);
                this.doc.setFont(undefined, 'normal');
                break;
            case 'sqrt':
                const radicandWidth = this.getWidth(node.radicand, size);
                const radicandHeight = this.getHeight(node.radicand, size);
                const symbolHeight = radicandHeight * 1.2;
                this.doc.setFontSize(symbolHeight);
                this.doc.setFont('LatinModernMath');
                this.doc.text('√', x, y);
                this.doc.setFont(undefined, 'normal');
                this.doc.setFontSize(size);
                const symbolWidth = this.doc.getTextWidth('√');
                this.doc.setLineWidth(0.2);
                this.doc.line(x + symbolWidth * 0.8, y - radicandHeight * 0.6, x + symbolWidth * 0.8 + radicandWidth, y - radicandHeight * 0.6);
                this.renderNode(node.radicand, x + symbolWidth * 0.8, y, size);
                break;
            case 'fraction':
                const numWidth = this.getWidth(node.numerator, size * 0.7);
                const denWidth = this.getWidth(node.denominator, size * 0.7);
                const maxWidth = Math.max(numWidth, denWidth);

                this.renderNode(node.numerator, x + (maxWidth - numWidth) / 2, y - size * 0.2, size * 0.7);
                this.doc.setLineWidth(0.2);
                this.doc.line(x, y, x + maxWidth, y);
                this.renderNode(node.denominator, x + (maxWidth - denWidth) / 2, y + size * 0.6, size * 0.7);
                break;
            case 'superscript':
                this.renderNode(node.base, x, y, size);
                const baseWidth = this.getWidth(node.base, size);
                this.renderNode(node.script, x + baseWidth, y - size * 0.4, size * 0.7);
                break;
            case 'subscript':
                this.renderNode(node.base, x, y, size);
                const baseWidthSub = this.getWidth(node.base, size);
                this.renderNode(node.script, x + baseWidthSub, y + size * 0.2, size * 0.7);
                break;
        }
    }

    getWidth(node, size) {
        if (!node) return 0;
        this.doc.setFontSize(size);
        switch (node.type) {
            case 'expression':
                return node.children.reduce((w, n) => w + this.getWidth(n, size), 0);
            case 'text':
            case 'symbol':
                return this.doc.getTextWidth(node.value);
            case 'sqrt':
                return this.doc.getTextWidth('√') * 0.7 + this.getWidth(node.radicand, size);
            case 'fraction':
                return Math.max(this.getWidth(node.numerator, size * 0.7), this.getWidth(node.denominator, size * 0.7));
            case 'superscript':
            case 'subscript':
                return this.getWidth(node.base, size) + this.getWidth(node.script, size * 0.7);
            default:
                return 0;
        }
    }

    getHeight(node, size = this.fontSize) {
        if (!node) return 0;
        switch (node.type) {
            case 'expression':
                return Math.max(...node.children.map(n => this.getHeight(n, size)));
            case 'text':
            case 'symbol':
                return size;
            case 'sqrt':
                return this.getHeight(node.radicand, size) * 1.2;
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
