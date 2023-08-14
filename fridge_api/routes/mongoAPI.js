const express = require("express");
const foodModel = require("../models");
var router = express.Router();

router.post("/add_food", async (request, response) => {
    const food = new foodModel(request.body);
  
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

module.exports = router;