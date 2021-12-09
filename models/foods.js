const db = require("../db/database.js");


const SELECT = "SELECT * from food2";

async function getAll() {
  return db.execute(SELECT).then((result) => result[0]);
}

async function getByCode(code) {
  return db.execute(`${SELECT} where code=${code}`).then((result) => result[0]);
}

async function rateFood(code, rate) {
  let warningStatus = 1;

  db.execute(
    `update food2 set total_rate=total_rate+${rate},total_num=total_num+1 where code=${code}`
  ).then((result) => {
    if (result[0].warningStatus === 0) warningStatus = 0;
  });
  //이거 나중에 처리
  //warning Status 1일 때 처리
  //예외처리 더하기

  return db
    .execute(
      `update food2 set avg_rate = total_rate/total_num where code=${code}`
    )
    .then((result) => result[0]);
}

async function filterFood(filter, min, max) {
  return db
    .execute(`${SELECT} where ${min}<=${filter} and ${filter}<=${max}`)
    .then((result) => result[0]);
}

async function filtersFood(filter, min, max) {
  const filter_list = filter.split(",");
  const min_list = min.split(",");
  const max_list = max.split(",");
  const length = filter_list.length;
  let sql = "SELECT * from food2 where";

  for (let i = 0; i < length; i++) {
    if (i === 0) {
      sql =
        sql +
        ` ${min_list[i]} <= ${filter_list[i]} and ${filter_list[i]} <= ${max_list[i]}`;
    } else {
      sql =
        sql +
        ` and ${min_list[i]} <= ${filter_list[i]} and ${filter_list[i]} <= ${max_list[i]}`;
    }
  }

  return db.execute(sql).then((result) => result[0]);
}

module.exports.getAll = getAll;
module.exports.getByCode = getByCode;
module.exports.rateFood = rateFood;
module.exports.filterFood = filterFood;
module.exports.filtersFood = filtersFood;
