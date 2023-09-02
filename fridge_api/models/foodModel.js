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
  user_id: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Food = mongoose.model("Food", FoodSchema);


module.exports = Food;