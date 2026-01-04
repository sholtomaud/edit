import { featureRegistry } from './feature-registry.js';
import { MathRenderer } from './math-renderer.js';

export class PDFGenerator {
    constructor() {
        this.doc = null;
        this.mathRenderer = null;
        this.y = 20;
        this.pageWidth = 210; // A4 width in mm
        this.margin = 20;
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
        const content = element.content;

        if (typeof content === 'string') {
            const lines = this.doc.splitTextToSize(content, this.pageWidth - 2 * this.margin);
            for (const line of lines) {
                this.checkPageBreak(7);
                this.doc.text(line, this.margin, this.y);
                this.y += 7;
            }
        } else if (typeof content === 'object' && content !== null) {
            this.renderFormattedText(content, this.margin, this.margin);
            this.y += 7;
        } else {
            console.warn('Unsupported paragraph content format:', content);
        }

        this.y += 5;
    }

    renderFormattedText(content, startX, wrapX) {
        let currentX = startX;
        const text = content.text || '';
        const formats = content.formats || [];
        const segments = this.segmentize(text, formats);

        this.checkPageBreak(7);

        for (const segment of segments) {
            this.doc.setFont(undefined, this.getFontStyle(segment.type));
            const words = segment.text.split(/(\\s+)/);

            for (const word of words) {
                if (!word) continue;
                const wordWidth = this.doc.getTextWidth(word);

                if (currentX > wrapX && currentX + wordWidth > this.pageWidth - this.margin) {
                    this.y += 7;
                    this.checkPageBreak(7);
                    currentX = wrapX;
                }

                this.doc.text(word, currentX, this.y);
                currentX += wordWidth;
            }
        }
    }

    segmentize(text, formats) {
        const segments = [];
        let lastIndex = 0;

        formats.sort((a, b) => {
            const indexA = text.indexOf(a.content);
            const indexB = text.indexOf(b.content);
            if (indexA === -1) return 1;
            if (indexB === -1) return -1;
            return indexA - indexB;
        });

        for (const format of formats) {
            const index = text.indexOf(format.content);
            if (index === -1) continue;

            if (index > lastIndex) {
                segments.push({ text: text.substring(lastIndex, index), type: 'normal' });
            }
            segments.push({ text: format.content, type: format.type });
            lastIndex = index + format.content.length;
        }

        if (lastIndex < text.length) {
            segments.push({ text: text.substring(lastIndex), type: 'normal' });
        }
        return segments;
    }

    getFontStyle(type) {
        switch (type) {
            case 'bold': return 'bold';
            case 'italic': return 'italic';
            case 'math': return 'italic';
            default: return 'normal';
        }
    }

    renderList(element) {
        this.doc.setFontSize(12);

        element.items.forEach((item) => {
            this.checkPageBreak(7);
            const bullet = element.ordered ? `${element.items.indexOf(item) + 1}. ` : '• ';
            const itemX = this.margin + 5 + this.doc.getTextWidth(bullet);

            if (typeof item === 'string') {
                const lines = this.doc.splitTextToSize(item, this.pageWidth - this.margin - itemX);
                for (let i = 0; i < lines.length; i++) {
                    if (i > 0) this.y += 7;
                    this.doc.text(lines[i], itemX, this.y);
                }
            } else if (typeof item === 'object' && item !== null) {
                this.renderFormattedText(item, itemX, itemX);
            }
            this.y += 7;
            this.doc.text(bullet, this.margin + 5, this.y);

        });

        this.y += 5;
    }

    renderEquation(element) {
        this.doc.setFontSize(12);
        this.doc.setFont(undefined, 'italic');
        this.doc.text(element.content, this.pageWidth / 2, this.y, { align: 'center' });
        this.doc.setFont(undefined, 'normal');
        this.y += 15;
    }

    renderMath(element) {
        this.mathRenderer.render(element);
    }

    checkPageBreak(height) {
        if (this.y + height > 280) {
            this.doc.addPage();
            this.y = 20;
        }
    }
}

export const pdfGenerator = new PDFGenerator();