import Flip from 'react-reveal/Flip';
import Zoom from 'react-reveal/Zoom';
import Fade from 'react-reveal/Fade';
import React, { useEffect, useState, useRef } from "react";
import Item from './Item';
import Popup from './Popup';
import config from 'react-reveal/globals';
import FormInput from './FormInput';
import { useAuthContext } from '../hooks/useAuthContext';
import { usePage } from '../context/PageContext';

config({ ssrFadeout: true });

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
        }});

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

    const fetchFood = (name) => {
        fetch(`http://localhost:9000/mongoAPI/food?param=${name}`, {
            headers: {
                'Authorization': `Bearer ${user.token}` // Pass token in for authorization
            }
        }).then(response => {
            return response.json()
            })
            .then(data => {
            console.log(data[0].name)
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
        })
    }

    const deleteFood = () => {
        fetch(`http://localhost:9000/mongoAPI/delete_food?name=${foodPopup.food.name}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${user.token}` // Pass token in for authorization
            }
        }).then(response => response.json())
            .then(result => {
                fetchFoods()
                setFoodPopup( prevData => ({
                    ...prevData,
                    trigger: false
                }))
            }).catch(error => {
                console.error('Error:', error);
            }
        );
    }

    const foodNameExists = (name) => {
        Object.values(foods).forEach(food => {
            if (food.name.toLowerCase() === name.toLowerCase()) {
                return true;
            }
        });
    };

    const handleSubmit = (e) => {
        console.log(foodRef.current.value);
        console.log(quanRef.current.value);
        console.log(typeSelectState);

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

        const data = {
            name: foodRef.current.value,
            type: typeSelectState,
            quantity: quanRef.current.value,
        };
    
        // Send the POST request
        fetch("http://localhost:9000/mongoAPI/add_food", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` // Pass token in for authorization
            },
            body: JSON.stringify(data)
        }).then(response => response.json())
            .then(result => {
            // Handle the response or do something with the result
            })
            .catch(error => {
                e.preventDefault();
                console.error('Error:', error);
        });
    }

    const handleItemClicked = (value) => {
        fetchFood(value);
    };

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

    const handleApplyChanges = (e) => {
        if (tempFood.food.quan === 0) { // Need to delete
            deleteFood();
        }
        else { // Update quantity
            fetch(`http://localhost:9000/mongoAPI/update_food?name=${tempFood.food.name}&quan=${tempFood.food.quan}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}` // Pass token in for authorization
                }
            })
            .then(result => {
                fetchFoods()
            })
            .catch(error => {
                e.preventDefault();
                console.error('Error:', error);
            });
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

    // Handle type select of adding change
    const handleTypeSelect = (event) => {
        const query = event.target.value;
        setTypeSelectState(query);
    };

    const handleSort = () => {
        setSortedState(!sortedState);
        sortAlphabetically(sortedState)
    }

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
            const fetchFoods2 = fetchFoodsRef.current;
            fetchFoods2();
        }
    }, [user])

    return (
        <div className='page'>
            <div className={(buttonPopup.trigger || foodPopup.trigger) ? 'fridge-outer blur' : 'fridge-outer'}>

                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'left', margin: '35px'}}>
                    <input onChange={handleSearchChange} className='filter search' type="text" placeholder='Search...' value={searchQuery}></input>

                    <select onChange={handleFilterChange} className='filter select'>
                        <option value="" defaultValue="true">Type</option>
                        <option value="vegetable">Vegetable</option>
                        <option value="meat">Meat</option>
                        <option value="fruit">Fruit</option>
                        <option value="snack">Snack</option>
                        <option value="liquid">Liquid</option>
                    </select>

                    <div onClick={handleSort} className={(sortedState) ? 'filter ToggleButton ToggleButtonActive' : 'filter ToggleButton'}>
                        Sort Alphabetically
                    </div>
                </div>

                <Fade>
                    <div className="Fridge">
                        {foods.map((item, index) => (
                            <Item key={index} name={item.name} quan={item.quantity} time={item.updatedAt} onItemClicked={handleItemClicked}></Item>
                        ))}
                    </div>
                </Fade>
                
                <button onClick={() => setButtonPopup(prevData => ({...prevData, trigger: true}))} className='glow-on-hover add-btn'>+</button>
            </div>
            <Popup trigger={buttonPopup.trigger} setTrigger={setButtonPopup}>
                <h1>Add to your Fridge</h1>
                <form onSubmit={handleSubmit}>
                    <FormInput refer={foodRef} type="text" placeholder="Banana" label="Name"/>
                    <FormInput refer={quanRef} type="number" min="1" max="100" placeholder="1" label="Quantity"/>
                    <select onChange={handleTypeSelect} className='input input-select'>
                        <option value="" defaultValue="true">Type</option>
                        <option value="vegetable">Vegetable</option>
                        <option value="meat">Meat</option>
                        <option value="fruit">Fruit</option>
                        <option value="snack">Snack</option>
                        <option value="liquid">Liquid</option>
                    </select>
                    {/* <FormInput refer={typeRef} type="text" placeholder="Type" label="Type"/> */}
                    <button className='glow-on-hover confirmButton'>Confirm</button>
                </form>
            </Popup>
            <Popup trigger={foodPopup.trigger} setTrigger={setFoodPopup}>
                <h1>{foodPopup.food.name}</h1>
                <h2>You currently have:</h2>
                <h3>{tempFood.food.quan}x</h3>
                <div style={{width: '100%', justifyContent:'space-between', display: 'flex', flexDirection: 'row', paddingBottom: '20px'}}>
                    <button onClick={handleDecrement} className="">-</button>
                    <button onClick={handleIncrement} className="">+</button>
                </div>
                <button onClick={handleApplyChanges} className='glow-on-hover confirmButton'>Apply Changes</button>
            </Popup>
        </div>
    );
}

export default Fridge;