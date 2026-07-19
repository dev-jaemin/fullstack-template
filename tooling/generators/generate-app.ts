import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name))
  throw new Error('사용법: bun run generate:app worker');
const directory = join(process.cwd(), 'apps', name);
mkdirSync(join(directory, 'src'), { recursive: true });
writeFileSync(
  join(directory, 'package.json'),
  JSON.stringify(
    {
      name: `@repo/${name}`,
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: { typecheck: 'tsc -p tsconfig.json --noEmit' },
    },
    null,
    2,
  ) + '\n',
);
writeFileSync(
  join(directory, 'tsconfig.json'),
  '{ "extends": "../../tsconfig.json", "compilerOptions": { "noEmit": true }, "include": ["src"] }\n',
);
writeFileSync(join(directory, 'src', 'main.ts'), `console.log('${name} app is ready');\n`);
writeFileSync(
  join(directory, 'AGENTS.md'),
  `# ${name} app\n\n실행 단위 설정과 composition root만 둡니다.\n`,
);
console.log(`Generated apps/${name}`);
