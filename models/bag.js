'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  var bag = sequelize.define('bag', {
    
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references:{model: 'user', key: 'user_id'}
      },
    item_id: {
          type: DataTypes.STRING,
          allowNull: false,
          references:{model: 'item', key: 'item_id'}
         
    },

      
  });
  return bag;
};