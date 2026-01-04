import { eventBus } from '../services/event-bus.js';
import { stateManager } from '../services/state-manager.js';

export class JsonViewer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    eventBus.on('latex:parsed', (data) => {
        this.shadowRoot.getElementById('json-output').textContent = JSON.stringify(data, null, 2);
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          border-right: 1px solid #3e3e42;
        }
        .pane-header {
          background: #2d2d30;
          padding: 8px 16px;
          font-size: 13px;
          font-weight: 600;
          border-bottom: 1px solid #3e3e42;
          color: #fff;
        }
        #json-output {
          background: #1e1e1e;
          color: #d4d4d4;
          padding: 16px;
          font-family: 'Courier New', monospace;
          font-size: 12px;
          overflow: auto;
          flex: 1;
          white-space: pre-wrap;
          word-wrap: break-word;
        }
      </style>
      <div class="pane-header">JSON Output</div>
      <pre id="json-output">Parse LaTeX to see JSON structure...</pre>
    `;
  }
}

customElements.define('json-viewer', JsonViewer);