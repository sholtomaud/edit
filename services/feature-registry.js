export class FeatureRegistry {
  constructor() {
    this.features = [];
  }

  register(feature) {
    this.features.push(feature);
    this.features.sort((a, b) => a.priority - b.priority);
  }

  findFeature(line, context) {
    for (const feature of this.features) {
      if (feature.matches(line, context)) {
        return feature;
      }
    }
    return null;
  }

  findFeatureForElement(element) {
    for (const feature of this.features) {
        if (feature.canRender(element.type)) {
            return feature;
        }
    }
    return null;
  }

  parseWith(feature, line, context) {
    return feature.parse(line, context);
  }

  renderWith(feature, element, generator, context) {
    feature.render(element, generator, context);
  }
}

export const featureRegistry = new FeatureRegistry();