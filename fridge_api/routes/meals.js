const express = require('express');
const router = express.Router();
const requireAuth = require('../middleware/requireAuth');

router.use(requireAuth);

// controller functions
const { addMeal, getMeals, getMeal, deleteMeal } = require('../controllers/mealController')

/* POST for Adding meals */
router.post('/add_meal', addMeal);

// GET for all meals
router.get('/meals', getMeals);

// GET for a meal
router.get('/meal', getMeal);

// DELETE a meal
router.delete('/delete_meal', deleteMeal);

module.exports = router;