'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  var bag = sequelize.define('bag', {
    
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    item_name: {
          type: DataTypes.STRING,
          allowNull: false,   
    },
    item_count: {
      type: DataTypes.INTEGER,
    },
    item_price: {
      type: DataTypes.INTEGER,
    },

    
  });
  return bag;
};
