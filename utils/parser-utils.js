export function extractEnvironment(lines, startIdx, envType) {
    let content = [];
    let i = startIdx + 1;
    let nested = 0;

    while (i < lines.length) {
        const currentLine = lines[i].trim();
        if (currentLine.startsWith(`\\begin{${envType}}`)) {
            nested++;
        }
        if (currentLine.startsWith(`\\end{${envType}}`)) {
            if (nested === 0) {
                return { content: content.join('\n'), endIndex: i };
            }
            nested--;
        }
        content.push(lines[i]);
        i++;
    }
    return { content: content.join('\n'), endIndex: i };
}