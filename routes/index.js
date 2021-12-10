var express = require('express');
var router = express.Router();
const models = require("../models");

//필터 디폴트값
router.get("/filter_default",async function(req,res,next){

  let session=req.session;

  if(!session.user_id){
    return res.json({
      min_tan:0,
      min_dan:0,
      min_ji:0,
      max_tan:100,
      max_dan:100,
      max_ji:100,
      max_cal:1000,
      min_cal:0
    })
  }

  let user=models.user.findOne({
    where: {user_id : session.user_id}
  })
  .catch( err => { 
    console.log(err);
    return res.send({msg:false})
  });

  let inbody_type=user.inbody_type;

  let min_tan,min_dan,min_ji;
  let max_tan,max_dan,max_ji;
  let max_cal,min_cal;

  if (inbody_type=='저체중 허약형'){
    
    min_tan=3;
    max_tan=30;

    min_dan=10;
    max_dan=30;

    min_ji=0;
    max_ji=20;


    min_cal=0;
    max_cal=300;
  }
  else if(inbody_type=='과체중 비만형'){

    min_tan=0;
    max_tan=12;

    min_dan=10;
    max_dan=30;

    min_ji=0;
    max_ji=6;

    min_cal=0;
    max_cal=150;
  }
  else{
    min_tan=3;
    max_tan=20;

    min_dan=10;
    max_dan=30;

    min_ji=0;
    max_ji=15;

    min_cal=0;
    max_cal=200;
  }

  

  res.json({
    min_tan:min_tan,
    min_dan:min_dan,
    min_ji:min_ji,
    max_tan:max_tan,
    max_dan:max_dan,
    max_ji:max_ji,
    max_cal:max_cal,
    min_cal:min_cal
  })

  

})


module.exports = router;
