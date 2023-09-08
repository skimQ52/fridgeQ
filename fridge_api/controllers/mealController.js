const Meal = require('../models/mealModel');

// add meal
const addMeal = async (req, res) => {
    const {name, description, type, recipe, ingredients} = req.body;
    try {
        if (!name || !description || !type || !recipe) {
            throw Error('Please fill in all fields');
        }
        if (!ingredients) {
            throw Error('Cannot create meal with no ingredients!');
        }
        const user_id = req.user._id;
        const meal = await Meal.create({name, description, type, recipe, ingredients, user_id})
        res.send(meal);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// get all meals
const getMeals = async (req, res) => {
    try {
        const user_id = req.user._id;
        const meals = await Meal.find({ user_id });
        res.send(meals);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

// get a meal
const getMeal = async (req, res) => {
    try {
        const user_id = req.user._id;
        const name = req.query.param;
        const meal = await Meal.find({ name, user_id });
        res.send(meal);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

// delete a meal
const deleteMeal = async (req, res) => {
    const name = req.query.name;
    try {
        const user_id = req.user._id;
        const meal = await Meal.deleteOne({ name: name, user_id: user_id });
        res.send(meal);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}


module.exports = { addMeal, getMeals, getMeal, deleteMeal }