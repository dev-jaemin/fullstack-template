# Containerization

각 실행 단위는 루트 디렉터리를 build context로 사용해 독립적으로 빌드할 수 있습니다.

```bash
docker build -f apps/api/Dockerfile -t stayline-api .
docker build -f apps/internal-api/Dockerfile -t stayline-internal-api .
docker build -f apps/web/Dockerfile -t stayline-web .
docker build -f apps/admin/Dockerfile -t stayline-admin .
```

API 컨테이너는 `3000`, Internal API 컨테이너는 `3001`, SPA 컨테이너는 nginx의 `80` 포트를 사용합니다.
모든 Dockerfile은 Bun 기반 build stage와 별도 runtime stage를 사용하며 `PARTNER_PHASE` build arg를 받을 수 있습니다.

```bash
docker build --build-arg PARTNER_PHASE=stage -f apps/api/Dockerfile -t stayline-api:stage .
docker run --rm -p 3000:3000 stayline-api:stage
```

## 로컬 실행

로컬 개발의 기본 실행은 Bun 프로세스입니다.

```bash
bun run dev
```

Docker에서 Bun 버전과 workspace 의존성만 고정하고, 서버는 호스트의 Bun 프로세스로 실행하려면 다음 명령을 사용합니다.
Docker 컨테이너는 `bun install`이 끝나면 종료되고, 이어서 호스트에서 `bun dev`가 실행됩니다.

```bash
bun run docker:dev
```

의존성만 준비하려면 다음 명령을 사용합니다.

```bash
bun run docker:deps
```

- Web: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Public API: `http://localhost:3000/api/health`
- Internal API: `http://localhost:3001/api/health`

예약 데이터는 `./.data/orders.json`에 저장되므로 두 API 프로세스에서 공유되고 Bun 프로세스를 재시작해도 유지됩니다.

배포 이미지와 동일한 빌드 결과물을 로컬에서 확인하려면 production-like Compose를 사용합니다.
프론트 컨테이너의 `/api` 요청은 Compose 내부 네트워크에서 public API와 internal API로 전달됩니다.

```bash
bun run docker:local
```

- Web: `http://localhost:5173`
- Admin: `http://localhost:5174`
- Public API: `http://localhost:3000/api/health`
- Internal API: `http://localhost:3001/api/health`

종료할 때는 다음 명령을 사용합니다.

```bash
bun run docker:local:down
```

초기 데이터까지 지우고 다시 시작하려면 다음 파일을 삭제합니다.

```bash
rm -f .data/orders.json
```

production-like Compose에서는 `order_data` named volume을 두 API 컨테이너가 공유합니다.
프론트 컨테이너의 `/api` 요청은 배포 환경의 reverse proxy 또는 ingress가 API 컨테이너로 전달해야 합니다.
