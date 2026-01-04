
export class BibParser {
  parse(bibContent) {
    const entries = {};
    const entryRegex = /@(\w+)\{([^,]+),\s*([^@]*)\}/gs;

    let match;
    while ((match = entryRegex.exec(bibContent)) !== null) {
      const [, type, key, fields] = match;
      entries[key.trim()] = this.parseEntry(type, key.trim(), fields);
    }

    return entries;
  }

  parseEntry(type, key, fieldsStr) {
    const entry = { type, key, fields: {} };
    const fieldRegex = /(\w+)\s*=\s*\{([^}]*)\}|(\w+)\s*=\s*"([^"]*)"/g;

    let match;
    while ((match = fieldRegex.exec(fieldsStr)) !== null) {
      const fieldName = (match[1] || match[3]).toLowerCase();
      const fieldValue = match[2] || match[4];
      entry.fields[fieldName] = this.cleanField(fieldValue);
    }

    return entry;
  }

  cleanField(value) {
    return value
      .replace(/\\textit\{([^}]+)\}/g, '$1')
      .replace(/\\textbf\{([^}]+)\}/g, '$1')
      .replace(/~/g, ' ')
      .trim();
  }
}
