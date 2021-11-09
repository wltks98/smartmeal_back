var express = require('express');
var router = express.Router();
const models = require("../models");
const crypto = require('crypto');

//회원가입
router.get('/sign_up', function(req, res, next) {
  res.render("user/signup");
});


router.post("/sign_up", async function(req,res,next){
  let body = req.body;
  
  let user=await models.user.findOne({
    where: {user_id : body.user_id}
  });


  let salt = Math.round((new Date().valueOf() * Math.random())) + ""; //암호화에 필요
  let hashPassword = crypto.createHash("sha512").update(body.password + salt).digest("hex"); //암호화


  models.user.create({

    user_id:body.user_id,
    user_name: body.user_name,
    password: hashPassword,
    salt: salt,
    recent_login:new Date() //최신 로그인 날짜 갱신 

  }).then( result => {  
    return res.send({ msg:true })
  }).catch( err => { 
    return res.send({ msg:false })
  });

})


//아이디 중복확인
router.get('/check_id',async function(req, res, next) {
  
  let body = req.body;

  let user=await models.user.findOne({
    where: {user_id : body.user_id}
  });

  if (user!=undefined) { //아이디가 이미 있으면 
    return res.send({ msg:true })
  }

  else
    return res.send({ msg:false })
});


//닉네임 중복확인
router.get('/check_name',async function(req, res, next) {
  
  let body = req.body;

  let user=await models.user.findOne({
    where: {user_name : body.user_name}
  });

  if (user!=undefined) { //닉네임이 이미 있으면 
    return res.send({ msg:true })
  }
  else
    return res.send({ msg:false })
});


//로그인 GET
router.get('/login', function(req, res, next) {
  
  let session = req.session;

    res.render("user/login", {
        session : session
    });
});


// 로그인 POST
router.post("/login", async function(req,res,next){
  let body = req.body;

  let result = await models.user.findOne({
      where: {
          user_id : body.user_id
      }
  });

  let dbPassword = result.dataValues.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(body.password + salt).digest("hex");

  if(dbPassword === hashPassword){
      console.log("비밀번호 일치");
      // 세션 설정
      req.session.user_id = body.user_id;

      await models.user.update({
        recent_login:new Date()
    },{
      where: {user_id: body.user_id}
    })
    

  }
  else{
      console.log("비밀번호 불일치");
  }
  res.redirect("/users/login");
});


// 로그아웃
router.get("/logout", function(req,res,next){
  req.session.destroy();
  res.clearCookie('login_session');

  res.redirect("/users/login");
});


//수정
router.get("/update", function(req,res,next){

  let session = req.session;

  models.user.findOne({
    where: {user_id : session.user_id}
  })
  .then( result => {
    res.render("user/update", {
      user: result
    });
  })
  .catch( err => { 
    console.log("err");
    console.log("데이터 조회 실패");
  });

  
});


//수정
router.post("/update", function(req,res,next){

  let body = req.body;

  let salt = Math.round((new Date().valueOf() * Math.random())) + "";
  let hashPassword = crypto.createHash("sha512").update(body.password + salt).digest("hex");

  models.user.update({
      user_name: body.user_name,
      user_id: body.user_id,
      password: hashPassword,
      salt: salt
  },{
    where: {user_id: body.user_id}
  })
  .then( result => {
    console.log("데이터 수정 완료");
    res.redirect("/users/login");
  })
  .catch( err => {
    console.log("데이터 수정 실패");
  });


  //res.redirect("/users/login");
})


//탈퇴
router.get("/delete",async function(req,res,next){

  res.render("user/delete");
})


router.post("/delete",async function(req,res,next){

  let session=req.session;

  let body = req.body;

  let result = await models.user.findOne({
    where: {
        user_id : session.user_id
    }
  });

  let dbPassword = result.dataValues.password;
  let salt = result.dataValues.salt;
  let hashPassword = crypto.createHash("sha512").update(body.password + salt).digest("hex");

  if(dbPassword === hashPassword){
      console.log("비밀번호 일치");

      await models.user.destroy({
        where: {user_id : session.user_id}
     })
     .then( result => {
       req.session.destroy();
       res.clearCookie('login_session');
    
       console.log("데이터 삭제 완료");
       res.send("회원탈퇴");
     })
     .catch( err => {
       console.log("데이터 삭제 실패");
     });
    
    

  }

 
})


//회원정보 받는 api
router.get("/user_id",async function(req,res,next){



  res.render("user/search");
})



router.post("/user_id",async function(req,res,next){

  let body = req.body;
  let user_id=body.user_id;

  let user = await User.findOne({ user_id });

  res.render("user/user_infor",{user: user});
})


//인바디 입력
router.get("/inbody",async function(req,res,next){

  let session = req.session;



  models.user.findOne({
     user_id : session.user_id
   })
   .then( result => {
     console.log(result.user_id)
     res.render("user/inbody", {
       user: result
     });
   })
   .catch( err => {
     console.log(session.user_id);
     console.log("err");
     console.log("데이터 조회 실패");
   });

})



router.post("/inbody",async function(req,res,next){

  let session = req.session;

  let body = req.body;

  let user=await models.user.findOne({
    where: {user_id:session.user_id}
  });
  

  let w=Number(body.weight);
  let h=Number(body.height);
  let m=Number(body.muscle);
  let f=Number(body.fat);
  let g=body.gender;

  let ff,bb,mm; //1은 표준이하 2는 표준 3은 표준이상
  let inbody_type;


  let bmi=w/Math.pow((h/100),2);
  console.log(bmi);
  if (g=='남'){
    if(f<15.0)
      ff=1;
    else if(f>24.9)
      ff=3;
    else
      ff=2;
      
    if(bmi<18.5)
      bb=1;
    else if(bmi>24.9)
      bb=3;
    else
      bb=2;

    if(m<32.0)
      mm=1;
    else if(m>37.9)
      mm=3;
    else
      mm=2;
  }

  else if (g=='여'){
    if(f<25.0)
      ff=1;
    else if(f>34.9)
      ff=3;
    else
      ff=2;
      
    if(bmi<18.5)
      bb=1;
    else if(bmi>24.9)
      bb=3;
    else
      bb=2;

    if(m<26.5)
      mm=1;
    else if(m>32.4)
      mm=3;
    else
      mm=2;
  }

  if(bb==2){
    if(mm>=3)
      inbody_type="표준체중 강인형"; //근육이 많으면 무조건 강인
    else if(ff>=3)  
      inbody_type="표준체중 비만형"; //근육이 많지도 않은데 체지방이높으면 무조건 비만
    else if(mm==1)
      inbody_type="표준체중 허약형"; //근육이 적으면 무조건 허약
    else
      inbody_type="표준체중 표준형"; //나머지는 표준
  }

  else if(bb==1){
    if(mm==1)
      inbody_type="저체중 허약형";    
    else
      inbody_type="저체중 강인형"; 
  }

  if(bb==3){
    if(mm<=2)
      inbody_type="과체중 허약형"; 
    else if(mm==3 && ff<=2)  
      inbody_type="과체중 강인형"; 
    else if(mm==3 && ff==3)
      inbody_type="과체중 비만형"; 

  }


  await models.user.update({
    birth:body.birth,
    gender:body.gender,
    height:body.height,
    weight:body.weight,
    muscle:body.muscle,
    fat:body.fat,
    inbody_type:inbody_type
 },
 {
   where: {user_id: session.user_id}
 })
 .then( result => {
   console.log("데이터 수정 완료");
   res.render("user/inbody_result", {
    inbody_type:inbody_type
  });
 })
 .catch( err => {
   console.log("데이터 수정 실패");
 });

  
})



module.exports = router;
