const openai = require('../config/openAIConfig');

const generateMeal = async (req, res) => {

    const {ingredients, type} = req.body;
    try {
        if (!type) {
            throw Error('Please choose a type of meal');
        }
        if (ingredients.length < 1) {
            throw Error('Cannot create meal with no ingredients!');
        }
        const ingredientsString = ingredients.join(', ');
        const inputText = "Can you give me a " + type + " meal idea with this ingredient list:" + 
            ingredientsString + 
            "With exclusively output in this format:\nName:\nDescription:\nInstructions:";

        console.log(inputText);
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{"role": "user", "content": inputText}],
            max_tokens: 300
        })

        // Parse message
        const sections = completion.choices[0].message.content.split(/\bName:|Description:|Instructions:/);
        const meal = {
            name: sections[1].trim(), // Name section
            description: sections[2].trim(), // Description section
            recipe: sections[3].trim(), // Instructions section
        }
        console.log(meal);
        res.send(meal);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = { generateMeal }