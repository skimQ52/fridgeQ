const mongoose = require("mongoose");

const MealSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    recipe: {
        type: String,
    },
    ingredients: {
        type: [String],
        required: true,
    },
    user_id: {
        type: String,
        required: true,
    },
})

module.exports = mongoose.model('Meal', MealSchema);