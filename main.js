import { featureRegistry } from './services/feature-registry.js';
import { MetadataFeature, MakeTitleFeature } from './features/metadata.js';
import { SectionsFeature } from './features/sections.js';
import { ListsFeature } from './features/lists.js';
import { EquationsFeature } from './features/equations.js';
import { FormattingFeature } from './features/formatting.js';
import { mathFeature } from './features/math.js';
import { bibliographyFeature } from './features/bibliography.js';

import './components/app-shell.js';

// Register all features
featureRegistry.register(new MetadataFeature());
featureRegistry.register(new MakeTitleFeature());
featureRegistry.register(new SectionsFeature());
featureRegistry.register(new ListsFeature());
featureRegistry.register(new EquationsFeature());
featureRegistry.register(new FormattingFeature());
featureRegistry.register(mathFeature);