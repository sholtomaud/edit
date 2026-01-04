import { eventBus } from '../services/event-bus.js';
import { stateManager } from '../services/state-manager.js';

import './latex-editor.js';
import './json-viewer.js';
import './pdf-preview.js';
import './toolbar.js';
import './status-bar.js';

export class AppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }
        .main-content {
          display: flex;
          flex: 1;
          overflow: hidden;
        }
        latex-editor, json-viewer, pdf-preview {
            flex: 1;
        }
      </style>
      <app-toolbar></app-toolbar>
      <div class="main-content">
        <latex-editor></latex-editor>
        <json-viewer></json-viewer>
        <pdf-preview></pdf-preview>
      </div>
      <status-bar></status-bar>
    `;
  }
}

customElements.define('app-shell', AppShell);