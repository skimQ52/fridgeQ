import Popup from "../Popup.tsx";
import React, {useEffect, useState} from "react";
import {getFoods} from "../../services/foodService.ts";
import {useAuthContext} from "../../hooks/useAuthContext.ts";

interface SelectFoodsPopupProps {
    onClick: () => void;
    onSubmit: (selectedFoods: Food[]) => void;
    error: any;
}

interface Food {
    _id: string;
    name: string;
    type: string;
    quantity: number;
    updatedAt: string;
}

export function SelectFoodsPopup(props: SelectFoodsPopupProps) {
    const {user} = useAuthContext();

    const [foods, setFoods] = useState<Food[]>([]);
    const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
    const [typeSelectState, setTypeSelectState] = useState('');

    const handleCheck = (e: any) => {
        let updatedList = [...selectedFoods];
        if (e.target.checked) {
            updatedList = [...selectedFoods, e.target.value];
        } else {
            updatedList.splice(selectedFoods.indexOf(e.target.value), 1);
        }
        setSelectedFoods(updatedList);
    };

    const isChecked = (item: Food) => selectedFoods.includes(item) ? "mealFoodListItem checked-item" : "mealFoodListItem";

    const confirmSelectedFoods = () => {
        props.onSubmit(selectedFoods);
    }

    const handleTypeSelect = (e: any) => {
        const query = e.target.value;
        setTypeSelectState(query);
    };

    const handleGenerate = async (e: any) => {
        // await props.onGenerate();
    }

    const fetchFoods = async () => {
        if (!user) {
            return;
        }
        try {
            const data = await getFoods(user.token) as Food[];
            setFoods(data);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        if (user) {
            (async () => {//IIFE
                try {
                    await fetchFoods()
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
        }
    },[])

    return <Popup onClick={props.onClick}>
        <h1>Select Foods For New Meal</h1>
        <div className="mealFoodList">
            {foods.map((item, index) => (
                <div key={index}>
                    <input value={item.name} type="checkbox" onChange={handleCheck}/>
                    <span className={isChecked(item)}>{item.name}</span>
                </div>
            ))}
        </div>
        <div className="buttonSpread">
            <button onClick={confirmSelectedFoods}
                    className='glow-on-hover confirmButton'>Create Meal</button>
            <div className="generateMealContainer">
                <button onClick={handleGenerate} className="glow-on-hover confirmButton">Generate Meal</button>
                <select onChange={handleTypeSelect} className="input">
                    <option value="" defaultValue="true">Type</option>
                    <option value="Breakfast">Breakfast</option>
                    <option value="Lunch">Lunch</option>
                    <option value="Dinner">Dinner</option>
                    <option value="Snack">Snack</option>
                </select>
            </div>
        </div>
        {props.error && <div className="error">{props.error}</div>}
    </Popup>;
}