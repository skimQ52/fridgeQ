const Meal = require('../models/mealModel');

// add meal
const addMeal = async (req, res) => {
    const {name, description, type, recipe, ingredients} = req.body;
    try {
        if (!name || !description || !type) {
            throw Error('Please fill in all fields');
        }
        if (ingredients.length < 1) {
            throw Error('Cannot create meal with no ingredients!');
        }
        const user_id = req.user._id;
        const meal = await Meal.create({name, description, type, recipe, ingredients, user_id})
        res.send({ data: meal, status: 200 });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getMeals = async (req, res) => {
    try {
        const user_id = req.user._id;
        const meals = await Meal.find({ user_id });
        res.send({ data: meals, status: 200 });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

const getMeal = async (req, res) => {
    try {
        const user_id = req.user._id;
        const name = req.query.param;
        const meal = await Meal.findOne({ name, user_id });
        res.send({ data: meal, status: 200 });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

const deleteMeal = async (req, res) => {
    const name = req.query.name;
    try {
        const user_id = req.user._id;
        const meal = await Meal.deleteOne({ name: name, user_id: user_id });
        res.send({ data: meal, status: 200 });
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = { addMeal, getMeals, getMeal, deleteMeal }