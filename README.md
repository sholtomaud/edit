# LaTeX PDF Editor

A browser-based LaTeX editor that parses LaTeX documents into JSON and renders them as PDFs, built entirely with native Web Components.

## Features

- **Live LaTeX Editing**: Monaco-powered editor with syntax highlighting
- **JSON Representation**: View the structured document representation
- **PDF Generation**: Browser-based PDF rendering using jsPDF
- **No Backend Required**: Everything runs client-side
- **Modular Architecture**: Native Web Components for maintainability

## Project Structure

```
latex-pdf-editor/
├── index.html                 # Main entry point, minimal HTML
├── styles/
│   ├── main.css              # Global styles and CSS variables
│   ├── toolbar.css           # Toolbar component styles
│   ├── editor-pane.css       # Editor pane styles
│   └── layout.css            # Grid/flex layout styles
├── components/
│   ├── app-shell.js          # Main app container component
│   ├── latex-editor.js       # Monaco editor wrapper component
│   ├── json-viewer.js        # Collapsible JSON output component
│   ├── pdf-preview.js        # PDF display component
│   ├── toolbar.js            # Action buttons component
│   └── status-bar.js         # Status/notifications component
├── services/
│   ├── latex-parser.js       # LaTeX → JSON parser
│   ├── pdf-generator.js      # JSON → PDF renderer
│   ├── state-manager.js      # App state management
│   └── event-bus.js          # Component communication
├── utils/
│   ├── monaco-loader.js      # Monaco editor initialization
│   └── library-loader.js     # External library management
├── config/
│   ├── latex-examples.js     # Sample LaTeX documents
│   └── parser-config.js      # Parser rules configuration
├── requirements/
│   ├── REQUIREMENTS.md       # Current requirements list
│   ├── completed/            # Implemented features
│   └── pending/              # Planned features
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Pages deployment
├── README.md                 # This file
└── AGENTS.md                 # LLM development guide
```

## Technology Stack

### Allowed Dependencies
- **Monaco Editor**: Code editor with LaTeX syntax support
- **jsPDF**: Client-side PDF generation
- **Native Web Components**: No frameworks (React, Vue, etc.)
- **Vanilla JavaScript**: ES6+ modules
- **CSS**: Native CSS with CSS custom properties

### Explicitly Not Allowed
- No npm packages beyond Monaco and jsPDF
- No build tools (Webpack, Vite, etc.)
- No frontend frameworks
- No UI component libraries
- No localStorage/sessionStorage (use in-memory state)

## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/latex-pdf-editor.git
cd latex-pdf-editor
```

2. Serve the files with any static server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

3. Open `http://localhost:8000` in your browser

### Using the Editor

1. **Edit LaTeX**: Type or paste LaTeX code in the left pane
2. **Parse**: Click "Parse LaTeX" to see JSON structure
3. **Generate PDF**: Click "Generate PDF" to render
4. **Download**: Click "Download PDF" to save the file

## Current Features

### LaTeX Support
- Document metadata (title, author, date)
- Sections and subsections
- Paragraphs with inline formatting
- Bold (`\textbf{}`) and italic (`\textit{}`)
- Inline math (`$...$`)
- Numbered equations (`\begin{equation}...\end{equation}`)
- Unordered lists (`\begin{itemize}...\end{itemize}`)
- Ordered lists (`\begin{enumerate}...\end{enumerate}`)

### JSON Structure
The parser converts LaTeX into a structured JSON format:

```json
{
  "type": "document",
  "metadata": {
    "title": "Document Title",
    "author": "Author Name",
    "date": "Date"
  },
  "content": [
    {
      "type": "section",
      "level": 1,
      "title": "Section Title"
    },
    {
      "type": "paragraph",
      "content": "Text content..."
    }
  ]
}
```

## Contributing

This project follows a structured requirements-based workflow. See [AGENTS.md](AGENTS.md) for detailed development guidelines.

### Quick Contribution Guide

1. Check `requirements/pending/` for planned features
2. Create a new requirement file for your feature
3. Implement following the Web Component pattern
4. Move requirement to `requirements/completed/`
5. Update `REQUIREMENTS.md`

## Deployment

The project automatically deploys to GitHub Pages on push to `main`:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

View at: `https://yourusername.github.io/latex-pdf-editor/`

## Architecture Principles

1. **Component Isolation**: Each Web Component is self-contained
2. **Event-Driven**: Components communicate via EventBus
3. **Single Responsibility**: Each module does one thing well
4. **No Build Step**: Runs directly in the browser
5. **Progressive Enhancement**: Core features work without JS

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

Requires ES6 module support and Custom Elements v1.

## License

MIT License - see LICENSE file for details

## Roadmap

See `requirements/REQUIREMENTS.md` for detailed feature roadmap.

### Upcoming Features
- Collapsible JSON viewer
- Better math rendering
- Table support
- Image/figure support
- Custom PDF styling
- Export/import JSON

## Support

For bugs and feature requests, please create an issue on GitHub.

For development questions, see [AGENTS.md](AGENTS.md).
