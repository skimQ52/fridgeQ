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
        <div className="mealBig">
            <div className="headerMeal">
                <h1 className={"text-2xl"}>{props.recipe.name}</h1>
                <div className="descContainerMeal">
                    <p className="">"{props.recipe.description}"</p>
                </div>
            </div>
            <p className="mealLineBreak"/>
            <div className="ingredients">
                {props.recipe.ingredients.map((item, index) => (
                    <div className="ingredient" key={index}>
                        {item}
                        {index < props.recipe.ingredients.length - 1 && <span>, &nbsp;</span>} {/* Add comma and space for all items except the last one */}
                    </div>
                ))}
            </div>
            <textarea disabled={true} defaultValue={props.recipe.recipe}/>
            <div className="footerMeal">
                <button onClick={deleteRecipe} className="glow-on-hover deleteButton">Delete</button>
            </div>

        </div>
    </Popup>;
}