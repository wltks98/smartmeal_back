# smartmeal_back

routes에서 users.js파일에 사용자 관련 api  
localhost:8080/users/~ 로 접근



# 모듈 설치 및 터미널 입력

npm install –g express-generator  
npm install  
npm install -g sequelize-cli  
sequelize init  
npm install --save express-session  

# DB 설정

food2.sql database에 넣고,
db.database.js pw설정
config/config.json에서 db pw설정 
port# :  3306

# DB 새로 생성해야 함
create table pay(
user_id varchar(255) primary key not null,
customer_id varchar(255)
);

create table card(
customer_id varchar(255) not null,
card_id varchar(255) primary key not null
);
