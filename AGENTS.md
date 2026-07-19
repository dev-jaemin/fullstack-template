# Stayline Full-Stack Monorepo

## 구조

- `apps/`: 실행·배포 단위. `web`, `admin`, `api`, `internal-api`, `cli`, `agent`가 있다.
- `modules/`: 비즈니스 문맥. 각 모듈은 `contract`, `server`, `client`, `testing` public entrypoint를 제공한다.
- `packages/`: 비즈니스에 종속되지 않는 UI, 플랫폼, 설정, 테스트 도구.
- `tooling/`: architecture 검사와 생성기.

## 의존성 규칙

- 웹/관리자 앱은 모듈의 `client`, `contract`만 사용한다.
- API 앱은 모듈의 `server`, `contract`만 사용한다.
- 모듈 내부 영역은 같은 모듈의 contract만 공유한다.
- 다른 모듈은 contract만 참조할 수 있다.
- `packages/ui`, `packages/platform`은 모듈이나 앱을 참조하지 않는다.
- `src` deep import와 상대 경로를 통한 package boundary 침범은 금지한다.

## 새 코드 위치

화면과 앱 shell은 `apps/*`, 도메인 규칙과 API 계약은 `modules/*`, 재사용 UI·플랫폼은 `packages/*`에 둔다.
Controller에는 HTTP 변환만, Service에는 use case만, Repository에는 데이터 접근만 둔다.

## 명령

```bash
bun install
bun run dev
bun run build
bun run lint
bun run typecheck
bun run test
bun run test:architecture
bun run verify
```

## 완료 조건

새 기능은 Zod contract, unit/contract test, 필요한 화면 상태와 문서를 함께 갱신한다. 전체 `bun run verify`가 통과해야 한다.

## 금지 패턴

Next.js/SSR, `any`, lint disable, 임의의 raw color, generic base service/repository, 프론트의 server import,
백엔드의 client import, repository entity 직접 응답, 모듈 내부 deep import를 추가하지 않는다.

## contract 변경 체크리스트

contract를 바꾸면 server mapper/controller, client API/query, fixture/MSW handler, CLI/Agent 입력과 관련 테스트를 함께 확인한다.
