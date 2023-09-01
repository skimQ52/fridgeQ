const express = require("express");
const foodModel = require("../models/foodModel");
var router = express.Router();

router.post("/add_food", async (request, response) => {
    const food = new foodModel(request.body);
    console.log(food);
    try {
      await food.save();
      response.send(food);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/foods", async (request, response) => {
    const foods = await foodModel.find({});
  
    try {
      response.send(foods);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/food", async (request, response) => {
  const name = request.query.param;
  const food = await foodModel.find({ name });
  console.log(food);
  try {
    response.send(food);
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/update_food", async (request, response) => {
    const name = request.query.name;
    console.log(name);
    const quan = request.query.quan;
    console.log(quan);
    const food = await foodModel.updateOne({ name: name }, { quantity: quan });
    console.log(food);
    try {
      // await food.save();
      response.send(food);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.delete("/delete_food", async (request, response) => {
  const name = request.query.name;
  console.log(name);
  const food = await foodModel.deleteOne({ name: name });
  try {
    console.log("Data Deleted");
    response.send(food);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;