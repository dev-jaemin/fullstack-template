# 결정

예약 상태는 `pending → confirmed | cancelled`만 허용합니다. 이 작은 상태 머신을 service unit test로 고정해 운영 화면에서 안전하게 재사용합니다.
