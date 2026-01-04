import { loadMonaco } from '../utils/monaco-loader.js';
import { eventBus } from '../services/event-bus.js';
import { stateManager } from '../services/state-manager.js';

const initialLatex = `\\documentclass{article}
\\usepackage{amsmath}
\\usepackage{graphicx}

\\title{Introduction to Quantum Computing}
\\author{Dr. Sarah Chen}
\\date{January 2026}

\\begin{document}

\\maketitle

\\section{Introduction}
Quantum computing represents a \\textbf{paradigm shift} in computational technology, leveraging the principles of quantum mechanics to process information in fundamentally new ways. Unlike classical computers that use bits as the basic unit of information, quantum computers use \\textit{quantum bits} or qubits.

\\subsection{Historical Context}
The concept of quantum computing was first introduced by physicist \\textbf{Richard Feynman} in 1982, who proposed that quantum systems could be used to simulate other quantum systems more efficiently than classical computers.

\\section{Fundamental Concepts}

\\subsection{Superposition}
A qubit can exist in a superposition of states, mathematically represented as:

\\begin{equation}
|\\psi\\rangle = \\alpha|0\\rangle + \\beta|1\\rangle
\\end{equation}

where $\\alpha$ and $\\beta$ are complex probability amplitudes satisfying $|\\alpha|^2 + |\\beta|^2 = 1$.

\\subsection{Entanglement}
Quantum entanglement creates correlations between qubits that have no classical analogue. The famous Einstein-Podolsky-Rosen state is:

\\begin{equation}
|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)
\\end{equation}

\\section{Current Applications}
Quantum computing shows promise in several domains:

\\begin{itemize}
\\item Cryptography and secure communication
\\item Drug discovery and molecular simulation
\\item Optimization problems in logistics
\\item Machine learning and artificial intelligence
\\item Financial modeling and risk analysis
\\end{itemize}

\\subsection{Quantum Algorithms}
Several algorithms demonstrate quantum advantage:

\\begin{enumerate}
\\item Shor's algorithm for integer factorization
\\item Grover's algorithm for database search
\\item Quantum Fourier Transform
\\item Variational Quantum Eigensolver
\\end{enumerate}

\\section{Challenges and Future Directions}
Despite recent progress, significant challenges remain in scaling quantum computers. \\textit{Quantum decoherence} and error rates continue to limit the complexity of computations that can be reliably performed.

The field is rapidly evolving, with major tech companies and research institutions investing heavily in quantum technologies. The race to achieve \\textbf{quantum supremacy} has driven innovation across hardware, software, and algorithm development.

\\section{Conclusion}
Quantum computing stands at the frontier of computational science, promising to revolutionize fields from cryptography to drug discovery. While practical, large-scale quantum computers remain years away, the foundational work being done today will shape the technological landscape of tomorrow.

\\end{document}`;

export class LatexEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  async connectedCallback() {
    this.render();
    try {
        const monaco = await loadMonaco();
        this.editor = monaco.editor.create(this.shadowRoot.getElementById('editor-container'), {
            value: initialLatex,
            language: 'latex',
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 14,
            minimap: { enabled: false }
        });

        this.editor.onDidChangeModelContent(() => {
            const latex = this.editor.getValue();
            stateManager.setState({ latex });
            eventBus.emit('latex:changed', { latex });
        });

        stateManager.setState({ latex: initialLatex });

    } catch (error) {
        console.error('Failed to load Monaco Editor:', error);
        this.shadowRoot.getElementById('editor-container').textContent = 'Error loading editor.';
    }
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
        #editor-container {
          flex: 1;
        }
      </style>
      <div class="pane-header">LaTeX Editor</div>
      <div id="editor-container"></div>
    `;
  }
}

customElements.define('latex-editor', LatexEditor);