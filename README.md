Todo 현재 구현된 Spring 기반의 api 를 Node 기반으로 변경 예정
기존 사용중인 셈플 API 제거
이후 README.MD 새로운 프로젝트 정보로 업데이트


아래 사이트 참고 하였습니다.
## RESTful API using MongoDB & Mongoose & Express
VELOPERT 블로그에 작성한 강좌에 사용된 프로젝트 입니다.  
MongoDB, Mongoose 와 Express 를 사용하여 간단한 RESTful API 를 구현합니다.  


```
$ npm install
$ node app.js
```

### API 목록
| ROUTE                     | METHOD | DESCRIPTION               |
|---------------------------|--------|---------------------------|
| /api/books                | GET    | 모든 book 데이터 조회     |
| /api/books/:book_id       | GET    | _id 값으로 데이터 조회    |
| /api/books/author/:author | GET    | author 값으로 데이터 조회 |
| /api/books                | POST   | book 데이터 생성          |
| /api/books/:book_id       | PUT    | book 데이터 수정          |
| /api/books/:book_id       | DELETE | book 데이터 제거          |

링크: https://velopert.com/594

psuh
