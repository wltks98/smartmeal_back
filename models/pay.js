const db = require("../db/database.js");

async function createCustomer(user_id, customer_id) {
  return db
    .execute(`insert into pay values ("${user_id}","${customer_id}") `)
    .then((result) => result[0]);
}

async function getByUserId(user_id) {
  return db
    .execute(`select customer_id from pay where user_id="${user_id}"`)
    .then((result) => result[0]);
}

async function createCard(customer_id, card_id) {
  return db
    .execute(`insert into card values("${customer_id}","${card_id}")`)
    .then((result) => result[0]);
}

async function deleteCard(customer_id, card_id) {
  return db
    .execute(
      `delete from card where customer_id="${customer_id}" and card_id="${card_id}"`
    )
    .then((result) => result[0]);
}

async function getCardList(customer_id) {}

module.exports.deleteCard = deleteCard;
module.exports.createCard = createCard;
module.exports.getByUserId = getByUserId;
module.exports.createCustomer = createCustomer;
