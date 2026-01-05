
import { featureRegistry } from './feature-registry.js';
import { MathRenderer } from './math-renderer.js';

export class PDFGenerator {
    constructor() {
        this.doc = null;
        this.mathRenderer = null;
        this.y = 20;
        this.x = 20;
        this.pageWidth = 210; // A4 width in mm
        this.margin = 20;
        this.equationCounter = 1;
    }

    generate(jsonData) {
        if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
            console.error('jsPDF not loaded yet');
            alert('PDF library is still loading. Please try again in a moment.');
            return null;
        }

        const { jsPDF } = window.jspdf;
        this.doc = new jsPDF();
        this.mathRenderer = new MathRenderer(this);
        this.y = 20;
        this.x = this.margin;

        const makeTitleElement = jsonData.content.find(el => el.type === 'maketitle');
        if (makeTitleElement) {
             this.renderTitlePage(jsonData.metadata);
        }

        for (const element of jsonData.content) {
            if (element.type !== 'maketitle') {
                 this.renderElement(element);
            }
        }

        return this.doc;
    }

    renderTitlePage(metadata) {
        this.doc.setFontSize(24);
        this.doc.text(metadata.title || 'Untitled', this.pageWidth / 2, 80, { align: 'center' });

        this.doc.setFontSize(14);
        if (metadata.author) {
            this.doc.text(metadata.author, this.pageWidth / 2, 100, { align: 'center' });
        }

        this.doc.setFontSize(12);
        if (metadata.date) {
            this.doc.text(metadata.date, this.pageWidth / 2, 115, { align: 'center' });
        }
        this.doc.addPage();
        this.y = 20;
    }

    renderElement(element) {
        this.x = this.margin;
        const feature = featureRegistry.findFeatureForElement(element);

        if (feature) {
            this.checkPageBreak(10);
            feature.render(element, this);
        } else if (element.type === 'paragraph') {
            this.renderParagraph(element);
        } else {
            console.warn(`No renderer for element type: ${element.type}`);
        }
    }

    renderSection(element) {
        const fontSize = element.level === 1 ? 18 : 14;
        this.doc.setFontSize(fontSize);
        this.doc.setFont(undefined, 'bold');
        this.doc.text(element.title, this.margin, this.y);
        this.doc.setFont(undefined, 'normal');
        this.y += fontSize / 2 + 5;
    }

    renderParagraph(element) {
        this.doc.setFontSize(12);
        this.doc.setFont(undefined, 'normal');
        this.x = this.margin;
        const lineHeight = 7;

        for (const node of element.content) {
            if (node.type === 'text') {
                const words = node.content.split(' ');
                for (const word of words) {
                    const wordWidth = this.doc.getTextWidth(word + ' ');
                    if (this.x + wordWidth > this.pageWidth - this.margin) {
                        this.y += lineHeight;
                        this.x = this.margin;
                    }
                    this.doc.text(word, this.x, this.y);
                    this.x += wordWidth;
                }
            } else if (node.type === 'math') {
                this.mathRenderer.render(node, this.x, this.y);
                this.x += this.mathRenderer.getWidth(this.mathRenderer.parse(node.content), 12) + 2;
            }
        }
        this.y += lineHeight;
        this.y += 5; // Paragraph spacing
    }

    renderList(element) {
        this.doc.setFontSize(12);

        element.items.forEach((item, index) => {
            this.checkPageBreak(7);
            const bullet = element.ordered ? `${index + 1}. ` : '• ';
            const itemX = this.margin + 5;
            this.doc.text(bullet, itemX, this.y);

            const contentX = itemX + this.doc.getTextWidth(bullet);
            const lines = this.doc.splitTextToSize(item, this.pageWidth - contentX - this.margin);

            for (let i = 0; i < lines.length; i++) {
                if (i > 0) this.y += 7;
                this.doc.text(lines[i], contentX, this.y);
            }
            this.y += 7;
        });

        this.y += 5;
    }

    renderMath(element) {
        this.mathRenderer.render(element);
    }

    renderEquation(element) {
        this.doc.setFontSize(12);
        const parsedMath = this.mathRenderer.parse(element.content);
        const mathWidth = this.mathRenderer.getWidth(parsedMath, 12);
        const mathX = (this.pageWidth - mathWidth) / 2;

        this.checkPageBreak(10); // Check for page break before rendering

        // Render the math content
        this.mathRenderer.render({ content: element.content, type: 'math' }, mathX, this.y);

        // Render the equation number
        if (element.numbered) {
            const equationNumberStr = `(${this.equationCounter})`;
            const numberX = this.pageWidth - this.margin - this.doc.getTextWidth(equationNumberStr) - 5; // Add some padding
            this.doc.text(equationNumberStr, numberX, this.y);
            this.equationCounter++;
        }

        this.y += 10; // Spacing after equation
        this.y += 5; // Paragraph spacing
    }

    checkPageBreak(height) {
        if (this.y + height > 280) { // 297mm A4 height - 17mm margin
            this.doc.addPage();
            this.y = this.margin;
        }
    }
}

export const pdfGenerator = new PDFGenerator();
