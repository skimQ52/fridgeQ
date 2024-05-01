import Popup from "../../components/Popup.tsx";
import React from "react";
import {RecipeInterface} from "../../interfaces/interfaces.ts";

interface RecipePopupProps {
    onClick: () => void;
    recipe: RecipeInterface;
    onDelete: (name: string) => void
}

export default function RecipePopup(props: RecipePopupProps) {

    const deleteRecipe = async () => {
        props.onDelete(props.recipe.name);
    }

    return <Popup onClick={props.onClick}>
        <div className="recipeBig">
            <div className="headerRecipe">
                <h1>{props.recipe.name}</h1>
                <div className="descContainerRecipe">
                    <p className="descRecipe">"{props.recipe.description}"</p>
                </div>
            </div>
            <p className="recipeLineBreak"/>
            <div className="ingredients">
                {props.recipe.ingredients.map((item, index) => (
                    <div className="ingredient" key={index}>
                        {item}
                        {index < props.recipe.ingredients.length - 1 && <span>, &nbsp;</span>} {/* Add comma and space for all items except the last one */}
                    </div>
                ))}
            </div>
            <textarea disabled={true} defaultValue={props.recipe.recipe}/>
            <div className="footerRecipe">
                <button onClick={deleteRecipe} className="glow-on-hover deleteButton">Delete</button>
            </div>

        </div>
    </Popup>;
}