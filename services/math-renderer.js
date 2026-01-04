
export class MathRenderer {
    constructor(pdfGenerator) {
        this.pdf = pdfGenerator.doc;
        this.pdfGenerator = pdfGenerator;
    }

    render(element) {
        const { content, display } = element;
        this.pdf.setFontSize(12);
        this.pdf.setFont(undefined, 'italic');

        if (display === 'block') {
            this.pdfGenerator.checkPageBreak(15);
            this.pdf.text(content, this.pdfGenerator.pageWidth / 2, this.pdfGenerator.y, { align: 'center' });
            this.pdfGenerator.y += 15;
        } else {
            // For inline math, we'd need a more sophisticated approach to handle line wrapping and positioning.
            // For this MVP, we'll just render it at the current position.
            this.pdf.text(content, this.pdfGenerator.margin, this.pdfGenerator.y);
            this.pdfGenerator.y += 7;
        }

        this.pdf.setFont(undefined, 'normal');
    }
}
