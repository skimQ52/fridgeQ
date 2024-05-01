import React, {useRef, useState} from "react";
import Popup from "../../components/Popup.tsx";
import TextInput from "../../components/TextInput.tsx";
import ParagraphInput from "../../components/ParagraphInput.tsx";
import {RecipeInterface} from "../../interfaces/interfaces.ts";

interface GeneratedRecipePopupProps {
    onClick: () => void;
    generated: RecipeInterface;
    onSubmit: (recipe: RecipeInterface, e: any) => {};
}

export function GeneratedRecipePopup(props: GeneratedRecipePopupProps) {

    const nameRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);
    const [recipeText, setRecipeText] = useState(props.generated.recipe);
    const [typeSelectState, setTypeSelectState] = useState(props.generated.type);

    const handleRecipeChange = (newText: string) => {
        setRecipeText(newText); // Update the parent's state with the new text
    };

    const handleTypeSelect = (e: any) => {
        const query = e.target.value;
        setTypeSelectState(query);
    };

    const makeNewFood = async (e: any) => {
        if (!nameRef.current || !descRef.current || !typeSelectState) {
            return;
        }
        try {
            const recipe: RecipeInterface = {
                name: nameRef.current.value,
                description: descRef.current.value,
                type: typeSelectState,
                recipe:  recipeText,
                ingredients: props.generated.ingredients,
            }
            props.onSubmit(recipe, e);
        } catch (e) {
            console.error(e);
        }
    }

    return <Popup onClick={props.onClick}>
        <h1 className="AIText">AI Generated Recipe</h1>
        <div className="ingredients">
            {props.generated.ingredients.map((item, index) => (
                <div className="ingredient" key={index}>
                    {item}
                    {index < props.generated.ingredients.length - 1 &&
                        <span>, &nbsp;</span>} {/* Add comma and space for all items except the last one */}
                </div>
            ))}
        </div>
        <form>
            <TextInput defaultValue={props.generated.name} maxLength={50} refer={nameRef} placeholder="Egg in a hole" label="Name"/>
            <TextInput defaultValue={props.generated.description} maxLength={200} refer={descRef} placeholder="My Favourite Comfort Breakfast Food" label="Description"/>
            <ParagraphInput defaultValue={props.generated.recipe} maxlength={1200} label="Recipe"
                            onTextChange={handleRecipeChange}/>
            <select onChange={handleTypeSelect} disabled={true} className="input input-select">
                <option value={props.generated.type}>{props.generated.type}</option>
            </select>
            {/*{props.error && <div className="error">{props.error}</div>}*/}
            <div className="buttonSpread">
                <button onClick={props.onClick} className="glow-on-hover confirmButton">Discard</button>
                <button onClick={makeNewFood} type="submit" className="glow-on-hover confirmButton">Save Recipe</button>
            </div>
        </form>
    </Popup>;
}