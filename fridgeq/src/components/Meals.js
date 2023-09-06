import React, { useEffect, useState, useRef } from "react";
import { usePage } from '../context/PageContext';
import { useAuthContext } from '../hooks/useAuthContext';
import Fade from 'react-reveal/Fade';
import Meal from "./Meal";
import Popup from "./Popup";

const Meals = () => {

    const {user} = useAuthContext();
    const { setCurrentPage } = usePage();
    const [buttonPopup, setButtonPopup] = useState({ trigger: false });
    const [searchQuery, setSearchQuery] = useState(''); // Search query from search bar
    const [filterQuery, setFilterQuery] = useState(''); // Filter Query from drop down
    const [sortedState, setSortedState] = useState(false); // Sorted or no
    const [meals, setMeals] = useState([]);
    const [allMeals, setAllMeals] = useState();
    const [filteredMeals, setFilteredMeals] = useState();
    const [foods, setFoods] = useState([]);
    const [checked, setChecked] = useState([]);

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

    const isChecked = (item) => checked.includes(item) ? "mealFoodListItem checked-item" : "mealFoodListItem";

    // Generate string of checked items

    const handleNewMeal = () => {
        console.log(checked);
    };

    // On load
    useEffect(() => {
        if (user) {
            setCurrentPage('Meals');
            fetchMeals();
            fetchFoods();
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
            <Popup trigger={buttonPopup.trigger} setTrigger={setButtonPopup}>
                <h1>Select Foods For New Meal</h1>
                <div className="mealFoodList">
                    {foods.map((item, index) => (
                        <div key={index}>
                            <input value={item} type="checkbox" onChange={handleCheck}/>
                            <span className={isChecked(item)}>{item.name}</span>
                        </div>
                    ))}
                </div>
                <button onClick={handleNewMeal} className='glow-on-hover confirmButton'>Confirm</button>
            </Popup>
            {/* <Popup trigger={foodPopup.trigger} setTrigger={setFoodPopup}>
                <button onClick={handleApplyChanges} className='glow-on-hover confirmButton'>Apply Changes</button>
            </Popup> */}
        </div>
    );
}


export default Meals;