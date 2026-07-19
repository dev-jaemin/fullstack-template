# Product module

작업 전 `docs/README.md`, `docs/requirements.md`, `docs/decisions.md`를 읽습니다.

- 책임: 숙박 상품의 contract, 조회 server use case, 재사용 가능한 client query, fixture.
- public entrypoint: `@repo/product/contract`, `/server`, `/client`, `/testing`.
- 다른 모듈의 server/client와 `src` deep import는 금지합니다.
- contract를 바꾸면 API mapper, client parser, fixture와 product unit test를 함께 수정합니다.
