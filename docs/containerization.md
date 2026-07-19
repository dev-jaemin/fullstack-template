# Containerization

각 실행 단위는 루트 디렉터리를 build context로 사용해 독립적으로 빌드할 수 있습니다. production Dockerfile은 빌드 이미지와 runtime 이미지를 분리합니다.

```bash
docker build -f apps/api/Dockerfile -t template-api .
docker build -f apps/internal-api/Dockerfile -t template-internal-api .
docker build -f apps/web/Dockerfile -t template-web .
docker build -f apps/admin/Dockerfile -t template-admin .
```

API는 `3000`, Internal API는 `3001`, SPA runtime은 nginx `80` 포트를 사용합니다. `PARTNER_PHASE` build arg를 전달할 수 있습니다.

## 개발 환경

개발 서버는 호스트 Bun 프로세스로 실행합니다.

```bash
bun run dev
```

Docker는 Bun 버전과 workspace 의존성만 고정하는 용도로 사용합니다. `docker-compose.dev.yml`의 `deps` 서비스는 루트 workspace에 `bun install --frozen-lockfile`을 실행한 뒤 종료하며, 서버를 시작하지 않습니다.

```bash
bun run docker:deps
bun run dev
```

두 단계를 한 번에 실행하려면 다음 명령을 사용합니다.

```bash
bun run docker:dev
```

## API 연결

- Web `5173`의 `/api`는 Vite proxy를 통해 Public API `3000`으로 전달됩니다.
- Admin `5174`의 `/api`는 Vite proxy를 통해 Internal API `3001`으로 전달됩니다.
- Internal API는 `PUBLIC_API_ORIGIN`으로 Public API에 요청을 전달합니다.
- Public API의 `InMemoryDatabase`가 주문 저장소의 단일 소유자입니다.

따라서 Web에서 생성한 예약은 `5173 → 3000 → InMemoryDatabase`로 저장되고, Admin에서는 `5174 → 3001 → 3000 → 같은 InMemoryDatabase`로 조회됩니다. 프로세스를 재시작하면 seed 데이터로 초기화됩니다.

## Production-like Compose

배포 이미지와 프론트 reverse proxy까지 로컬에서 확인하려면 다음을 사용합니다.

```bash
bun run docker:local
bun run docker:local:down
```

이 Compose는 `web`, `admin`, `api`, `internal-api` runtime 컨테이너를 실행합니다. Internal API는 Compose service 이름 `api:3000`을 통해 Public API를 호출합니다.
