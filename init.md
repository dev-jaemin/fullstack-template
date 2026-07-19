# TypeScript Full-Stack Monorepo Template 구축

확장 가능한 TypeScript 기반 풀스택 모노레포 템플릿을 구축하라.

이 프로젝트는 당장 특정 서비스를 개발하기 위한 것이 아니라, 향후 다양한 서비스 개발에 재사용할 수 있는 **포트폴리오 겸 범용 템플릿 레포**다.

프론트엔드, 백엔드, CLI, AI Agent처럼 실행 방식이 다른 애플리케이션들이 하나의 모노레포 안에서 동일한 타입, 런타임 스키마, 개발 규칙과 검증 도구를 공유하는 구조를 목표로 한다.

지나치게 복잡한 엔터프라이즈 아키텍처를 미리 구현하지 말되, 서비스가 성장했을 때 도메인 모듈이나 백엔드 애플리케이션을 자연스럽게 분리할 수 있어야 한다.

---

## 1. 핵심 철학

다음 원칙을 구조와 도구로 강제하라.

1. 모든 애플리케이션과 패키지는 TypeScript를 사용한다.
2. 실행 및 배포 단위는 `apps`가 소유한다.
3. 비즈니스 기능과 관련 문맥은 `modules`가 소유한다.
4. 프론트엔드와 백엔드는 Zod 기반 contract를 공유한다.
5. 타입만 공유하지 말고 API 입력, 응답, 에러, 테스트 fixture를 하나의 Zod 스키마에서 파생한다.
6. 프론트엔드가 서버 구현을 import하지 못하게 한다.
7. 백엔드가 프론트엔드 구현을 import하지 못하게 한다.
8. 다른 비즈니스 모듈의 내부 구현에는 직접 의존하지 않는다.
9. 앱은 가능한 한 얇은 composition root로 유지한다.
10. 새로운 코드가 기존 스타일과 아키텍처를 벗어나면 lint 또는 architecture test가 실패해야 한다.
11. AI Agent가 수정하기 쉬우면서도 구조를 망가뜨리기 어려운 하네스를 제공한다.
12. 불필요한 추상화, 범용 Base 클래스, generic repository, 과도한 레이어 분리는 피한다.

---

## 2. 기술 스택

### 공통

* Runtime 및 package manager: Bun
* Monorepo task orchestration: 적절한 도구를 선택하되 Bun workspace와 잘 동작하게 구성
* Language: TypeScript
* Runtime schema 및 contract: Zod
* Lint: ESLint flat config
* Formatter: Prettier
* Unit test: Vitest
* Git hooks가 필요하다면 lefthook 등 Bun 친화적인 도구 사용
* 모든 내부 패키지는 workspace dependency로 연결

### 프론트엔드

* React
* Vite
* 정적 CSR SPA
* React Router
* TanStack Query
* React Hook Form
* Zod resolver
* Tailwind CSS
* shadcn/ui
* Lucide Icons

SSR, React Server Component, Next.js는 사용하지 않는다.

### 백엔드

* NestJS
* REST API
* Zod 기반 request/response validation
* 업계에서 익숙하게 이해할 수 있는 MVC 기반 구조
* Controller, Service, Repository의 책임을 명확히 분리
* Controller에 비즈니스 로직을 작성하지 않는다.
* Service에서 HTTP 객체에 의존하지 않는다.
* Repository 외부에서 직접 DB client를 호출하지 않는다.

실제 데이터베이스가 필요하다면 템플릿 시연에 적합한 가벼운 구성을 선택하되, DB 구현이 전체 구조의 중심이 되지 않게 한다. 예제 구동을 위해 in-memory repository를 사용해도 된다.

---

## 3. 목표 디렉터리 구조

다음 구조를 기본으로 구성하라.

```text
.
├─ apps/
│  ├─ web/
│  ├─ admin/
│  ├─ api/
│  ├─ internal-api/
│  ├─ cli/
│  └─ agent/
│
├─ modules/
│  ├─ order/
│  └─ product/
│
├─ packages/
│  ├─ ui/
│  ├─ platform/
│  ├─ config/
│  └─ testkit/
│
├─ tooling/
│  ├─ architecture/
│  ├─ generators/
│  └─ scripts/
│
├─ docs/
├─ AGENTS.md
├─ bunfig.toml
├─ package.json
└─ README.md
```

모든 앱을 완전한 제품 수준으로 구현할 필요는 없다.

다만 아래 앱은 실제로 실행 가능해야 한다.

* `apps/web`
* `apps/admin`
* `apps/api`
* `apps/internal-api`
* `apps/cli`
* `apps/agent`

CLI와 Agent는 작은 예제 기능만 있어도 되지만 빌드, 타입 검사, 테스트가 정상 동작해야 한다.

---

## 4. 비즈니스 모듈 구조

`order`, `product` 두 개의 예제 모듈을 작성한다.

각 모듈은 하나의 workspace package로 만들고 subpath export를 제공한다.

예시:

```text
modules/order/
├─ docs/
│  ├─ README.md
│  ├─ requirements.md
│  └─ decisions.md
│
├─ src/
│  ├─ contract/
│  ├─ server/
│  ├─ client/
│  └─ testing/
│
├─ AGENTS.md
├─ module.config.ts
├─ package.json
└─ tsconfig.json
```

외부에서는 다음과 같은 방식으로만 접근하게 한다.

```ts
import { OrderSchema } from "@repo/order/contract";
import { OrderModule } from "@repo/order/server";
import { useOrders } from "@repo/order/client";
import { createOrderFixture } from "@repo/order/testing";
```

`src` 내부를 직접 import하는 deep import는 금지한다.

### Contract

`contract`에는 다음을 둔다.

* 핵심 API 모델
* 요청 스키마
* 응답 스키마
* API 에러 스키마
* query parameter 스키마
* 필요한 경우 event 스키마
* Zod 스키마에서 추론한 TypeScript 타입

TypeScript interface와 Zod schema를 별도로 중복 선언하지 않는다.

```ts
export const OrderSchema = z.object({
  id: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  status: z.enum(["pending", "confirmed", "cancelled"]),
});

export type Order = z.infer<typeof OrderSchema>;
```

### Server

NestJS 기반 MVC 구조를 사용한다.

```text
server/
├─ controllers/
├─ services/
├─ repositories/
├─ models/
├─ mappers/
└─ order.module.ts
```

단순한 예제에 불필요한 DDD 계층을 억지로 추가하지 않는다.

다음 의존 방향을 지킨다.

```text
Controller → Service → Repository
                 ↓
              Contract
```

* Controller는 HTTP 입출력과 validation만 담당
* Service는 use case 및 비즈니스 로직 담당
* Repository는 데이터 접근 담당
* API response에 repository entity를 그대로 노출하지 말고 mapper를 둔다.
* NestJS decorator와 framework 코드는 server 영역 밖으로 퍼뜨리지 않는다.

### Client

React 기반 코드를 둔다.

```text
client/
├─ api/
├─ queries/
├─ mutations/
├─ hooks/
├─ components/
├─ models/
└─ index.ts
```

* API client는 contract schema로 실제 응답을 검증한다.
* TanStack Query의 query key를 중앙 관리한다.
* 서버 DTO와 화면용 view model의 구분이 필요하면 mapper를 둔다.
* 앱 전용 routing과 layout은 client 모듈에 두지 않는다.
* 고객용과 관리자용 UI가 크게 다르면 `client/web`, `client/admin`처럼 분리할 수 있다.
* 무리하게 하나의 거대한 configurable component로 합치지 않는다.

### Testing

다음을 제공한다.

* Zod schema를 통과하는 fixture factory
* MSW handler
* 모듈 unit test helper
* 필요하다면 테스트 builder

fixture는 contract와 별도의 임의 타입을 정의하지 않는다.

---

## 5. 애플리케이션 역할

### `apps/web`

* Vite 기반 고객용 SPA
* `order/client`, `product/client`를 소비
* 라우팅, 앱 shell, 전역 provider, 앱 단위 인증과 navigation 담당
* 비즈니스 계약이나 API 타입을 앱 내부에서 다시 선언하지 않는다.

### `apps/admin`

* Vite 기반 관리자용 SPA
* 고객용 앱과 다른 정보 밀도와 레이아웃 사용
* 같은 contract와 API client를 공유하되 화면은 독립적으로 구성
* 단순히 web 앱의 색상만 바꾼 복제본으로 만들지 않는다.

### `apps/api`

* 공개 API 역할의 NestJS 앱
* order와 product의 server module을 조립
* bootstrap, global filter, global pipe, logging, CORS 등 앱 수준 설정만 소유

### `apps/internal-api`

* 내부 운영 API 역할의 NestJS 앱
* admin 프론트가 사용할 관리용 endpoint 예제 제공
* 메인 API와 동일한 server service 또는 repository를 재사용할 수 있도록 구성
* 공개 API와 내부 API의 controller는 필요에 따라 분리한다.

### `apps/cli`

Bun 기반 CLI 예제를 구현한다.

예:

```bash
bun run cli orders:list
bun run cli products:list
```

* contract schema를 재사용한다.
* 필요한 경우 공통 API client를 사용한다.
* CLI 전용 DTO를 불필요하게 다시 만들지 않는다.

### `apps/agent`

작은 AI Agent 또는 tool 실행기 형태의 예제를 구현한다.

실제 외부 LLM API key 없이도 실행 및 테스트할 수 있어야 한다.

예:

* order 조회 tool
* product 검색 tool
* 입력 스키마를 Zod contract에서 재사용
* tool registry 또는 mock agent runner 제공

Agent tool input, API input, CLI input이 동일한 의미를 가질 경우 동일한 Zod schema를 재사용하는 모습을 보여준다.

---

## 6. 예제 기능과 페이지

예제 도메인은 `product`와 `order`를 사용한다.

실제 동작하는 화면은 2개 정도면 충분하다.

### 고객용 Product Catalog 페이지

`apps/web`에 구현한다.

기능:

* 상품 목록 조회
* 이름 검색
* 상태 또는 카테고리 필터
* 상품 카드 또는 테이블 표시
* loading, empty, error 상태
* 상품을 선택해 간단한 주문 생성
* 생성 성공 및 실패 피드백

이 페이지는 `product/client`와 `order/client`를 함께 소비한다.

### 관리자용 Order Operations 페이지

`apps/admin`에 구현한다.

기능:

* 주문 목록 조회
* 상태 필터
* 주문 상세 확인
* pending 주문 confirm 또는 cancel
* mutation 후 목록 갱신
* loading, empty, error 상태
* 운영 화면에 적합한 정보 밀도 높은 UI

두 페이지 모두 실제 API와 연결돼야 한다.

---

## 7. 디자인 시스템

단순히 shadcn component를 가져다 배치하는 수준을 넘어서, 모던한 디자인 시스템 구조를 보여줘야 한다.

`packages/ui`에서 공통 UI와 디자인 토큰을 관리한다.

```text
packages/ui/
├─ src/
│  ├─ components/
│  ├─ foundations/
│  ├─ patterns/
│  ├─ styles/
│  └─ index.ts
├─ components.json
└─ package.json
```

### 디자인 토큰

CSS variable 기반 토큰을 사용한다.

최소한 다음 토큰 계층을 구현한다.

* primitive color
* semantic color
* background
* foreground
* surface
* muted
* border
* primary
* secondary
* accent
* success
* warning
* destructive
* focus ring
* radius
* spacing
* shadow
* typography

컴포넌트에서 임의의 hex 값이나 `text-gray-500` 같은 raw color 사용을 남발하지 않는다.

가능한 한 다음처럼 semantic token을 사용한다.

```tsx
<div className="bg-surface text-foreground border-border" />
```

다크 모드도 토큰 치환만으로 자연스럽게 지원한다.

### Typography

* UI에 적합한 현대적인 sans-serif font stack 사용
* heading, title, body, label, caption 등 typography 역할 정의
* 글꼴 크기만 바꾸는 것이 아니라 line-height와 weight까지 일관되게 관리
* 숫자와 데이터 표시를 고려한 tabular number 지원

### UI 패턴

다음 공통 패턴을 제공한다.

* App shell
* Page header
* Section header
* Empty state
* Error state
* Loading skeleton
* Status badge
* Data table
* Filter bar
* Form field
* Confirmation dialog
* Toast 또는 notification

무분별한 gradient, glassmorphism, 과한 animation을 사용하지 않는다.

포트폴리오에 적합하도록 세련되고 정돈된 화면을 만들되, 실제 SaaS 제품처럼 명확하고 실용적으로 보이게 한다.

고객용 앱과 관리자용 앱은 동일한 디자인 토큰을 공유하지만 다음처럼 성격을 다르게 한다.

* 고객용: 여백이 있고 시각적 탐색이 쉬운 구성
* 관리자용: 정보 밀도가 높고 작업 효율 중심의 구성

---

## 8. 의존성 경계

의존성 규칙을 문서로만 작성하지 말고 ESLint 또는 architecture test로 강제한다.

최소한 다음 규칙을 적용한다.

```text
apps/web
apps/admin
  → modules/*/client 허용
  → modules/*/contract 허용
  → modules/*/server 금지

apps/api
apps/internal-api
  → modules/*/server 허용
  → modules/*/contract 허용
  → modules/*/client 금지

modules/*/client
  → 같은 모듈 contract 허용
  → 모든 server import 금지

modules/*/server
  → 같은 모듈 contract 허용
  → 모든 client import 금지

모듈 A
  → 모듈 B의 contract 참조 허용
  → 모듈 B의 server/client 내부 구현 참조 금지

packages/ui
  → modules와 apps에 의존 금지

packages/platform
  → 특정 비즈니스 모듈에 의존 금지
```

다음 패턴은 CI에서 실패해야 한다.

```ts
import { OrderService } from "@repo/order/server"; // web에서 금지
import { OrderTable } from "@repo/order/client"; // api에서 금지
import { ProductRepository } from "@repo/product/server"; // order server에서 금지
import { something } from "@repo/order/src/internal"; // deep import 금지
```

순환 의존성 검사도 포함한다.

---

## 9. ESLint와 코딩 스타일

ESLint를 강하게 구성한다.

flat config를 사용하고 공통 설정은 `packages/config` 또는 이에 준하는 위치에서 공유한다.

다음 규칙을 포함한다.

* Type-aware lint
* `any` 기본 금지
* unsafe assignment, call, member access 금지
* floating promise 금지
* misused promise 금지
* 불필요한 type assertion 금지
* non-null assertion 금지
* 사용하지 않는 import 및 변수 금지
* import 정렬
* type import 일관성
* 상대 경로를 통한 패키지 경계 침범 금지
* default export는 프레임워크 진입점 등 필요한 곳만 허용
* console 사용 제한
* switch exhaustive 검사
* React hook 규칙
* 접근성 관련 JSX 규칙
* 테스트 파일에만 제한적인 예외 허용

코딩 스타일은 가장 무난하고 익숙한 형태를 사용한다.

* 작은 따옴표
* 세미콜론 사용
* trailing comma 사용
* 2-space indentation
* 명확한 이름 사용
* 지나치게 짧은 축약어 금지
* 한 파일에 여러 책임을 과도하게 넣지 않기
* class는 Nest service, controller, repository 등 적절한 경우에 사용
* 프론트 유틸과 상태 변환은 함수 중심
* barrel export는 public entrypoint에서만 제한적으로 사용

lint를 통과하기 위해 무분별한 disable comment를 추가하지 않는다.

`eslint-disable`, `@ts-ignore`, `@ts-nocheck`는 원칙적으로 금지한다.

`@ts-expect-error`는 이유를 적은 경우에만 제한적으로 허용한다.

---

## 10. TypeScript 설정

엄격한 TypeScript 설정을 사용한다.

최소한 다음 옵션을 검토하고 가능한 한 활성화한다.

```json
{
  "strict": true,
  "noUncheckedIndexedAccess": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitOverride": true,
  "noImplicitReturns": true,
  "noFallthroughCasesInSwitch": true,
  "noPropertyAccessFromIndexSignature": true,
  "useUnknownInCatchVariables": true,
  "noUncheckedSideEffectImports": true,
  "forceConsistentCasingInFileNames": true
}
```

브라우저, Node/Bun, 테스트 환경별 tsconfig를 적절히 분리한다.

프론트 코드에 Node 전용 타입이 유입되지 않게 한다.

---

## 11. 테스트 전략

다음을 구현한다.

### Unit test

* Order service의 상태 변경
* Product filtering 또는 search
* View model mapper
* Zod validation

### Contract test

* 백엔드 응답이 contract schema를 만족하는지 검사
* API 요청과 응답 status가 선언된 contract와 맞는지 검사
* MSW fixture가 contract schema를 통과하는지 검사

### Architecture test

* 금지된 import 검출
* deep import 검출
* 순환 의존성 검출
* app/client/server 경계 위반 검출

### Frontend test

* loading
* empty
* error
* success
* mutation

모든 화면을 과도하게 테스트할 필요는 없지만, 예제 테스트를 보고 이후 패턴을 복제할 수 있어야 한다.

---

## 12. 하네스 엔지니어링

AI coding agent가 레포 구조를 쉽게 이해하고 검증할 수 있도록 구성한다.

### 루트 `AGENTS.md`

다음을 간결하게 포함한다.

* 레포 구조
* 의존성 규칙
* 새 코드의 위치를 결정하는 기준
* 빌드, 테스트, lint 명령
* 작업 완료 조건
* 금지 명령과 금지 패턴
* contract 변경 시 함께 확인할 영역

### 모듈별 `AGENTS.md`

`modules/order`, `modules/product`에 각각 둔다.

* 작업 전 읽어야 할 문서
* 모듈의 책임
* public entrypoint
* contract 변경 규칙
* 테스트 요구사항

### 생성기

최소한 다음 generator 또는 scaffold script를 제공한다.

```bash
bun run generate:module coupon
bun run generate:app worker
```

완벽한 범용 generator일 필요는 없지만, 생성된 결과가 현재 구조와 lint 규칙을 따르게 한다.

---

## 13. 명령어

루트에서 다음 명령이 동작해야 한다.

```bash
bun install
bun run dev
bun run dev:web
bun run dev:admin
bun run dev:api
bun run build
bun run lint
bun run typecheck
bun run test
bun run test:architecture
bun run verify
```

`bun run verify`는 최소한 다음을 순서대로 실행한다.

```text
format check
lint
typecheck
unit and contract tests
architecture tests
build
```

가능하다면 변경된 프로젝트만 검사하는 명령도 제공한다.

```bash
bun run verify:affected
```

---

## 14. README

README는 포트폴리오에서 바로 보여줄 수 있는 수준으로 작성한다.

다음을 포함한다.

* 프로젝트가 해결하려는 문제
* 핵심 아키텍처 철학
* 전체 구조 다이어그램
* apps와 modules의 차이
* Zod contract 공유 방식
* 의존성 흐름
* 예제 화면 소개
* 실행 방법
* 검증 명령
* 새로운 모듈 추가 방법
* 서비스 성장 시 확장 방향

아키텍처 다이어그램은 Mermaid를 사용해도 된다.

README에 기술을 많이 사용했다는 사실만 나열하지 말고, 각 선택이 어떤 문제를 해결하는지 설명한다.

---

## 15. 금지사항

다음을 하지 않는다.

* Next.js 사용
* SSR 도입
* 모든 코드를 `packages/shared`에 넣기
* Zod schema와 TypeScript interface 중복 선언
* 프론트에서 백엔드 entity 공유
* 백엔드 repository model을 API response로 직접 노출
* generic base controller/service/repository 생성
* 불필요한 CQRS 또는 event sourcing 도입
* 모든 파일에 interface를 만들기
* 서비스 locator 또는 전역 mutable singleton 사용
* 의미 없는 추상화 레이어 추가
* lint 오류를 disable comment로 회피
* 데모를 위해 과도한 mock data와 복잡한 seed 작성
* UI에 임의 hex color 남발
* shadcn 기본 화면을 그대로 복사한 듯한 디자인
* 고객용 앱과 관리자용 앱을 사실상 동일하게 구현
* 구현되지 않은 기능을 README에서 완료된 것처럼 설명

---

## 16. 완료 조건

다음 조건을 모두 만족해야 작업이 완료된 것이다.

1. `bun install`이 성공한다.
2. 모든 앱이 개발 모드에서 실행된다.
3. 고객용 Product Catalog 페이지가 실제 API와 연결된다.
4. 관리자용 Order Operations 페이지가 실제 API와 연결된다.
5. CLI 예제가 동작한다.
6. Agent tool 예제가 동작하거나 테스트 가능하다.
7. Zod contract가 프론트, 백엔드, CLI, Agent에서 실제로 재사용된다.
8. 의도적인 경계 위반이 ESLint 또는 architecture test에서 검출된다.
9. 디자인 토큰과 semantic color가 적용된다.
10. 고객용과 관리자용 화면의 성격이 명확히 다르다.
11. loading, empty, error, success 상태가 구현된다.
12. `bun run verify`가 성공한다.
13. 루트 README와 AGENTS.md가 작성된다.
14. 중요 설계 결정과 향후 확장 방향이 문서화된다.
15. 불필요한 추상화나 미사용 scaffold가 남아 있지 않다.

---

## 17. 작업 방식

먼저 현재 디렉터리를 확인하고 전체 구현 계획을 간단히 작성한 뒤 작업하라.

작업 중 다음 원칙을 따른다.

1. 구조와 공통 설정을 먼저 만든다.
2. Zod contract를 먼저 정의한다.
3. 백엔드 API와 repository를 구현한다.
4. 프론트 API client와 query를 연결한다.
5. 공통 디자인 시스템을 적용한다.
6. CLI와 Agent가 같은 contract를 재사용하게 한다.
7. architecture rule을 구현한다.
8. 테스트와 문서를 작성한다.
9. 마지막에 전체 검증을 실행한다.

완료 후 다음을 보고하라.

* 최종 디렉터리 구조
* 주요 아키텍처 결정
* 구현한 예제 기능
* 디자인 시스템 구성
* 의존성 경계 강제 방식
* 실행한 검증 명령과 결과
* 의도적으로 구현하지 않은 범위
* 향후 규모가 커졌을 때의 분리 방향

작업 중 요구사항과 충돌하지 않는 사소한 결정은 스스로 합리적으로 판단하라. 질문을 반복하기보다 일관된 기본값을 선택하고 그 이유를 최종 보고에 남겨라.
