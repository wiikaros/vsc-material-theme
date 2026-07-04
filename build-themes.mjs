// Simple build script to render Mustache theme templates
// Run with: node build-themes.mjs
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import Mustache from 'mustache';

const __dirname = dirname(fileURLToPath(import.meta.url));

const defaults = JSON.parse(readFileSync(join(__dirname, 'extensions/defaults.json'), 'utf8'));
const templateStr = readFileSync(join(__dirname, 'src/themes/theme-template-color-theme.json'), 'utf8');
const variantsDir = join(__dirname, 'src/themes/settings/specific');
const themesDir = join(__dirname, 'themes');

const variantFiles = readdirSync(variantsDir).filter(f => f.endsWith('.json'));

for (const file of variantFiles) {
  const variant = JSON.parse(readFileSync(join(variantsDir, file), 'utf8'));
  const themeName = `${variant.name}.json`;

  const result = Mustache.render(templateStr, {
    commons: { accents: defaults.accents },
    variant
  });

  writeFileSync(join(themesDir, themeName), result, 'utf8');
  console.log(`Built: ${themeName}`);
}

console.log('\nAll themes built successfully!');
