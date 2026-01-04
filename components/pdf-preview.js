import { eventBus } from '../services/event-bus.js';

export class PdfPreview extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    eventBus.on('pdf:generated', (pdfDoc) => {
        const pdfBlob = pdfDoc.output('blob');
        const url = URL.createObjectURL(pdfBlob);

        this.shadowRoot.getElementById('pdf-preview').innerHTML = `<iframe src="${url}" style="width: 100%; height: 100%; border: none; background: white;"></iframe>`;
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background: #1e1e1e;
        }
        .pane-header {
          background: #2d2d30;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          border-bottom: 1px solid #3e3e42;
          color: #fff;
        }
        #pdf-preview {
          flex: 1;
          background: #525252;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #999;
          font-size: 14px;
        }
      </style>
      <div class="pane-header">PDF Preview</div>
      <div id="pdf-preview">Generate PDF to see preview...</div>
    `;
  }
}

customElements.define('pdf-preview', PdfPreview);