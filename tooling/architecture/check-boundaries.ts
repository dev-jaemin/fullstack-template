import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? filesIn(path) : /\.(ts|tsx|mjs)$/.test(entry.name) ? [path] : [];
  });
}

export function findBoundaryViolations(baseDirectory = root): string[] {
  const sourceFiles = filesIn(baseDirectory).filter((file) => !file.includes('node_modules'));
  const violations: string[] = [];
  for (const file of sourceFiles) {
    const content = readFileSync(file, 'utf8');
    const location = relative(baseDirectory, file);
    const isWebApp = /apps\/(web|admin)\//.test(location);
    const isApiApp = /apps\/(api|internal-api)\//.test(location);
    const isClient = /modules\/[^/]+\/src\/client\//.test(location);
    const isServer = /modules\/[^/]+\/src\/server\//.test(location);
    if ((isWebApp || isClient) && /@repo\/[^'"\s]+\/server/.test(content))
      violations.push(`${location}: client-side code imports server entrypoint`);
    if ((isApiApp || isServer) && /@repo\/[^'"\s]+\/client/.test(content))
      violations.push(`${location}: server-side code imports client entrypoint`);
    if (/modules\/[^/]+\/src\//.test(location) && /@repo\/[^'"\s]+\/src\//.test(content))
      violations.push(`${location}: deep module import is forbidden`);
    if (/packages\/(ui|platform)\/src\//.test(location) && /@repo\/(order|product)/.test(content))
      violations.push(`${location}: platform package imports business module`);
    if (isClient && /@repo\/(order|product)\/server/.test(content))
      violations.push(`${location}: module client imports server`);
    if (isServer && /@repo\/(order|product)\/client/.test(content))
      violations.push(`${location}: module server imports client`);
  }
  return violations;
}

if (statSync(root).isDirectory()) {
  const violations = findBoundaryViolations();
  if (violations.length > 0) {
    console.error(violations.join('\n'));
    process.exitCode = 1;
  } else {
    console.log('Architecture boundaries passed.');
  }
}
