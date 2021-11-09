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
        type: DataTypes.STRING
        
      },
    
      birth: {
        type: DataTypes.DATE
        
      },
    
      height: {
        type: DataTypes.FLOAT
        
      },
    
      weight: {
        type: DataTypes.FLOAT
        
      },
    
      muscle: {
        type: DataTypes.FLOAT
        
      },
    
      fat: {
        type: DataTypes.FLOAT
        
      },
      inbody_type: {
        type: DataTypes.STRING
        
      },
      recent_login: {
        type: DataTypes.DATE
        
      }
      


      
  });
  return user;
};