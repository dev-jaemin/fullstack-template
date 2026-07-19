# 설계 결정

## In-memory repository

예제 앱이 별도 인프라 없이 실행되도록 선택했습니다. Repository interface를 유지하므로 실제 DB를 추가할 때 service와 contract를 흔들지 않고 교체할 수 있습니다.

## 모듈 public subpath

`contract`, `server`, `client`, `testing`만 export합니다. public API를 좁혀 deep import를 architecture test에서 차단합니다.

## 숙박 예약 예제

여기어때의 탐색 경험에서 영감을 얻되 상표·사진·실제 문구를 복제하지 않습니다. 상품은 숙소 목록, 주문은 예약 운영으로 모델링했습니다.
