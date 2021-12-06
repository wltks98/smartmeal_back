const express = require("express");
const Stripe = require("stripe");
const payData = require("../models/pay.js");

// import express from "express";
// import Stripe from "stripe";

const router = express.Router();

const STRIPE_PUBLISHABLE = "pk_test_TYooMQauvdEDq54NiTphI7jx";
const STRIPE_SECRET_KEY = "sk_test_4eC39HqLyjWDarjtT1zdp7dc";
//test KEY

const stripe = new Stripe(STRIPE_SECRET_KEY);

let customerId;
//임의로 둔 것

// Create a new customer for stripe
// 모든 회원에 대해서 일회성으로 실행되어야 함
router.post("/newCustomer", async (req, res) => {
  console.log("\n\n Body Passed:", req.body);
  try {
    const customer = await stripe.customers.create({
      metadata: { user_id: req.body.user_id },
      email: req.body.email,
    });
    customerId = customer.id;
    //(user_id,customer.id)
    //결제 우려 때문에, key발급 안받고 test key라서 일회성이지만, 자신의 api key발급 받으면 db에 저장하는게
    //서버 부하 낮추기 위해 더 좋음
    payData.createCustomer(customer.metadata.user_id, customer.id);
    return res.status(200).send({
      customerId: customer.id,
      customerEmail: customer.email,
      customerUserId: customer.metadata.user_id,
    });
  } catch (error) {
    return res.status(400).send({ Error: error.raw.message });
  }
});

// Add a new card of the customer
router.post("/addNewCard", async (req, res) => {
  console.log("\n\n Body Passed:", req.body);
  const user_id = req.body.user_id;

  customerId = await payData.getByUserId(user_id);
  customerId = customerId["0"]["customer_id"];
  console.log(customerId);

  const {
    cardNumber,
    cardExpMonth,
    cardExpYear,
    cardCVC,
    cardName,
    country,
    postal_code,
  } = req.body;

  if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
    return res.status(400).send({
      Error: "Please Provide All Necessary Details to save the card",
    });
  }
  try {
    const cardToken = await stripe.tokens.create({
      card: {
        name: cardName,
        number: cardNumber,
        exp_month: cardExpMonth,
        exp_year: cardExpYear,
        cvc: cardCVC,
        address_country: country,
        address_zip: postal_code,
      },
      // customer: customer.stripe_id,
      // stripe_account: StripeAccountId,
    });

    const card = await stripe.customers.createSource(customerId, {
      source: `${cardToken.id}`,
    });

    payData.createCard(customerId, card.id);

    return res.status(200).send({
      card: card.id,
    });
  } catch (error) {
    return res.status(400).send({
      Error: error.message,
    });
  }
});

// Get List of all saved card of the customers
// viewWallCards랑 연동해서 이미 있으면, addNewCard를 못하게 해야함
router.get("/viewAllCards", async (req, res) => {
  const user_id = req.body.user_id;
  customerId = await payData.getByUserId(user_id);
  customerId = customerId["0"]["customer_id"];

  console.log(customerId);
  let cards = [];
  try {
    const savedCards = await stripe.customers.listSources(customerId, {
      object: "card",
    });
    const cardDetails = Object.values(savedCards.data);
    cardDetails.forEach((cardData) => {
      let obj = {
        cardId: cardData.id,
        cardType: cardData.brand,
        cardExpDetails: `${cardData.exp_month}/${cardData.exp_year}`,
        cardLast4: cardData.last4,
      };
      cards.push(obj);
    });
    return res.status(200).send({
      cardDetails: cards,
    });
  } catch (error) {
    return res.status(400).send({
      Error: error.message,
    });
  }
});

// Delete a saved card of the customer
router.post("/deleteCard", async (req, res) => {
  const user_id = req.body.user_id;
  customerId = await payData.getByUserId(user_id);
  console.log(customerId);
  customerId = customerId["0"]["customer_id"];

  const { cardId } = req.body;
  //cardID를 전달해야 하는 문제가 있음...
  //이걸 구현하려면 frontend에서 cardList(card이름)들을 보여주고
  //클릭해서 고르는 방식으로 구현해야 될 것

  if (!cardId) {
    return res.status(400).send({
      Error: "CardId is required to delete Card",
    });
  }
  try {
    const deleteCard = await stripe.customers.deleteSource(customerId, cardId);
    payData.deleteCard(customerId, cardId);
    return res.status(200).send(deleteCard);
  } catch (error) {
    return res.status(400).send({
      Error: error.message,
    });
  }
});

// Create a payment charge
router.post("/createCharge", async (req, res) => {
  const user_id = req.body.user_id;
  customerId = await payData.getByUserId(user_id);
  console.log(customerId);
  customerId = customerId["0"]["customer_id"];

  const { amount, cardId, oneTime, email } = req.body;
  if (oneTime) {
    const {
      cardNumber,
      cardExpMonth,
      cardExpYear,
      cardCVC,
      country,
      postalCode,
    } = req.body;

    if (!cardNumber || !cardExpMonth || !cardExpYear || !cardCVC) {
      return res.status(400).send({
        Error: "Necessary Card Details are required for One Time Payment",
      });
    }
    try {
      const cardToken = await stripe.tokens.create({
        card: {
          number: cardNumber,
          exp_month: cardExpMonth,
          exp_year: cardExpYear,
          cvc: cardCVC,
          address_state: country,
          address_zip: postalCode,
        },
      });

      const charge = await stripe.charges.create({
        amount: amount,
        currency: "usd",
        source: cardToken.id,
        receipt_email: email,
        description: `Stripe Charge Of Amount ${amount} for One Time Payment`,
      });

      if (charge.status === "succeeded") {
        return res.status(200).send({ Success: charge });
      } else {
        return res
          .status(400)
          .send({ Error: "Please try again later for One Time Payment" });
      }
    } catch (error) {
      return res.status(400).send({
        Error: error.message,
      });
    }
  } else {
    try {
      //Create charge with saved card
      //여기에서도 마찬가지로 cardId를 body로 전달해야한다는 단점
      //DB로 저장해야..
      const createCharge = await stripe.charges.create({
        amount: amount,
        currency: "usd",
        receipt_email: email,
        customer: customerId,
        card: cardId,
        description: `Stripe Charge Of Amount ${amount} for Payment`,
      });
      if (createCharge.status === "succeeded") {
        return res.status(200).send({ Success: createCharge });
      } else {
        return res
          .status(400)
          .send({ Error: "Please try again later for payment" });
      }
    } catch (error) {
      return res.status(400).send({
        Error: error.message,
      });
    }
  }
});

// export default router;
module.exports = router;
