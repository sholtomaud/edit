export class FeatureBase {
  constructor() {
    this.name = 'base';
    this.priority = 100;
  }

  matches(line, context) {
    return false;
  }

  parse(line, context) {
    return null;
  }

  canRender(elementType) {
    return false;
  }

  render(element, pdfGenerator, context) {
    // Base render function, does nothing
  }
}