# Order module

작업 전 `docs/README.md`, `docs/requirements.md`, `docs/decisions.md`를 읽습니다.

- 책임: 숙박 예약의 contract, 상태 변경 server use case, client query/mutation, fixture.
- public entrypoint: `@repo/order/contract`, `/server`, `/client`, `/testing`.
- 다른 모듈의 server/client와 `src` deep import는 금지합니다.
- contract를 바꾸면 controller, mapper, client parser, fixture와 상태 전이 테스트를 함께 수정합니다.
