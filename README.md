
angularTry2 프로젝트에서 사용가능한 Node 기반의 Rest Api 구성
File uplaod / Video File Stream / Chat socket 기능을 추가
각 기능은 ***Route.js 를 통해 접근 가능하며,
각 ****Route.js 에서 db접근은 models 에 정의된 스키마를 이용한다.


기초 골격은 아래 사이트 참고 하였습니다.
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


몽고디비 : sudo mongod -port 5050

s3멀터
sudo env NODE_EMV=development;
sudo env AWS_ACCESS_KEY_ID=******
sudo env AWS_SECRET_ACCESS_KEY=*****
 - > dotenv 페키지 이용
 -> Root 디렉토리에 환경변수 ".env" 명으로 파일 생성