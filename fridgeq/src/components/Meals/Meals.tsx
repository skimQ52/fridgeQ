import React, {useEffect, useState} from "react";
import {usePage} from '../../context/PageContext';
import {useAuthContext} from '../../hooks/useAuthContext';
import MealItem from "./MealItem";
import {addMeal, deleteMeal, generateMeal, getMeal, getMeals} from "../../services/mealService.ts";
import MealPopup from "./MealPopup.tsx";
import {FilterBar} from "../Fridge/FilterBar.tsx";
import {SelectFoodsPopup} from "./SelectFoodsPopup.tsx";
import {AddMealPopup} from "./AddMealPopup.tsx";
import {GeneratedMealPopup} from "./GeneratedMealPopup.tsx";

// import LoadingScreen from 'react-loading-screen'

interface Food {
    name: string;
    type: string;
    quantity: number;
    updatedAt: string;
}

export interface Meal {
    name: string;
    description: string;
    type: string;
    recipe: string;
    ingredients: string[];
}

const Meals = () => {

    const {user} = useAuthContext();
    const { setCurrentPage } = usePage();

    const [meals, setMeals] = useState<Meal[]>([]);
    const [allMeals, setAllMeals] = useState<Meal[]>([]);
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);
    const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const [isSelectFoodsPopup, setIsSelectFoodsPopup] = useState(false);
    const [isAddMealPopup, setIsAddMealPopup] = useState(false);

    const [isGeneratedPopup, setIsGeneratedPopup] = useState(false);

    const [isMealPopup, setIsMealPopup] = useState(false);
    const [mealPopup, setMealPopup] = useState<Meal>({
        name: '',
        description: '',
        type: '',
        recipe: '',
        ingredients: [],
    });

    const fetchMeals = async () => {
        if (!user) {
            return;
        }
        try {
            const data = await getMeals(user.token) as Meal[];
            if (data) {
                setMeals(data);
                setFilteredMeals(data);
                setAllMeals(data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const fetchMeal = async (name: string) => {
        if (!user) {
            return;
        }
        try {
            const data = await getMeal(name, user.token) as Meal;
            if (data) {
                setMealPopup(data);
                setIsMealPopup(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleNewMeal = async (meal: Meal, e: any) => {
        if (!user) {
            return;
        }
        const dataString = JSON.stringify(meal);
        try {
            const response = await addMeal(dataString, user.token);
            console.log(response);
            await fetchMeals();
        } catch (error) {
            e.preventDefault();
            console.error('Error:', error);
        }
    };

    const handleDelete = async (name: string) => {
        if (!user) {
            return;
        }
        try {
            const response = await deleteMeal(name, user.token);
            console.log(response);
            setIsMealPopup(false);
            await fetchMeals()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleQueryChange = (query: string, filter: string) => {
        const filtered = allMeals.filter(item =>
            filter ? item.type.toLowerCase().includes(filter.toLowerCase()) : item.name.toLowerCase().includes(filter.toLowerCase())
        );
        const filtered2 = query ? filtered.filter(item => item.name.toLowerCase().includes(query.toLowerCase())) : filtered;
        setMeals(filtered2);
        setFilteredMeals(filtered2);
    };

    const sortAlphabetically = (sort: boolean) => {
        if (!sort) {
            const sortedMeals = [...filteredMeals].sort((a, b) => a.name.localeCompare(b.name));
            setMeals(sortedMeals);
            return;
        }
        setMeals(filteredMeals);
    }

    const handleGenerateMeal = async (ingredients: string[], type: string, e: any) => {
        if (!user) {
            return;
        }
        const data = {
            ingredients: ingredients,
            type: type
        };
        const dataString = JSON.stringify(data);
        setIsLoading(true);
        try {
            const response = await generateMeal(dataString, user.token) as Meal;
            console.log(response);
            setIsLoading(false);
            setMealPopup({
                name: response.name,
                description: response.description,
                type: type,
                recipe: response.recipe,
                ingredients: ingredients,
            })
            setIsGeneratedPopup(true);
        } catch (error) {
            e.preventDefault();
            console.error('Error:', error);
        }
    };

    const discardGeneratedMeal = async () => {
        setIsGeneratedPopup(false);
        await fetchMeals();
        // setSelectedFoods([]);
        // setTypeSelectState('');
        // setError(null);
        // setGenerateMealPopup({
        //     trigger: false,
        //     meal: {
        //         name: '',
        //         desc: '',
        //     }
        // });
    }

    function closeSelectPopupAndOpenAddPopup(checkedFoods: Food[]) {
        setIsSelectFoodsPopup(false);
        setIsAddMealPopup(true);
        setSelectedFoods(checkedFoods);
    }

    useEffect(() => {
        if (user) {
            setCurrentPage('Meals');
            (async () => {//IIFE
                try {
                    await fetchMeals()
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
        }
    },[])

    return (
        <div className='page'>
            <div className={(isAddMealPopup) ? 'fridge-outer blur' : 'fridge-outer'}>
                <FilterBar onChange={handleQueryChange} sort={sortAlphabetically}>
                    <option value="" defaultValue="true">Type</option>
                    <option value="breakfast">Breakfast</option>
                    <option value="lunch">Lunch</option>
                    <option value="dinner">Dinner</option>
                    <option value="snack">Snack</option>
                    <option value="other">Other</option>
                </FilterBar>
                {meals.length === 0 ? ( //TODO: IMPROVE
                    <p>No meals available</p>
                ) : (
                    <ul className={"Meals"}>
                        {meals.map((item, index) => (
                            <MealItem key={index} name={item.name} type={item.type} desc={item.description}
                                  onItemClicked={fetchMeal}></MealItem>
                        ))}
                    </ul>
                )}
                <button onClick={() => setIsSelectFoodsPopup(true)} className='glow-on-hover add-btn'>+</button>
            </div>

            {isMealPopup &&
                <MealPopup onClick={() => setIsMealPopup(false)} meal={mealPopup} onDelete={handleDelete}/>
            }

            {isSelectFoodsPopup &&
                <SelectFoodsPopup onClick={() => setIsSelectFoodsPopup(false)} onSubmit={closeSelectPopupAndOpenAddPopup} onGenerate={handleGenerateMeal} error={error}/>
            }

            {isAddMealPopup &&
                <AddMealPopup onClick={() => setIsAddMealPopup(false)} onSubmit={handleNewMeal} error={error} foods={selectedFoods}/>
            }

            {/* Generated MealItem Popup */}
            {isGeneratedPopup &&
                <GeneratedMealPopup onClick={discardGeneratedMeal} onSubmit={handleNewMeal} generated={mealPopup} error={error}/>
            }

            {/* Generate Loading Screen */}
            {/*<LoadingScreen*/}
            {/*    loading={isLoading}*/}
            {/*    bgColor='rgba(82, 82, 82, 0.219)'*/}
            {/*    spinnerColor='green'*/}
            {/*    textColor='green'*/}
            {/*    text='Generating MealItem...'> */}
            {/*</LoadingScreen>*/}
        </div>
    );
}


export default Meals;