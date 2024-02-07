const express = require("express");
const foodModel = require("../models/foodModel");
const requireAuth = require('../middleware/requireAuth');

var router = express.Router();

router.use(requireAuth);

router.post("/add_food", async (request, response) => {
    // const food = new foodModel(request.body);
    const { name, type, quantity } = request.body;

    try {
      const user_id = request.user._id;
      // await food.save();
      const food = await foodModel.create({name, type, quantity, user_id})
      response.send(food);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/foods", async (request, response) => {
    const user_id = request.user._id;
    const foods = await foodModel.find({ user_id });
    try {
      response.send({ data: foods, status: 200 });
    } catch (error) {
      response.status(500).send(error);
    }
});

router.get("/food", async (request, response) => {
  const user_id = request.user._id;
  const name = request.query.param;
  const food = await foodModel.find({ name, user_id });
  console.log(food);
  try {
    response.send({ data: food, status: 200 });
  } catch (error) {
    response.status(500).send(error);
  }
});

router.post("/update_food", async (request, response) => {
    const user_id = request.user._id;
    const name = request.query.name;
    console.log(name);
    const quan = request.query.quan;
    console.log(quan);
    const food = await foodModel.updateOne({ name: name, user_id: user_id }, { quantity: quan });
    console.log(food);
    try {
      // await food.save();
      response.send(food);
    } catch (error) {
      response.status(500).send(error);
    }
});

router.delete("/delete_food", async (request, response) => {
  const user_id = request.user._id;
  const name = request.query.name;
  console.log(name);
  const food = await foodModel.deleteOne({ name: name, user_id: user_id });
  try {
    console.log("Data Deleted");
    response.send(food);
  } catch (error) {
    response.status(500).send(error);
  }
});

module.exports = router;