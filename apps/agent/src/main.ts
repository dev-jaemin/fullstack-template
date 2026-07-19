import { runTool } from './registry.js';

const [command, ...args] = process.argv.slice(2);
const queryIndex = args.indexOf('--query');
const query = queryIndex >= 0 ? args[queryIndex + 1] : undefined;

async function main(): Promise<void> {
  if (command === 'product:search') {
    const result = await runTool('product:search', query ? { search: query } : {});
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  console.log('사용법: bun run agent product:search --query 키워드');
}

void main();
