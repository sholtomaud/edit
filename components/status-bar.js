import { eventBus } from '../services/event-bus.js';

export class StatusBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    eventBus.on('ui:notification', (message) => {
        this.shadowRoot.getElementById('status-text').textContent = message;
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
        <style>
            .status-bar {
                background: #007acc;
                color: white;
                padding: 4px 10px;
                font-size: 12px;
            }
        </style>
        <div class="status-bar">
            <span id="status-text">Ready</span>
        </div>
    `;
  }
}

customElements.define('status-bar', StatusBar);