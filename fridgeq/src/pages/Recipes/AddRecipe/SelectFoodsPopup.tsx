import Popup from "../../../components/Popup.tsx";
import React, {useEffect, useState} from "react";
import {getFoods} from "../../../services/foodService.ts";
import {useAuthContext} from "../../../hooks/useAuthContext.ts";
import {FoodInterface} from "../../../interfaces/interfaces.ts";

interface SelectFoodsPopupProps {
    onClick: () => void;
    onSubmit: (selectedFoods: FoodInterface[]) => void;
    onGenerate: (ingredients: string[], type: string, scale: number, e: any) => void;
}

export function SelectFoodsPopup(props: SelectFoodsPopupProps) {
    const {user} = useAuthContext();

    const [foods, setFoods] = useState<FoodInterface[]>([]);
    const [selectedFoods, setSelectedFoods] = useState<FoodInterface[]>([]);
    const [typeSelectState, setTypeSelectState] = useState('');
    const [scaleSelectState, setScaleSelectState] = useState(0.8);

    const handleCheck = (e: any) => {
        let updatedList = [...selectedFoods];
        if (e.target.checked) {
            updatedList = [...selectedFoods, e.target.value];
        } else {
            updatedList.splice(selectedFoods.indexOf(e.target.value), 1);
        }
        setSelectedFoods(updatedList);
    };

    const isChecked = (item: FoodInterface) => selectedFoods.includes(item) ? "mealFoodListItem checked-item" : "mealFoodListItem";

    const confirmSelectedFoods = () => {
        props.onSubmit(selectedFoods);
    }

    const handleTypeSelect = (e: any) => {
        const query = e.target.value;
        setTypeSelectState(query);
    };

    const handleScaleChange = (e: any) => {
        const query = e.target.value;
        setScaleSelectState(query);
    };

    const handleGenerate = async (e: any) => {
        props.onGenerate(selectedFoods as unknown as string[], typeSelectState, scaleSelectState, e);
    }

    const fetchFoods = async () => {
        if (!user) {
            return;
        }
        try {
            const data = await getFoods(user.token) as FoodInterface[];
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
        <h1 className="text-2xl">Select Foods For New Recipe</h1>
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
                    className='glow-on-hover confirmButton'>Create
            </button>
            <div className="generateMealContainer">
                <h4>Generate a Meal</h4>
                <label className="text-sm" htmlFor="scale">Creativity Scale:</label>
                <input
                    type="range" onChange={handleScaleChange} id="scale" min="0" max="2" step="0.4" defaultValue="0.8"
                />
                <div className="flex w-100 gap-3">
                    <button onClick={handleGenerate} className="glow-on-hover p-4 text-green-700 font-bold rounded">
                        GO
                    </button>
                    <select onChange={handleTypeSelect} className="border-1 rounded text-center">
                        <option value="" defaultValue="true">Type</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                    </select>
                </div>
            </div>
        </div>
        {/*{props.error && <div className="error">{props.error}</div>}*/}
    </Popup>;
}