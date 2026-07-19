# TypeScript Full-Stack Monorepo Template

TypeScript 기반의 웹·관리자·API·CLI·Agent를 하나의 저장소에서 운영하기 위한 재사용 가능한 풀스택 모노레포 템플릿입니다. 특정 서비스의 화면이나 데이터를 복제하는 것이 아니라, 여러 프로젝트에 적용할 수 있는 구조와 개발 규칙을 제공합니다.

## 핵심 장점

- `apps`, `modules`, `packages`의 책임을 분리해 앱 화면과 비즈니스 규칙을 독립적으로 확장합니다.
- Zod contract 하나에서 입력·응답·에러·TypeScript 타입을 함께 파생해 프론트엔드와 백엔드의 불일치를 줄입니다.
- 모듈은 `contract`, `server`, `client`, `testing` public entrypoint만 노출해 deep import와 경계 침범을 막습니다.
- `bun run test:architecture`가 앱·모듈·패키지 간 의존 방향을 검사합니다.
- Bun workspace, Vite, NestJS, React, TanStack Query, Vitest를 조합해 빠른 개발 루프와 명확한 실행 단위를 제공합니다.
- 각 앱에 production Dockerfile이 있고, 개발 시에는 Docker로 의존성만 준비한 뒤 호스트의 `bun dev`를 실행할 수 있습니다.
- 주문 예제는 `InMemoryDatabase`를 사용합니다. Public API가 저장소를 소유하고 Internal API가 이를 proxy하므로 Web과 Admin이 같은 데이터를 봅니다.

## 구조

```text
apps/
  web/           고객용 Vite SPA
  admin/         운영자용 Vite SPA
  api/           public REST API와 도메인 composition root
  internal-api/  운영 화면용 API facade/proxy
  cli/           contract를 사용하는 CLI 예제
  agent/         contract를 사용하는 Agent 예제

modules/
  product/       상품 contract, server use case, client query, fixture
  order/         예약 contract, server use case, client mutation, fixture

packages/
  ui/            비즈니스 비종속 React UI와 semantic tokens
  platform/      요청 유틸리티와 재사용 가능한 InMemoryDatabase
  config/        공통 TypeScript 설정
  testkit/       테스트 보조 도구

tooling/         architecture 검사와 생성기
docs/            설계 결정과 컨테이너 운영 문서
```

## 의존성 규칙

```text
web/admin  → module client + contract
api        → module server + contract
internal   → module contract + platform request utility
module server → 같은 모듈 contract + platform
module client → 같은 모듈 contract
packages/ui/platform → modules/apps 참조 금지
```

외부 코드는 public entrypoint만 사용합니다.

```ts
import { OrderSchema } from '@repo/order/contract';
import { OrderModule } from '@repo/order/server';
import { useOrders } from '@repo/order/client';
import { createOrderFixture } from '@repo/order/testing';
```

## 실행

```bash
bun install
bun run dev
```

- Web: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Public API: `http://localhost:3000/api`
- Internal API: `http://localhost:3001/api`

Docker로 Bun 버전과 workspace 의존성만 고정하고 실제 서버는 호스트 Bun 프로세스로 실행하려면 다음 명령을 사용합니다.

```bash
bun run docker:dev
```

Docker에서 `bun install`이 끝난 뒤 호스트에서 `bun dev`가 실행됩니다. 의존성만 준비하려면 `bun run docker:deps`를 사용합니다.

## 검증

```bash
bun run format:check
bun run lint
bun run typecheck
bun run test
bun run test:architecture
bun run build
bun run verify
```

## 컨테이너화

각 실행 단위는 루트를 build context로 독립 빌드할 수 있습니다.

```bash
docker build -f apps/api/Dockerfile -t template-api .
docker build -f apps/internal-api/Dockerfile -t template-internal-api .
docker build -f apps/web/Dockerfile -t template-web .
docker build -f apps/admin/Dockerfile -t template-admin .
```

배포 이미지와 프론트 reverse proxy까지 로컬에서 확인하려면 production-like Compose를 사용합니다.

```bash
bun run docker:local
bun run docker:local:down
```

개발 환경과 배포 환경의 차이는 [docs/containerization.md](docs/containerization.md)에 정리되어 있습니다.

## 데이터 저장 예제

`packages/platform`의 `InMemoryDatabase`는 Map 기반의 작은 DB 추상화입니다. `modules/order`의 Repository가 이를 사용하고 public API 프로세스가 단일 저장소를 소유합니다. Admin 요청은 `internal-api`를 거쳐 public API의 같은 저장소를 조회하므로 예약 생성과 운영 조회가 연결됩니다.

프로세스를 재시작하면 seed 데이터로 초기화됩니다. 실제 서비스로 확장할 때는 Repository 구현만 PostgreSQL, SQLite 등으로 교체하고 contract와 Service는 유지할 수 있습니다.

## 확장 방법

```bash
bun run generate:module coupon
bun run generate:app worker
```

새 기능은 contract를 먼저 정의하고 server/client/testing public entrypoint를 채운 다음 composition root에 연결합니다. 새로운 의존성 방향은 `bun run test:architecture`로 고정하고, API contract 변경 시 mapper·client parser·fixture·관련 테스트를 함께 갱신합니다.

---

# TypeScript Full-Stack Monorepo Template

A reusable full-stack monorepo template for running web, admin, API, CLI, and Agent applications in one TypeScript repository. It focuses on reusable structure and engineering rules rather than copying a specific service, screen, or dataset.

## Key benefits

- Separates the responsibilities of `apps`, `modules`, and `packages`, allowing application shells and business rules to evolve independently.
- Derives request, response, error, and TypeScript types from the same Zod contracts to reduce frontend/backend drift.
- Exposes only `contract`, `server`, `client`, and `testing` public entrypoints, preventing deep imports and boundary leaks.
- Uses `bun run test:architecture` to check dependency direction across apps, modules, and packages.
- Combines Bun workspaces, Vite, NestJS, React, TanStack Query, and Vitest for a fast development loop with explicit runtime units.
- Provides production Dockerfiles for each app while allowing development dependencies to be prepared in Docker and the host `bun dev` process to run the servers.
- Uses a small `InMemoryDatabase` for the order example. The public API owns the store and the Internal API proxies it, allowing Web and Admin to see the same data.

## Structure

```text
apps/
  web/           Vite SPA for end users
  admin/         Vite SPA for operators
  api/           Public REST API and domain composition root
  internal-api/  API facade/proxy for the operations screen
  cli/           CLI example using shared contracts
  agent/         Agent example using shared contracts

modules/
  product/       Product contract, server use case, client query, fixtures
  order/         Reservation contract, server use case, client mutation, fixtures

packages/
  ui/            Business-agnostic React UI and semantic tokens
  platform/      Request utilities and reusable InMemoryDatabase
  config/        Shared TypeScript configuration
  testkit/       Test helpers

tooling/         Architecture checks and generators
docs/            Architecture decisions and container documentation
```

## Dependency rules

```text
web/admin  → module client + contract
api        → module server + contract
internal   → module contract + platform request utility
module server → same-module contract + platform
module client → same-module contract
packages/ui/platform → must not reference modules/apps
```

Consumers use public entrypoints only:

```ts
import { OrderSchema } from '@repo/order/contract';
import { OrderModule } from '@repo/order/server';
import { useOrders } from '@repo/order/client';
import { createOrderFixture } from '@repo/order/testing';
```

## Run

```bash
bun install
bun run dev
```

- Web: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Public API: `http://localhost:3000/api`
- Internal API: `http://localhost:3001/api`

To pin the Bun version and workspace dependencies with Docker while keeping the actual servers as host Bun processes, run:

```bash
bun run docker:dev
```

Docker installs the dependencies first and then the host runs `bun dev`. Use `bun run docker:deps` when only dependency preparation is needed.

## Verify

```bash
bun run format:check
bun run lint
bun run typecheck
bun run test
bun run test:architecture
bun run build
bun run verify
```

## Containerization

Each runtime unit can be built independently with the repository root as its build context.

```bash
docker build -f apps/api/Dockerfile -t template-api .
docker build -f apps/internal-api/Dockerfile -t template-internal-api .
docker build -f apps/web/Dockerfile -t template-web .
docker build -f apps/admin/Dockerfile -t template-admin .
```

Use the production-like Compose stack to inspect deployment images and frontend reverse proxy behavior locally.

```bash
bun run docker:local
bun run docker:local:down
```

The distinction between development and deployment environments is documented in [docs/containerization.md](docs/containerization.md).

## Data example

`packages/platform` provides a small Map-based `InMemoryDatabase` abstraction. The `modules/order` Repository uses it, and the public API process owns the single store. Admin requests go through `internal-api` to the public API, so reservation creation and operations queries use the same store.

The process resets to seed data on restart. When extending this template for a real service, replace only the Repository implementation with PostgreSQL, SQLite, or another database while keeping the contracts and Service layer stable.

## Extending the template

```bash
bun run generate:module coupon
bun run generate:app worker
```

Define the contract first, then implement the server/client/testing public entrypoints and connect them in the composition root. Lock new dependency directions with `bun run test:architecture`, and update mappers, client parsers, fixtures, and related tests whenever an API contract changes.
