import { eventBus } from '../services/event-bus.js';
import { stateManager } from '../services/state-manager.js';
import { latexParser } from '../services/latex-parser.js';
import { pdfGenerator } from '../services/pdf-generator.js';
import { bibliographyFeature } from '../features/bibliography.js';

export class Toolbar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.attachEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .toolbar {
            background: #252526;
            padding: 12px 20px;
            border-bottom: 1px solid #3e3e42;
            display: flex;
            gap: 12px;
            align-items: center;
        }
        button {
            background: #0e639c;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background 0.2s;
        }
        button:hover {
            background: #1177bb;
        }
      </style>
      <div class="toolbar">
        <button id="parse-btn">Parse LaTeX</button>
        <button id="generate-pdf-btn">Generate PDF</button>
        <button id="download-pdf-btn">Download PDF</button>
        <input type="file" id="bib-upload" accept=".bib" style="display: none;" />
        <button id="upload-bib-btn">Upload .bib</button>
      </div>
    `;
  }

  attachEventListeners() {
    this.shadowRoot.getElementById('parse-btn').addEventListener('click', () => {
        const state = stateManager.getState();
        const parsedData = latexParser.parse(state.latex);
        stateManager.setState({ json: parsedData });
        eventBus.emit('latex:parsed', parsedData);
    });

    this.shadowRoot.getElementById('generate-pdf-btn').addEventListener('click', () => {
        let state = stateManager.getState();
        if (!state.json) {
            const parsedData = latexParser.parse(state.latex);
            stateManager.setState({ json: parsedData });
            eventBus.emit('latex:parsed', parsedData);
            state = stateManager.getState();
        }
        const pdfDoc = pdfGenerator.generate(state.json);
        if (pdfDoc) {
            stateManager.setState({ pdf: pdfDoc });
            eventBus.emit('pdf:generated', pdfDoc);
        }
    });

    this.shadowRoot.getElementById('download-pdf-btn').addEventListener('click', () => {
        const state = stateManager.getState();
        if (state.pdf) {
            state.pdf.save('document.pdf');
        } else {
            alert('Generate PDF first!');
        }
    });

    this.shadowRoot.getElementById('upload-bib-btn').addEventListener('click', () => {
        this.shadowRoot.getElementById('bib-upload').click();
    });

    this.shadowRoot.getElementById('bib-upload').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
            const bibContent = event.target.result;
            bibliographyFeature.loadBibliography(bibContent);
            eventBus.emit('bibliography:loaded');
            alert('Bibliography loaded successfully!');
        };
        reader.readAsText(file);
    });
  }
}

customElements.define('app-toolbar', Toolbar);