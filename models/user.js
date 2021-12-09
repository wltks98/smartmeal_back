'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    user_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
        unique:true
      },

    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt:{  //암호화에 필요함
      type: DataTypes.STRING
    },

    gender: {
        type: DataTypes.STRING,
        defaultValue:"남자"
      },
    
      birth: {
        type: DataTypes.DATE
        
      },
    
      height: {
        type: DataTypes.FLOAT,
        defaultValue:175
      },
    
      weight: {
        type: DataTypes.FLOAT,
        defaultValue:75
      },
    
      muscle: {
        type: DataTypes.FLOAT,
        defaultValue:40
      },
    
      fat: {
        type: DataTypes.FLOAT,
        defaultValue:15
      },
      inbody_type: {
        type: DataTypes.STRING,
        defaultValue:"표준체중 강인형"
      },
      recent_login: {
        type: DataTypes.DATE
        
      }
      


      
  });
  return user;
};