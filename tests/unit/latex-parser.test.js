import { latexParser } from '../../services/latex-parser.js';
import { featureRegistry } from '../../services/feature-registry.js';
import { MetadataFeature } from '../../features/metadata.js';

featureRegistry.register(new MetadataFeature());

it('should parse a simple document', () => {
  const latex = `
\\begin{document}
Hello, world!
\\end{document}
  `;
  const expected = {
    type: 'document',
    metadata: {},
    content: [
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            content: 'Hello, world!'
          }
        ]
      }
    ]
  };
  const result = latexParser.parse(latex);
  assertDeepEqual(result, expected);
});

it('should parse metadata', () => {
    const latex = `
\\title{My Title}
\\author{John Doe}
\\date{2024-01-01}
\\begin{document}
\\end{document}
    `;
    const expected = {
        type: 'document',
        metadata: {
            title: 'My Title',
            author: 'John Doe',
            date: '2024-01-01'
        },
        content: []
    };
    const result = latexParser.parse(latex);
    assertDeepEqual(result, expected);
});

it('should parse multiple paragraphs', () => {
    const latex = `
\\begin{document}
First paragraph.

Second paragraph.
\\end{document}
    `;
    const expected = {
        type: 'document',
        metadata: {},
        content: [
            {
                type: 'paragraph',
                content: [{ type: 'text', content: 'First paragraph.' }]
            },
            {
                type: 'paragraph',
                content: [{ type: 'text', content: 'Second paragraph.' }]
            }
        ]
    };
    const result = latexParser.parse(latex);
    assertDeepEqual(result, expected);
});

it('should ignore comments', () => {
    const latex = `
\\begin{document}
% This is a comment.
Hello, world!
\\end{document}
    `;
    const expected = {
        type: 'document',
        metadata: {},
        content: [
            {
                type: 'paragraph',
                content: [{ type: 'text', content: 'Hello, world!' }]
            }
        ]
    };
    const result = latexParser.parse(latex);
    assertDeepEqual(result, expected);
});

it('should parse an empty document', () => {
    const latex = `
\\begin{document}
\\end{document}
    `;
    const expected = {
        type: 'document',
        metadata: {},
        content: []
    };
    const result = latexParser.parse(latex);
    assertDeepEqual(result, expected);
});
