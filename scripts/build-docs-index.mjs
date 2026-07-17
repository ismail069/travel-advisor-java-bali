import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.join(repositoryRoot, 'client/content/docs');
const output = {};
const registry = [];

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(file);
    else if (entry.name.endsWith('.mdx')) {
      const raw = await fs.readFile(file, 'utf8');
      const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
      const fields = Object.fromEntries((match?.[1] || '').split(/\r?\n/).map((line) => {
        const index = line.indexOf(':');
        return index > 0 ? [line.slice(0, index).trim(), line.slice(index + 1).trim().replace(/^"|"$/g, '')] : null;
      }).filter(Boolean));
      const content = raw.slice(match?.[0].length || 0);
      const relative = path.relative(root, file).replaceAll('\\', '/').replace(/\.mdx$/, '');
      const slug = relative === 'index' ? [] : relative.endsWith('/index') ? relative.slice(0, -6).split('/') : relative.split('/');
      const href = slug.length ? `/docs/${slug.join('/')}` : '/docs';
      const headingId = (title) => title.toLowerCase().replace(/[`*_]/g, '').replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
      output[href] = { content, meta: { title: fields.title || '', description: fields.description || '' }, toc: [...content.matchAll(/^(##|###)\s+(.+)$/gm)].map((item) => ({ level: item[1].length, title: item[2].replace(/[`*_]/g, ''), id: headingId(item[2]) })) };
      registry.push({ href, relative: path.relative(path.join(repositoryRoot, 'client/content'), file).replaceAll('\\', '/') });
    }
  }
}

await walk(root);
await fs.writeFile(path.join(repositoryRoot, 'client/content/docs-content.json'), `${JSON.stringify(output, null, 2)}\n`);
registry.sort((a, b) => a.href.localeCompare(b.href));
const imports = registry.map((item, index) => `import Doc${index} from './${item.relative}';`).join('\n');
const entries = registry.map((item, index) => `  ${JSON.stringify(item.href)}: Doc${index},`).join('\n');
await fs.writeFile(path.join(repositoryRoot, 'client/content/docs-registry.ts'), `${imports}\n\nimport type { ComponentType } from 'react';\n\nexport const docsRegistry: Record<string, ComponentType> = {\n${entries}\n};\n`);
console.log(`Indexed ${Object.keys(output).length} documentation pages.`);
