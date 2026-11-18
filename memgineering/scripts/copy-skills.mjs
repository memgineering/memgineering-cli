#!/usr/bin/env node
/**
 * Copy this package's sub-skills into `assets/` for publishing.
 *
 * Selective on purpose. apps/cli copies ALL of packages/skills, which is why
 * every kordis tarball carries skills it never installs. Doing the same here
 * would ship the six `kordis-*` skills inside a memgineering install and put
 * a competing command vocabulary in front of the agent that reads them.
 *
 * Only `memgineering-*` directories move. A missing source directory is not
 * an error during early development — `setup` degrades to "no sub-skills
 * bundled" rather than failing the build.
 */
import { copyFile, cp, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const skillsRoot = join(here, '..', '..', '..', 'packages', 'skills');
const assets = join(here, '..', 'assets');

await mkdir(assets, { recursive: true });

let entries = [];
try {
  entries = await readdir(skillsRoot, { withFileTypes: true });
} catch {
  console.log('copy-skills: packages/skills not found, nothing to bundle');
  process.exit(0);
}

// The hub goes first, and its presence in assets/ is also what tells the CLI
// at runtime that it is an installed copy rather than a source checkout.
await copyFile(join(skillsRoot, 'MEMGINEERING.md'), join(assets, 'MEMGINEERING.md'));

const ours = entries.filter((e) => e.isDirectory() && e.name.startsWith('memgineering-'));
for (const dir of ours) {
  await cp(join(skillsRoot, dir.name), join(assets, dir.name), { recursive: true });
}
console.log(`copy-skills: bundled hub + ${ours.length} skill(s)`);
