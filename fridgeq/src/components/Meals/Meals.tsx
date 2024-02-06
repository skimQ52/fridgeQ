import React, {useEffect, useState} from "react";
import {usePage} from '../../context/PageContext';
import {useAuthContext} from '../../hooks/useAuthContext';
import MealItem from "./MealItem";
import {addMeal, deleteMeal, getMeal, getMeals} from "../../services/mealService.ts";
import MealPopup from "./MealPopup.tsx";
import {FilterBar} from "../Fridge/FilterBar.tsx";
import {SelectFoodsPopup} from "./SelectFoodsPopup.tsx";
import {AddMealPopup} from "./AddMealPopup.tsx";
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
    const [isSelectFoodsPopup, setIsSelectFoodsPopup] = useState(false);
    const [isAddMealPopup, setIsAddMealPopup] = useState(false);

    const [meals, setMeals] = useState<Meal[]>([]);
    const [allMeals, setAllMeals] = useState<Meal[]>([]);
    const [filteredMeals, setFilteredMeals] = useState<Meal[]>([]);

    const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);

    const [error, setError] = useState(null);

    const [generateMealPopup, setGenerateMealPopup] = useState({
        trigger: false,
        meal: {
            name: '',
            desc: '',
        }
    });
    const [isLoading, setIsLoading] = useState(false);

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

    // const generateMeal = async (e) => {
    //     e.preventDefault();
    //
    //     const data = {
    //         ingredients: selectedFoods,
    //         type: typeSelectState
    //     };
    //     setIsLoading(true);
    //     // Send the POST request
    //     const response = await fetch("http://localhost:9000/meals/generate_meal", {
    //         method: 'POST',
    //         headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${user.token}` // Pass token in for authorization
    //         },
    //         body: JSON.stringify(data)
    //     });
    //     const json = await response.json();
    //     setIsLoading(false);
    //     if (!response.ok) {
    //         setError(json.error);
    //     }
    //     else { //success
    //         console.log(json);
    //         setRecipe(json.recipe); // So it doesn't require change
    //         setGenerateMealPopup({
    //             trigger: true,
    //             meal: {
    //                 name: json.name,
    //                 desc: json.description,
    //             }
    //         })
    //     }
    // };

    // const discardGeneratedMeal = () => {
    //     setSelectedFoods([]);
    //     setTypeSelectState('');
    //     setError(null);
    //     setGenerateMealPopup({
    //         trigger: false,
    //         meal: {
    //             name: '',
    //             desc: '',
    //         }
    //     });
    // }

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
                <SelectFoodsPopup onClick={() => setIsSelectFoodsPopup(false)} onSubmit={closeSelectPopupAndOpenAddPopup}  error={error}/>
            }

            {isAddMealPopup &&
                <AddMealPopup onClick={() => setIsAddMealPopup(false)} onSubmit={handleNewMeal} error={error} foods={selectedFoods}/>
            }

            {/* Generated MealItem Popup */}
            {/*<Popup trigger={generateMealPopup.trigger} setTrigger={setGenerateMealPopup}>*/}
            {/*    <h1 className="AIText">AI Generated MealItem</h1>*/}
            {/*    <div className="ingredients">*/}
            {/*        {selectedFoods.map((item, index) => (*/}
            {/*            <div className="ingredient" key={index}>*/}
            {/*                {item}*/}
            {/*                {index < selectedFoods.length - 1 &&*/}
            {/*                    <span>, &nbsp;</span>} /!* Add comma and space for all items except the last one *!/*/}
            {/*            </div>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*    <form onSubmit={handleNewMeal}>*/}
            {/*        <FormInput defaultValue={generateMealPopup.meal.name} maxlength={50} refer={nameRef} type="text"*/}
            {/*                   placeholder="Egg in a hole" label="Name"/>*/}
            {/*        <FormInput defaultValue={generateMealPopup.meal.desc} maxlength={200} refer={descRef} type="text"*/}
            {/*                   placeholder="My Favourite Comfort Breakfast Food" label="Description"/>*/}
            {/*        <ParagraphInput defaultValue={recipe} maxlength={1200} label="Recipe"*/}
            {/*                        onTextChange={handleRecipeChange}/>*/}
            {/*        <select onChange={handleTypeSelect} disabled={true} className='input input-select'>*/}
            {/*            <option value={typeSelectState}>{typeSelectState}</option>*/}
            {/*        </select>*/}
            {/*        {error && <div className="error">{error}</div>}*/}
            {/*        <div className="buttonSpread">*/}
            {/*            <button onClick={discardGeneratedMeal} className='glow-on-hover confirmButton'>Discard</button>*/}
            {/*            <button type="submit" className='glow-on-hover confirmButton'>Save MealItem</button>*/}
            {/*        </div>*/}
            {/*    </form>*/}
            {/*</Popup>*/}

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