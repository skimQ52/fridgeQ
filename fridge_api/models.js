const mongoose = require("mongoose");

const FoodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  owner: {
    type: Number,
    required: true,
  },
});

const Food = mongoose.model("Food", FoodSchema);

module.exports = Food;