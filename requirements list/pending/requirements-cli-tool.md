# Feature: Requirements Management CLI Tool

**Requirement ID**: #24  
**Priority**: High  
**Status**: ⚪ Pending  
**Created**: 2026-01-04

## Objective

Create a command-line tool to manage project requirements, track dependencies, validate completeness, and provide structured output for both humans and LLM agents. The tool should maintain REQUIREMENTS.md as the single source of truth while providing interactive workflows.

## Requirements

### Core Commands
1. `requirements list` - List all requirements with filtering
2. `requirements new` - Interactive requirement creation
3. `requirements complete <id>` - Mark requirement as complete
4. `requirements start <id>` - Mark requirement as in progress
5. `requirements validate` - Validate all requirement files
6. `requirements next` - Suggest what to work on next
7. `requirements show <id>` - Display full requirement details
8. `requirements deps <id>` - Show dependency tree

### Interactive Prompts
9. Auto-generate next requirement ID
10. Dropdown/select for dependencies (show: ID + Title)
11. Dropdown/select for category from predefined list
12. Dropdown/select for priority (critical/high/medium/low)
13. Template-based file generation
14. Validate inputs before creating files

### LLM Tool Integration
15. Provide tool schema in JSON format (for Gemini, Claude, etc.)
16. Structured JSON output mode (`--json`)
17. Context generation for LLM (`requirements context <id>`)
18. Validation output in structured format
19. Accept structured input from LLM tools

### File Management
20. Auto-update REQUIREMENTS.md when creating/completing requirements
21. Move files between pending/completed/blocked directories
22. Validate requirement file structure
23. Check that referenced files exist
24. Ensure all dependencies are valid IDs

### Analysis Features
25. Dependency graph generation (text or mermaid)
26. Critical path analysis
27. Blocking requirements detection
28. Completion percentage calculation
29. Estimated effort summation

## Affected Files

**New Files**:
```
requirements/cli/
├── requirements.js           # Main CLI entry point
├── package.json             # Dependencies (inquirer, commander, etc.)
├── lib/
│   ├── parser.js            # Parse REQUIREMENTS.md
│   ├── generator.js         # Generate requirement files
│   ├── validator.js         # Validate requirements
│   ├── analyzer.js          # Dependency analysis
│   ├── llm-tool.js          # LLM tool schema and handler
│   └── templates.js         # Requirement templates
└── schemas/
    ├── requirement-schema.json
    └── llm-tool-schema.json
```

**Modified Files**:
- `package.json` (add scripts for CLI)
- `REQUIREMENTS.md` (add #24, #22, #23, #21)
- `README.md` (document CLI usage)

## Acceptance Criteria

- [ ] CLI executable with `./requirements/cli/requirements.js` or `npm run req`
- [ ] Auto-generates next available requirement ID
- [ ] Interactive prompts use dropdowns/selects
- [ ] Dependencies selected from list showing "ID: Title"
- [ ] Category selected from predefined list
- [ ] Priority selected from fixed options
- [ ] Creates valid requirement files from template
- [ ] Auto-updates REQUIREMENTS.md
- [ ] Validates all requirement files
- [ ] Shows dependency tree
- [ ] Suggests next task based on priority + dependencies
- [ ] Outputs valid JSON schema for LLM tools
- [ ] Can be called by LLM agents (Gemini Jules, Claude, etc.)
- [ ] All commands work without errors

## Implementation Notes

### Technology Stack

```json
{
  "dependencies": {
    "commander": "^11.0.0",      // CLI framework
    "inquirer": "^9.0.0",        // Interactive prompts
    "chalk": "^5.0.0",           // Colored output
    "marked": "^11.0.0",         // Markdown parser
    "js-yaml": "^4.1.0",         // YAML parser (for frontmatter)
    "cli-table3": "^0.6.3",      // Table output
    "zod": "^3.22.4"             // Schema validation
  }
}
```

### Requirement Schema (Zod)

```javascript
// lib/schemas.js
import { z } from 'zod';

export const RequirementSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(3).max(100),
  priority: z.enum(['critical', 'high', 'medium', 'low']),
  status: z.enum(['pending', 'in-progress', 'completed', 'blocked']),
  category: z.enum([
    'Core Features',
    'Refactoring & Infrastructure',
    'Feature Enhancements',
    'Quality & Testing',
    'Documentation',
    'Future Considerations'
  ]),
  dependencies: z.array(z.number()).optional(),
  estimatedEffort: z.string().optional(),
  description: z.string(),
  requirements: z.array(z.string()),
  acceptanceCriteria: z.array(z.string()),
  affectedFiles: z.array(z.string()).optional(),
  notes: z.string().optional()
});

export const categories = [
  'Core Features',
  'Refactoring & Infrastructure',
  'Feature Enhancements',
  'Quality & Testing',
  'Documentation',
  'Future Considerations'
];

export const priorities = ['critical', 'high', 'medium', 'low'];
export const statuses = ['pending', 'in-progress', 'completed', 'blocked'];
```

### LLM Tool Schema

```javascript
// lib/llm-tool.js
export const requirementsToolSchema = {
  name: "requirements_manager",
  description: "Manage project requirements: create, update, validate, and analyze requirements",
  input_schema: {
    type: "object",
    properties: {
      action: {
        type: "string",
        enum: ["list", "new", "show", "complete", "validate", "next", "deps"],
        description: "Action to perform"
      },
      id: {
        type: "number",
        description: "Requirement ID (for show, complete, deps actions)"
      },
      filters: {
        type: "object",
        properties: {
          status: {
            type: "string",
            enum: ["pending", "in-progress", "completed", "blocked"]
          },
          priority: {
            type: "string",
            enum: ["critical", "high", "medium", "low"]
          },
          category: {
            type: "string"
          }
        }
      },
      requirement: {
        type: "object",
        description: "New requirement data (for 'new' action)",
        properties: {
          title: { type: "string" },
          priority: { type: "string", enum: ["critical", "high", "medium", "low"] },
          category: { type: "string" },
          dependencies: { type: "array", items: { type: "number" } },
          description: { type: "string" },
          requirements: { type: "array", items: { type: "string" } },
          acceptanceCriteria: { type: "array", items: { type: "string" } }
        },
        required: ["title", "priority", "category", "description"]
      }
    },
    required: ["action"]
  }
};

// Handler for LLM tool calls
export async function handleLLMToolCall(input) {
  const { action, id, filters, requirement } = input;
  
  switch (action) {
    case 'list':
      return await listRequirements(filters);
    case 'new':
      return await createRequirement(requirement);
    case 'show':
      return await showRequirement(id);
    case 'complete':
      return await completeRequirement(id);
    case 'validate':
      return await validateRequirements();
    case 'next':
      return await suggestNext();
    case 'deps':
      return await showDependencies(id);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}
```

### Interactive New Requirement

```javascript
// lib/commands/new.js
import inquirer from 'inquirer';
import { categories, priorities } from '../schemas.js';
import { getNextId, getAllRequirements } from '../parser.js';

export async function newRequirement() {
  // Get all existing requirements for dependency selection
  const allReqs = await getAllRequirements();
  const dependencyChoices = allReqs.map(r => ({
    name: `#${r.id}: ${r.title}`,
    value: r.id
  }));

  // Auto-generate next ID
  const nextId = await getNextId();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Requirement title:',
      validate: (input) => input.length >= 3 || 'Title must be at least 3 characters'
    },
    {
      type: 'list',
      name: 'priority',
      message: 'Priority:',
      choices: [
        { name: '🔥 Critical', value: 'critical' },
        { name: '⚠️  High', value: 'high' },
        { name: '➡️  Medium', value: 'medium' },
        { name: '⬇️  Low', value: 'low' }
      ],
      default: 'medium'
    },
    {
      type: 'list',
      name: 'category',
      message: 'Category:',
      choices: categories
    },
    {
      type: 'checkbox',
      name: 'dependencies',
      message: 'Depends on (select requirements):',
      choices: dependencyChoices,
      pageSize: 15
    },
    {
      type: 'editor',
      name: 'description',
      message: 'Description (opens editor):'
    },
    {
      type: 'input',
      name: 'estimatedEffort',
      message: 'Estimated effort (e.g., "2-3 hours", "1 week"):',
      default: 'TBD'
    }
  ]);

  // Generate requirement file
  const requirement = {
    id: nextId,
    ...answers,
    status: 'pending',
    created: new Date().toISOString().split('T')[0]
  };

  await generateRequirementFile(requirement);
  await updateRequirementsMd(requirement);

  console.log(`\n✅ Created requirement #${nextId}: ${answers.title}`);
  console.log(`📄 File: requirements/pending/${toKebabCase(answers.title)}.md`);
  
  return requirement;
}
```

### Parser for REQUIREMENTS.md

```javascript
// lib/parser.js
import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

export async function parseRequirementsMd() {
  const content = await fs.readFile('requirements/REQUIREMENTS.md', 'utf-8');
  const requirements = [];
  
  // Parse markdown structure
  const tokens = marked.lexer(content);
  
  let currentReq = null;
  for (const token of tokens) {
    if (token.type === 'heading' && token.depth === 3) {
      // Extract: "### 4. Modular Architecture ⚪"
      const match = token.text.match(/(\d+)\.\s+(.+?)\s+(🟢|🟡|🔴|⚪)/);
      if (match) {
        if (currentReq) requirements.push(currentReq);
        
        currentReq = {
          id: parseInt(match[1]),
          title: match[2].trim(),
          status: getStatusFromEmoji(match[3]),
          priority: null,
          dependencies: []
        };
      }
    } else if (currentReq && token.type === 'paragraph') {
      // Extract priority, dependencies from text
      if (token.text.includes('Priority:')) {
        currentReq.priority = extractPriority(token.text);
      }
      if (token.text.includes('Depends on:') || token.text.includes('Prerequisite:')) {
        currentReq.dependencies = extractDependencies(token.text);
      }
    }
  }
  
  if (currentReq) requirements.push(currentReq);
  return requirements;
}

export async function getNextId() {
  const reqs = await parseRequirementsMd();
  const maxId = Math.max(...reqs.map(r => r.id), 0);
  return maxId + 1;
}

export async function getAllRequirements() {
  return await parseRequirementsMd();
}

function getStatusFromEmoji(emoji) {
  const map = {
    '🟢': 'completed',
    '🟡': 'in-progress',
    '🔴': 'blocked',
    '⚪': 'pending'
  };
  return map[emoji] || 'pending';
}

function extractPriority(text) {
  if (text.includes('Critical')) return 'critical';
  if (text.includes('High')) return 'high';
  if (text.includes('Medium')) return 'medium';
  if (text.includes('Low')) return 'low';
  return 'medium';
}

function extractDependencies(text) {
  // Extract numbers like "#4" or "4,"
  const matches = text.matchAll(/#?(\d+)/g);
  return Array.from(matches).map(m => parseInt(m[1]));
}
```

### Dependency Analysis

```javascript
// lib/analyzer.js
export async function analyzeDependencies(requirements) {
  const graph = new Map();
  const blocked = new Map();
  
  // Build dependency graph
  for (const req of requirements) {
    graph.set(req.id, req.dependencies || []);
    
    // Find what this requirement blocks
    for (const dep of (req.dependencies || [])) {
      if (!blocked.has(dep)) blocked.set(dep, []);
      blocked.get(dep).push(req.id);
    }
  }
  
  return { graph, blocked };
}

export async function findCriticalPath(requirements) {
  const { blocked } = await analyzeDependencies(requirements);
  
  // Find requirements that block the most others
  const critical = Array.from(blocked.entries())
    .map(([id, blocks]) => ({
      id,
      blocksCount: blocks.length,
      blocks
    }))
    .sort((a, b) => b.blocksCount - a.blocksCount);
  
  return critical;
}

export async function suggestNext() {
  const reqs = await parseRequirementsMd();
  const pending = reqs.filter(r => r.status === 'pending');
  const critical = await findCriticalPath(reqs);
  
  // Score requirements: priority + blocks count + no dependencies
  const scored = pending.map(req => {
    const priorityScore = { critical: 100, high: 75, medium: 50, low: 25 }[req.priority] || 50;
    const blocksCount = critical.find(c => c.id === req.id)?.blocksCount || 0;
    const hasUnmetDeps = req.dependencies?.some(depId => {
      const dep = reqs.find(r => r.id === depId);
      return dep && dep.status !== 'completed';
    });
    
    return {
      ...req,
      score: hasUnmetDeps ? 0 : priorityScore + (blocksCount * 10)
    };
  }).sort((a, b) => b.score - a.score);
  
  return scored[0];
}
```

### CLI Main Entry

```javascript
#!/usr/bin/env node
// requirements/cli/requirements.js

import { Command } from 'commander';
import chalk from 'chalk';
import { newRequirement } from './lib/commands/new.js';
import { listRequirements } from './lib/commands/list.js';
import { completeRequirement } from './lib/commands/complete.js';
import { validateRequirements } from './lib/commands/validate.js';
import { suggestNext } from './lib/analyzer.js';
import { requirementsToolSchema, handleLLMToolCall } from './lib/llm-tool.js';

const program = new Command();

program
  .name('requirements')
  .description('Project requirements management CLI')
  .version('1.0.0');

program
  .command('list')
  .description('List all requirements')
  .option('-s, --status <status>', 'Filter by status')
  .option('-p, --priority <priority>', 'Filter by priority')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    const reqs = await listRequirements(options);
    if (options.json) {
      console.log(JSON.stringify(reqs, null, 2));
    } else {
      displayRequirementsTable(reqs);
    }
  });

program
  .command('new')
  .description('Create a new requirement (interactive)')
  .action(async () => {
    await newRequirement();
  });

program
  .command('complete <id>')
  .description('Mark requirement as complete')
  .action(async (id) => {
    await completeRequirement(parseInt(id));
  });

program
  .command('validate')
  .description('Validate all requirement files')
  .option('-j, --json', 'Output as JSON')
  .action(async (options) => {
    const results = await validateRequirements();
    if (options.json) {
      console.log(JSON.stringify(results, null, 2));
    } else {
      displayValidationResults(results);
    }
  });

program
  .command('next')
  .description('Suggest what to work on next')
  .action(async () => {
    const next = await suggestNext();
    console.log(chalk.green(`\n📌 Recommended next: #${next.id} - ${next.title}`));
    console.log(chalk.gray(`   Priority: ${next.priority}, Blocks: ${next.blocksCount || 0} requirements`));
  });

program
  .command('tool-schema')
  .description('Output LLM tool schema (for Gemini, Claude, etc.)')
  .action(() => {
    console.log(JSON.stringify(requirementsToolSchema, null, 2));
  });

program
  .command('tool-call')
  .description('Handle LLM tool call (input via stdin)')
  .action(async () => {
    const input = JSON.parse(await getStdin());
    const result = await handleLLMToolCall(input);
    console.log(JSON.stringify(result, null, 2));
  });

program.parse();
```

### Package.json Scripts

```json
{
  "name": "latex-pdf-editor",
  "scripts": {
    "req": "node requirements/cli/requirements.js",
    "req:list": "npm run req list",
    "req:new": "npm run req new",
    "req:validate": "npm run req validate",
    "req:next": "npm run req next"
  }
}
```

## Usage Examples

### Human Usage

```bash
# Create new requirement interactively
$ npm run req new
? Requirement title: Table Support for LaTeX
? Priority: ➡️  Medium
? Category: Feature Enhancements
? Depends on: 
  ◯ #4: Modular Architecture
  ◉ #7: Advanced LaTeX Support
? Description: (opens editor)
? Estimated effort: 4-6 hours

✅ Created requirement #25: Table Support for LaTeX
📄 File: requirements/pending/table-support.md

# List pending requirements
$ npm run req list -- --status=pending --priority=high

# Validate all requirements
$ npm run req validate
✓ All 24 requirement files found
✓ All dependencies valid
✓ No orphaned files
⚠️  Warning: #18 has no acceptance criteria

# See what to work on next
$ npm run req next
📌 Recommended next: #4 - Modular Architecture
   Priority: critical, Blocks: 11 requirements
```

### LLM Usage (Gemini Jules, Claude MCP, etc.)

```javascript
// LLM calls the tool
{
  "tool": "requirements_manager",
  "input": {
    "action": "list",
    "filters": {
      "status": "pending",
      "priority": "high"
    }
  }
}

// Tool returns structured data
{
  "requirements": [
    {
      "id": 4,
      "title": "Modular Architecture",
      "priority": "critical",
      "status": "pending",
      "dependencies": [],
      "blocks": [6, 7, 8, 21, 22]
    },
    {
      "id": 5,
      "title": "GitHub Pages Deployment",
      "priority": "high",
      "status": "pending",
      "dependencies": [],
      "blocks": []
    }
  ]
}
```

## Dependencies

**Prerequisite Requirements**: None

**Blocks**: None (improves workflow for all requirements)

## Testing Checklist

- [ ] Auto-generates correct next ID
- [ ] Dropdowns show all options
- [ ] Dependencies show "ID: Title" format
- [ ] Category dropdown has all categories
- [ ] Priority dropdown has all priorities
- [ ] Generated files match template
- [ ] REQUIREMENTS.md updates correctly
- [ ] Validation catches missing files
- [ ] Validation catches invalid dependencies
- [ ] Next suggestion is logical
- [ ] JSON output is valid
- [ ] LLM tool schema is correct
- [ ] Can be called by LLM agents

## Success Metrics

- Reduces time to create requirement from 30min to 2min
- 100% of requirements validated before commit
- Dependency tracking catches blocking issues
- LLM agents can successfully use the tool

## Estimated Effort

**Time**: 8-12 hours  
**Complexity**: Medium-High  
**Risk**: Low

### Breakdown
- Schema and validation: 2 hours
- Interactive prompts: 2 hours
- Parser and analyzer: 3 hours
- LLM tool integration: 2 hours
- Testing and refinement: 2-3 hours

## Related Requirements

- All requirements benefit from this tool
- Especially helps with #4 (tracking complex dependencies)

## Completion Checklist

- [ ] All commands implemented
- [ ] Interactive prompts work
- [ ] Auto-ID generation works
- [ ] Dropdowns show correct options
- [ ] LLM tool schema published
- [ ] Documentation complete
- [ ] Tested with LLM agent
- [ ] README updated

## Notes

- This is infrastructure that pays dividends immediately
- Makes requirements management systematic rather than ad-hoc
- LLM tool integration is innovative - agents can help manage requirements!
- Could be open-sourced as standalone tool for other projects
