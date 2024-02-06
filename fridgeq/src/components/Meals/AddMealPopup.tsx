import React, {useEffect, useRef, useState} from "react";
import ParagraphInput from "./ParagraphInput.tsx";
import {Meal} from "./Meals.tsx";
import TextInput from "../TextInput.tsx";
import Popup from "../Popup.tsx";

interface AddMealPopupProps {
    onSubmit: (meal: Meal, e: React.FormEvent) => Promise<void>;
    error: any;
    foods: Food[];
    onClick: () => void;
}

interface Food {
    name: string;
    type: string;
    quantity: number;
    updatedAt: string;
}

export function AddMealPopup(props: AddMealPopupProps) {

    const nameRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const [typeSelectState, setTypeSelectState] = useState<string>('');
    const [recipe, setRecipe] = useState('');
    const [ingredients, setIngredients] = useState<string[]>([]);

    const makeNewFood = async (e: any) => {
        if (!nameRef.current || !descRef.current || !typeSelectState || !props.foods) {
            return;
        }
        try {
            const meal: Meal = {
                name: nameRef.current.value,
                description: descRef.current.value,
                type: typeSelectState,
                recipe:  recipe,
                ingredients: ingredients,
            }
            await props.onSubmit(meal, e);
        } catch (e) {
            console.error(e);
        }
    }

    const handleRecipeChange = (newText: string) => {
        setRecipe(newText); // Update the parent's state with the new text
    };

    const handleTypeSelect = (event: any) => {
        const query = event.target.value;
        setTypeSelectState(query);
    };

    useEffect(() => {
        setIngredients(props.foods as unknown as string[]);
    })

    return (
        <Popup onClick={props.onClick}>
            <h1>Create New Meal</h1>
            <div className="ingredients">
                {ingredients.map((item, index) => (
                    <div className="ingredient" key={index}>
                        {item}
                        {index < props.foods.length - 1 && <span>, &nbsp;</span>} {/* Add comma and space for all items except the last one */}
                    </div>
                ))}
            </div>
            <form onSubmit={makeNewFood}>
                <TextInput maxLength={50} refer={nameRef} placeholder="Egg in a hole" label="Name"/>
                <TextInput maxLength={200} refer={descRef} placeholder="My Favourite Comfort Breakfast Food" label="Description"/>
                <ParagraphInput defaultValue="" maxlength={1200} label="Recipe" onTextChange={handleRecipeChange}/>
                <select onChange={handleTypeSelect} className="input input-select">
                    <option value="" defaultValue="true">Type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                    <option value="Other">Other</option>
                </select>
                {props.error && <div className="error">{props.error}</div>}
                <button className="glow-on-hover confirmButton">Confirm</button>
            </form>
        </Popup>
    );
}