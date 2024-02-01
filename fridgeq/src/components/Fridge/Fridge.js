// import Fade from 'react-reveal/Fade';
import React, { useEffect, useState, useRef } from "react";
import FridgeItem from './FridgeItem';
import Popup from '../Popup';
import FormInput from '../FormInput';
import { useAuthContext } from '../../hooks/useAuthContext';
import { usePage } from '../../context/PageContext';

import {addFood, deleteFood, getFood, updateFood} from '../../services/foodService';

// config({ ssrFadeout: true });

const Fridge = () => {

    const {user} = useAuthContext();
    const [foods, setFoods] = useState([]); // Displayed food map (can be filtered)
    const [allFoods, setAllFoods] = useState(); // Full food map
    const [filteredFoods, setFilteredFoods] = useState(); // Filtered food map
    const [searchQuery, setSearchQuery] = useState(''); // Search query from search bar
    const [filterQuery, setFilterQuery] = useState(''); // Filter Query from drop down
    const [sortedState, setSortedState] = useState(false); // Sorted or no
    const [buttonPopup, setButtonPopup] = useState({ trigger: false });
    const [foodPopup, setFoodPopup] = useState({
        trigger: false,
        food: {
            name: '',
            quan: 0,
            type: '',
        }
    });

    const [tempFood, setTempFood] = useState(foodPopup);
    const { setCurrentPage } = usePage();

    const foodRef = useRef();
    const quanRef = useRef();
    const [typeSelectState, setTypeSelectState] = useState('');

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
                setFilteredFoods(data)
                setAllFoods(data)
            })
    };

    const fetchFoodsRef = useRef(fetchFoods);

    const fetchFood = async (name) => {
        console.log(name);
        try {
            const data = await getFood(name, user.token);
            setFoodPopup({
                trigger: true,
                food: {
                    name: data[0].name,
                    quan: data[0].quantity,
                    type: data[0].type,
                }
            })
            setTempFood({
                trigger: true,
                food: {
                    name: data[0].name,
                    quan: data[0].quantity,
                    type: data[0].type,
                }
            })
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleDelete = async (name) => {
        try {
            const response = await deleteFood(name, user.token);
            fetchFoods()
            setFoodPopup( prevData => ({
                ...prevData,
                trigger: false
            }))
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleNewFood = (e) => {
        console.log(foodRef.current.value);
        console.log(quanRef.current.value);
        console.log(typeSelectState);

        //TODO: ** MAKE THIS BACKEND
        if (!foodRef.current.value || !quanRef.current.value || !typeSelectState) {
            e.preventDefault();
            return;
        }

        // Check if food name already exists to prevent dupes
        let check = false;
        Object.values(foods).forEach(food => {
            if (food.name.toLowerCase() === foodRef.current.value.toLowerCase()) {
                check = true;
            }
        });
        if (check) {
            e.preventDefault();
            return;
        }
        //TODO: ** MAKE THIS BACKEND

        const data = {
            name: foodRef.current.value,
            type: typeSelectState,
            quantity: quanRef.current.value,
        };

        try {
            const dataString = JSON.stringify(data)
            const response = addFood(dataString, user.token);
            console.log(response);
            // fetchFoods();
        } catch (error) {
            e.preventDefault();
            console.error('Error:', error);
        }

    }

    const handleIncrement = () => {
        if (tempFood.food.quan === 99) {
            return;
        }
        setTempFood(prevData => ({
          ...prevData,
          food: {
            ...prevData.food,
            quan: prevData.food.quan + 1
          }
        }));
    };

    const handleDecrement = () => {
        if (tempFood.food.quan === 0) {
            return;
        }
        setTempFood(prevData => ({
          ...prevData,
          food: {
            ...prevData.food,
            quan: prevData.food.quan - 1
          }
        }));
    };

    const handleUpdate = async (e) => {
        if (tempFood.food.quan === 0) { // Need to delete
            await handleDelete(tempFood.food.name);
        }
        else { // Update quantity
            try {
                const response = await updateFood(tempFood.food.name, tempFood.food.quan, user.token);
                console.log(response);
                setFoodPopup({
                    trigger: false,
                    food: {
                        name: '',
                        quan: 0,
                        type: '',
                    }
                });
                fetchFoods();
            } catch (error) {
                e.preventDefault();
                console.error('Error:', error);
            }
        }
    }

    // Handle search query change
    const handleSearchChange = (event) => {
        const query = event.target.value;
        setSearchQuery(query);

        setSortedState(false);
        sortAlphabetically(false);
        // Filter items based on search query
        const filtered = allFoods.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

        // Filter items based on filter query
        const filtered2 = filtered.filter(item =>
            item.type.toLowerCase().includes(filterQuery.toLowerCase())
        );
        setFoods(filtered2);
        setFilteredFoods(filtered2); // Hold the filtered map for sorting
    };

    // Handle filter query change
    const handleFilterChange = (event) => {
        const query = event.target.value;
        setFilterQuery(query);
        if (query === "none") {
            return;
        }
        setSortedState(false);
        sortAlphabetically(false);
        // Filter items based on filter query
        const filtered = allFoods.filter(item =>
            item.type.toLowerCase().includes(query.toLowerCase())
        );

        // Filter items based on search query
        const filtered2 = filtered.filter(item =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFoods(filtered2);
        setFilteredFoods(filtered2); // Hold the filtered map for sorting
    };

    const handleSort = () => {
        setSortedState(!sortedState);
        sortAlphabetically(sortedState)
    }

    // Handle type select of adding change
    const handleTypeSelect = (event) => {
        const query = event.target.value;
        setTypeSelectState(query);
    };

    function sortAlphabetically() {
        if (!sortedState) {
            const sortedFoods = [...filteredFoods].sort((a, b) => a.name.localeCompare(b.name));
            setFoods(sortedFoods);
            return;
        }
        setFoods(filteredFoods);
    };

    // On load
    useEffect(() => {
        if (user) {
            setCurrentPage('Fridge');
            setTypeSelectState('');
            const fetchFoods2 = fetchFoodsRef.current;
            fetchFoods2();
        }
    }, [user])

    return (
        <div className='page'>
            <div className={(buttonPopup.trigger || foodPopup.trigger) ? 'fridge-outer blur' : 'fridge-outer'}>

                <div className='filter-bar'>
                    <input onChange={handleSearchChange} className='filter search' type="text" placeholder='Search...' value={searchQuery}></input>
                    <select onChange={handleFilterChange} className='filter select'>
                        <option value="" defaultValue="true">Type</option>
                        <option value="vegetables">Vegetables</option>
                        <option value="proteins">Proteins</option>
                        <option value="fruits">Fruits</option>
                        <option value="grains">Grains</option>
                        <option value="dairy">Dairy</option>
                        <option value="condiments">Condiments</option>
                        <option value="snacks">Snacks</option>
                    </select>
                    <div onClick={handleSort} className={(sortedState) ? 'filter ToggleButton ToggleButtonActive' : 'filter ToggleButton'}>
                        Sort Alphabetically
                    </div>
                </div>

                {/*<Fade>*/}
                    <div className="Fridge">
                        {foods.map((item, index) => (
                            <FridgeItem type={item.type} name={item.name} quan={item.quantity} time={item.updatedAt} onItemClicked={fetchFood}></FridgeItem>
                        ))}
                    </div>
                {/*</Fade>*/}
                
                <button onClick={() => setButtonPopup(prevData => ({...prevData, trigger: true}))} className='glow-on-hover add-btn'>+</button>
            </div>
            { buttonPopup.trigger &&
                <Popup onClick={() => setButtonPopup(prevData => ({...prevData, trigger: false}))}>
                    <h1>Add to your Fridge</h1>
                    <form onSubmit={handleNewFood}>
                        <FormInput refer={foodRef} maxlength={18} type="text" placeholder="Banana" label="Name"/>
                        <FormInput refer={quanRef} type="number" min="1" max="100" placeholder="1" label="Quantity"/>
                        <select onChange={handleTypeSelect} className='input input-select'>
                            <option value="" defaultValue="true">Type</option>
                            <option value="vegetables">Vegetables</option>
                            <option value="proteins">Proteins</option>
                            <option value="fruits">Fruits</option>
                            <option value="grains">Grains</option>
                            <option value="dairy">Dairy</option>
                            <option value="condiments">Condiments</option>
                            <option value="snacks">Snacks</option>
                        </select>
                        <button className='glow-on-hover confirmButton'>Confirm</button>
                    </form>
                </Popup>
            }
            { foodPopup.trigger &&
                <Popup onClick={() => setFoodPopup({
                    trigger: false,
                    food: {
                        name: '',
                        quan: 0,
                        type: '',
                    }
                })}>
                    <h1>{foodPopup.food.name}</h1>
                    <h2>You currently have:</h2>
                    <h3>{tempFood.food.quan}x</h3>
                    <div style={{width: '100%', justifyContent:'space-between', display: 'flex', flexDirection: 'row', paddingBottom: '20px'}}>
                        <button onClick={handleDecrement} className="small-btn">-</button>
                        <button onClick={handleIncrement} className="small-btn">+</button>
                    </div>
                    <button onClick={handleUpdate} className='glow-on-hover confirmButton'>Update</button>
                </Popup>
            }
        </div>
    );
}

export default Fridge;