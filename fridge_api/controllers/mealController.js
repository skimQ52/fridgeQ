const Meal = require('../models/mealModel');

// add meal
const addMeal = async (req, res) => {
    const {name, description, type, recipe, ingredients} = req.body;
    console.log(name, description, type, recipe, ingredients);
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
    const {email, password, name} = req.body;

    // try {
    //     const user = await User.signup(email, password, name);

    //     //create a token
    //     const token = createToken(user._id)
        
    //     res.status(200).json({email, name, token})
    // } catch(error) {
    //     res.status(400).json({error: error.message})
    // }
}

module.exports = { addMeal, getMeals }