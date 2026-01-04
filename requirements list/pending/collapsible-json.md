# Feature: Collapsible JSON Viewer

**Requirement ID**: #6  
**Priority**: Medium  
**Status**: ⚪ Pending  
**Created**: 2026-01-04

## Objective

Make the JSON output panel collapsible and collapsed by default to maximize screen space for the editor and PDF preview. Users should be able to toggle visibility with a smooth animation.

## Requirements

1. JSON panel must be collapsed by default on page load
2. Panel header should act as toggle button
3. Smooth expand/collapse animation (300ms)
4. Visual indicator (chevron icon) showing collapsed/expanded state
5. State persists during the session (stored in StateManager)
6. Syntax highlighting for JSON output when expanded
7. No layout shift in other panes when toggling

## Affected Files

**New Files**: None

**Modified Files**:
- `components/json-viewer.js` (major changes)
- `styles/editor-pane.css` (add collapse styles)
- `services/state-manager.js` (add jsonViewerCollapsed state)

## Acceptance Criteria

- [ ] Panel is collapsed on initial page load
- [ ] Clicking anywhere on the header toggles visibility
- [ ] Chevron icon rotates smoothly to indicate state
- [ ] Animation duration is exactly 300ms with ease-in-out timing
- [ ] Content remains properly formatted when expanded
- [ ] State persists when navigating between operations
- [ ] No horizontal scrollbar appears during animation
- [ ] Panel remembers state until page refresh
- [ ] Keyboard accessible (Enter/Space on header toggles)
- [ ] ARIA attributes properly indicate expanded/collapsed state

## Implementation Notes

### Component Structure

The json-viewer component should:
1. Use Shadow DOM for style encapsulation
2. Render header with toggle button and chevron icon
3. Render content area with JSON display
4. Subscribe to state changes for external updates
5. Use CSS transitions for smooth animation

### Styling Approach

```css
.json-content {
  max-height: 0;
  overflow: hidden;
  transition: max-height 300ms ease-in-out;
}

.json-content.expanded {
  max-height: 2000px; /* Large enough for content */
}
```

### State Management

Add to `state-manager.js`:
```javascript
this.state = {
  // ... existing state ...
  jsonViewerCollapsed: true
};
```

### Accessibility

- Header should have `role="button"`
- Header should have `tabindex="0"` for keyboard navigation
- Header should have `aria-expanded` attribute
- Content area should have `aria-hidden` when collapsed

### Chevron Icon

Use a simple CSS triangle or Unicode character:
- Collapsed: `▶` (U+25B6) or rotate 0deg
- Expanded: `▼` (U+25BC) or rotate 90deg

## Dependencies

**Prerequisite Requirements**: 
- #4 (Modular Architecture) - Must be completed first

**Blocks**: None

## Testing Checklist

### Functionality
- [ ] Panel is collapsed on first load
- [ ] Clicking header toggles state
- [ ] Animation is smooth and 300ms
- [ ] Chevron icon rotates correctly
- [ ] JSON remains readable when expanded
- [ ] State persists during session

### User Experience
- [ ] No jarring layout shifts
- [ ] Other panes don't resize during toggle
- [ ] Visual feedback on hover/focus
- [ ] Animation feels natural (not too fast/slow)

### Accessibility
- [ ] Can toggle with Enter key
- [ ] Can toggle with Space key
- [ ] Tab navigation works
- [ ] ARIA states are correct
- [ ] Screen reader announces state

### Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

## User Stories

**As a developer**, I want the JSON panel collapsed by default so that I can see more of my LaTeX code and PDF preview simultaneously.

**As a power user**, I want quick access to toggle the JSON view so that I can inspect the parsed structure when debugging.

**As a keyboard user**, I want to toggle the panel using only my keyboard so that I don't have to reach for my mouse.

## Design Mockup

```
┌─────────────────────────────────────┐
│ JSON Output                      ▶ │ ← Collapsed (chevron points right)
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ JSON Output                      ▼ │ ← Expanded (chevron points down)
├─────────────────────────────────────┤
│ {                                   │
│   "type": "document",               │
│   "metadata": {...},                │
│   "content": [...]                  │
│ }                                   │
└─────────────────────────────────────┘
```

## Edge Cases

1. **Very large JSON output**: Consider virtual scrolling or truncation if JSON exceeds 10,000 lines
2. **Rapid toggling**: Debounce or prevent toggle during animation
3. **No JSON data**: Show placeholder message when collapsed/expanded
4. **Parse errors**: Show error message in panel instead of JSON

## Performance Considerations

- Use CSS transforms for animation (GPU-accelerated)
- Consider `will-change: max-height` for smoother animation
- Avoid re-parsing JSON on every toggle
- Cache rendered JSON HTML to avoid re-rendering

## Optional Enhancements (Future)

- [ ] Collapsible sections within JSON (expand/collapse nested objects)
- [ ] Copy JSON to clipboard button
- [ ] JSON search/filter functionality
- [ ] Multiple color themes for syntax highlighting
- [ ] Export JSON as file

## Success Metrics

- Panel starts collapsed 100% of the time
- Animation completes in 300ms ±10ms
- Zero layout shift in adjacent panes
- Toggle operation completes in <16ms (60fps)

## Estimated Effort

**Time**: 2-3 hours  
**Complexity**: Low-Medium  
**Risk**: Low

## Related Requirements

- **#4**: Modular Architecture (prerequisite)
- **#10**: Editor Enhancements (keyboard shortcuts)
- **#12**: Error Handling (error display in panel)

## Completion Checklist

When marking this requirement as complete:

- [ ] All acceptance criteria met
- [ ] All tests pass
- [ ] Component follows established patterns
- [ ] Code reviewed for accessibility
- [ ] Documentation updated
- [ ] Requirement moved to `requirements/completed/`
- [ ] REQUIREMENTS.md status updated to 🟢
- [ ] Completion date added to this file

## Notes

- Collapsing by default improves initial UX for new users
- Power users can expand when needed for debugging
- Animation duration of 300ms is standard for UI transitions
- Consider adding keyboard shortcut (e.g., Ctrl+J) in future
