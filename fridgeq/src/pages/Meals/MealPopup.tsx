import Popup from "../../components/Popup.tsx";
import React from "react";
import { Meal } from "./Meals.tsx";

interface MealPopupProps {
    onClick: () => void;
    meal: Meal;
    onDelete: (name: string) => void
}

export default function MealPopup(props: MealPopupProps) {

    const deleteMeal = async () => {
        props.onDelete(props.meal.name);
    }

    return <Popup onClick={props.onClick}>
        <div className="mealBig">
            <div className="headerMeal">
                <h1>{props.meal.name}</h1>
                <div className="descContainerMeal">
                    <p className="descMeal">"{props.meal.description}"</p>
                </div>
            </div>
            <p className="mealLineBreak"/>
            <div className="ingredients">
                {props.meal.ingredients.map((item, index) => (
                    <div className="ingredient" key={index}>
                        {item}
                        {index < props.meal.ingredients.length - 1 && <span>, &nbsp;</span>} {/* Add comma and space for all items except the last one */}
                    </div>
                ))}
            </div>
            <textarea disabled={true} defaultValue={props.meal.recipe}/>
            <div className="footerMeal">
                <button onClick={deleteMeal} className="glow-on-hover deleteButton">Delete</button>
            </div>

        </div>
    </Popup>;
}