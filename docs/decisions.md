# 설계 결정

## In-memory database

예제 앱이 별도 인프라 없이 실행되도록 `packages/platform`에 Map 기반 `InMemoryDatabase`를 두었습니다. Public API가 단일 저장소를 소유하고 Internal API는 Public API를 proxy하므로 두 화면이 같은 주문 데이터를 조회합니다. 프로세스가 재시작되면 seed 데이터로 초기화됩니다.

Repository는 데이터 저장 구현을 캡슐화하므로 실제 DB를 추가할 때 Service와 contract를 흔들지 않고 교체할 수 있습니다.

## 모듈 public subpath

`contract`, `server`, `client`, `testing`만 export합니다. public API를 좁혀 deep import를 architecture test에서 차단합니다.

## 예제 도메인

상품과 주문 모듈은 contract, server, client, testing 경계를 설명하기 위한 예제 도메인입니다. 실제 서비스 콘텐츠나 외부 자산에 의존하지 않습니다.
