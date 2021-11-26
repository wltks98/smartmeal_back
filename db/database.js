const mysql = require("mysql2");

// import mysql from "mysql2";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "smartmeal",
  password: "sql2017920017",
});

// export const db = pool.promise();

db = pool.promise();

module.exports = db;
