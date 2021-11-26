const express = require("express");
const foodsData = require("../data/foods.js");

// import express from "express";
// import * as foodsData from "../data/foods.js";

const router = express.Router();

async function getFoods(req, res) {
  const foodCode = req.query.code;
  const data = await (foodCode
    ? foodsData.getByCode(foodCode)
    : foodsData.getAll());
  res.status(200).json(data);
}

async function rateFood(req, res) {
  const foodCode = req.query.code;
  const rate = req.query.rate;
  const data = await foodsData.rateFood(foodCode, rate);
  res.sendStatus(200);
}

async function filterFood(req, res) {
  const filter = req.query.filter;
  //filter : kcal, fat, carbohydrate, protein, code, price, avg_rate, total_num 맘대로..
  const min = req.query.min;
  const max = req.query.max;
  const data = await foodsData.filterFood(filter, min, max);
  res.status(200).json(data);
}
// foods/f?filter=kcal&min=10&max=20

async function filtersFood(req, res) {
  const filter = req.query.filter;
  const min = req.query.min;
  const max = req.query.max;
  const data = await foodsData.filtersFood(filter, min, max);
  res.status(200).json(data);
}

router.get("/", getFoods);
router.post("/", rateFood);
router.get("/f", filterFood);
router.get("/fs", filtersFood);

// export default router;
module.exports = router;
