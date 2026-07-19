import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const name = process.argv[2];
if (!name || !/^[a-z][a-z0-9-]*$/.test(name))
  throw new Error('사용법: bun run generate:module coupon');
const directory = join(process.cwd(), 'modules', name);
mkdirSync(join(directory, 'src', 'contract'), { recursive: true });
mkdirSync(join(directory, 'docs'), { recursive: true });
writeFileSync(
  join(directory, 'package.json'),
  JSON.stringify(
    {
      name: `@repo/${name}`,
      private: true,
      version: '0.1.0',
      type: 'module',
      exports: { '.': './src/index.ts', './contract': './src/contract/index.ts' },
      dependencies: { zod: '^3.24.1' },
    },
    null,
    2,
  ) + '\n',
);
writeFileSync(
  join(directory, 'src', 'contract', 'index.ts'),
  "import { z } from 'zod';\n\nexport const ItemSchema = z.object({ id: z.string().uuid() });\nexport type Item = z.infer<typeof ItemSchema>;\n",
);
writeFileSync(join(directory, 'src', 'index.ts'), "export * from './contract/index.js';\n");
writeFileSync(
  join(directory, 'AGENTS.md'),
  `# ${name} module\n\ncontract를 먼저 정의하고 public subpath를 통해서만 외부에 공개합니다.\n`,
);
writeFileSync(
  join(directory, 'docs', 'README.md'),
  `# ${name}\n\n생성된 모듈의 책임과 요구사항을 기록합니다.\n`,
);
console.log(`Generated modules/${name}`);
