import React, { useEffect, useState, useRef } from "react";
import { usePage } from '../context/PageContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Fade from 'react-reveal/Fade';
import Meal from "./Meal";
import Popup from "./Popup";
import FormInput from "./FormInput";
import ParagraphInput from "./ParagraphInput";

const Meals = () => {

    const {user} = useAuthContext();
    const { setCurrentPage } = usePage();
    const [buttonPopup, setButtonPopup] = useState({ trigger: false });
    const [newMealPopup, setNewMealPopup] = useState({ trigger: false });
    const [searchQuery, setSearchQuery] = useState(''); // Search query from search bar
    const [filterQuery, setFilterQuery] = useState(''); // Filter Query from drop down
    const [sortedState, setSortedState] = useState(false); // Sorted or no
    const [meals, setMeals] = useState([]);
    const [allMeals, setAllMeals] = useState();
    const [filteredMeals, setFilteredMeals] = useState();
    const [foods, setFoods] = useState([]);
    const [checked, setChecked] = useState([]);
    const nameRef = useRef();
    const descRef = useRef();
    const [typeSelectState, setTypeSelectState] = useState('');
    const [recipe, setRecipe] = useState('');
    const [error, setError] = useState(null);
    const [mealPopup, setMealPopup] = useState({
        trigger: false,
        meal: {
            name: '',
            desc: '',
            type: '',
            recipe: '',
            // foods: {

            // }
        }
    });

    const fetchMeals = () => {
        fetch("http://localhost:9000/mongoAPI/foods", {
            headers: {
                'Authorization': `Bearer ${user.token}` // Pass token in for authorization
            }
        })
            .then(response => {
            return response.json()
            })
            .then(data => {
                setMeals(data);
                setAllMeals(data);
                setFilteredMeals(data);
            })
    };

    const fetchFoods = () => {
        fetch("http://localhost:9000/mongoAPI/foods", {
            headers: {
                'Authorization': `Bearer ${user.token}` // Pass token in for authorization
            }
        })
            .then(response => {
            return response.json()
            })
            .then(data => {
                setFoods(data)
            })
    };

    const handleMealClicked = (value) => {
        // fetchMeal(value);
    };

    // Handle search query change
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        setSortedState(false);
        // sortAlphabetically(false);
        // Filter items based on search query
        // const filtered = allFoods.filter(item =>
        //     item.name.toLowerCase().includes(query.toLowerCase())
        // );

        // // Filter items based on filter query
        // const filtered2 = filtered.filter(item =>
        //     item.type.toLowerCase().includes(filterQuery.toLowerCase())
        // );
        // setFoods(filtered2);
        // setFilteredFoods(filtered2); // Hold the filtered map for sorting
    };

    // Handle filter query change
    const handleFilterChange = (event) => {
        const query = event.target.value;
        setFilterQuery(query);
        if (query === "none") {
            return;
        }
        setSortedState(false);
        // sortAlphabetically(false);
        // Filter items based on filter query
        // const filtered = allFoods.filter(item =>
        //     item.type.toLowerCase().includes(query.toLowerCase())
        // );

        // // Filter items based on search query
        // const filtered2 = filtered.filter(item =>
        //     item.name.toLowerCase().includes(searchQuery.toLowerCase())
        // );
        // setFoods(filtered2);
        // setFilteredFoods(filtered2); // Hold the filtered map for sorting
    };

    const handleSort = () => {
        setSortedState(!sortedState);
        // sortAlphabetically(sortedState)
    }

    // Add/Remove checked item from list
    const handleCheck = (event) => {
        var updatedList = [...checked];
        if (event.target.checked) {
            updatedList = [...checked, event.target.value];
        } else {
            updatedList.splice(checked.indexOf(event.target.value), 1);
        }
        setChecked(updatedList);
    };

    // Check if item is checked off
    const isChecked = (item) => checked.includes(item) ? "mealFoodListItem checked-item" : "mealFoodListItem";

    const handleUpdate = (e) => {
        // if (tempFood.food.quan === 0) { // Need to delete
        //     deleteFood();
        // }
        // else { // Update quantity
        //     fetch(`http://localhost:9000/mongoAPI/update_food?name=${tempFood.food.name}&quan=${tempFood.food.quan}`, {
        //         method: 'POST',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Authorization': `Bearer ${user.token}` // Pass token in for authorization
        //         }
        //     })
        //     .then(result => {
        //         fetchFoods()
        //     })
        //     .catch(error => {
        //         e.preventDefault();
        //         console.error('Error:', error);
        //     });
        // }
    }

    const handleNewMeal = () => {
        setNewMealPopup(prevData => ({...prevData, trigger: true}))
        setButtonPopup(prevData => ({...prevData, trigger: false}))
    };

    // Handle type select of adding change
    const handleTypeSelect = (event) => {
        const query = event.target.value;
        setTypeSelectState(query);
    };

    // Submission of add new meal
    const handleSubmit = async (e) => {
        e.preventDefault()

        await createNewMeal();
        //TODO: refresh
    };

    const createNewMeal = async () => {

        const data = {
            name: nameRef.current.value,
            description: descRef.current.value,
            type: typeSelectState,
            recipe: recipe,
            ingredients: checked
        };

        // Send the POST request
        const response = await fetch("http://localhost:9000/meals/add_meal", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` // Pass token in for authorization
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();

        if (!response.ok) {
            setError(json.error);
        }
        else { //success 
            setNewMealPopup({trigger: false})
            setError(null);
        }
    };

    const handleRecipeChange = (newText) => {
        setRecipe(newText); // Update the parent's state with the new text
    };

    // On load
    useEffect(() => {
        if (user) {
            setCurrentPage('Meals');
            fetchMeals();
            fetchFoods();
            setChecked([]);
            setTypeSelectState('');
            setError(null);
            //TODO: make reset func??
        }
    }, [user])

    return (
        <div className='page'>
            <div className={(buttonPopup.trigger) ? 'fridge-outer blur' : 'fridge-outer'}>
                <div className='filter-bar'>
                    <input onChange={handleSearchChange} className='filter search' type="text" placeholder='Search...' value={searchQuery}></input>
                    <select onChange={handleFilterChange} className='filter select'>
                        <option value="" defaultValue="true">Type</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                        <option value="other">Other</option>
                    </select>
                    <div onClick={handleSort} className={(sortedState) ? 'filter ToggleButton ToggleButtonActive' : 'filter ToggleButton'}>
                        Sort Alphabetically
                    </div>
                </div>

                <Fade>
                    <div className="Meals">
                        {meals.map((item, index) => (
                            <Meal key={index} name={item.name} quan={item.quantity} time={item.updatedAt} onItemClicked={handleMealClicked}></Meal>
                        ))}
                    </div>
                </Fade>
                <button onClick={() => setButtonPopup(prevData => ({...prevData, trigger: true}))} className='glow-on-hover add-btn'>+</button>
            </div>

            {/* Meal Popup! */}
            <Popup trigger={mealPopup.trigger} setTrigger={setMealPopup}>
                <button onClick={handleUpdate} className='glow-on-hover confirmButton'>Update</button>
            </Popup>

            {/* Select Foods For new Meal Popup */}
            <Popup trigger={buttonPopup.trigger} setTrigger={setButtonPopup}>
                <h1>Select Foods For New Meal</h1>
                <div className="mealFoodList">
                    {foods.map((item, index) => (
                        <div key={index}>
                            <input value={item.name} type="checkbox" onChange={handleCheck}/>
                            <span className={isChecked(item.name)}>{item.name}</span>
                        </div>
                    ))}
                </div>
                <button onClick={handleNewMeal} className='glow-on-hover confirmButton'>Confirm</button>
            </Popup>

            {/* Create New Meal Manually Popup */}
            <Popup trigger={newMealPopup.trigger} setTrigger={setNewMealPopup}>
                <h1>Create New Meal</h1>
                <div className="ingredients">
                    {checked.map((item, index) => (
                        <div className="ingredient" key={index}>
                            {item}
                            {index < checked.length - 1 && <span>, &nbsp;</span>} {/* Add comma and space for all items except the last one */}
                        </div>
                    ))}
                </div>
                
                <form onSubmit={handleSubmit}>
                    <FormInput maxlength={25} refer={nameRef} type="text" placeholder="Egg in a hole" label="Name"/>
                    <FormInput maxlength={75} refer={descRef} type="text" placeholder="My Favourite Comfort Breakfast Food" label="Description"/>
                    <ParagraphInput max={1000} label="Recipe" onTextChange={handleRecipeChange} />
                    <select onChange={handleTypeSelect} className='input input-select'>
                        <option value="" defaultValue="true">Type</option>
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                        <option value="other">Other</option>
                    </select>
                    { error && <div className="error">{error}</div>}
                    <button className='glow-on-hover confirmButton'>Confirm</button>
                </form>
            </Popup>
        </div>
    );
}


export default Meals;