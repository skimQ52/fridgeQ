import Flip from 'react-reveal/Flip';
import Zoom from 'react-reveal/Zoom';
import React, { useEffect, useState, useRef, useId } from "react";
import Item from './Item';
import Popup from './Popup';
import config from 'react-reveal/globals';
import FormInput from './FormInput';
config({ ssrFadeout: true });

const Fridge = () => {

    const [foods, setFoods] = useState([]); // Displayed food map (can be filtered)
    const [allFoods, setAllFoods] = useState(); // Full food map
    const [searchQuery, setSearchQuery] = useState(''); // Search query from search bar
    const [buttonPopup, setButtonPopup] = useState({ trigger: false });
    const [foodPopup, setFoodPopup] = useState({
        trigger: false,
        food: {
            name: '',
            quan: 0,
            type: '',
        }});

    const [tempFood, setTempFood] = useState(foodPopup);

    const foodRef = useRef()
    const quanRef = useRef()
    const typeRef = useRef()

    const fetchFoods = () => {
        fetch("http://localhost:9000/mongoAPI/foods")
            .then(response => {
            return response.json()
            })
            .then(data => {
            setFoods(data)
            setAllFoods(data)
            })
    }

    const fetchFood = (name) => {
        fetch(`http://localhost:9000/mongoAPI/food?param=${name}`)
            .then(response => {
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
            method: 'DELETE'
        }).then(response => response.json())
            .then(result => {
                console.log("ye")
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
        console.log(typeRef.current.value);

        if (!foodRef.current.value || !quanRef.current.value || !typeRef.current.value) {
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
            type: typeRef.current.value,
            quantity: quanRef.current.value,
            owner: 1 /* temp TODO */
        };
    
        // Send the POST request
        fetch("http://localhost:9000/mongoAPI/add_food", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
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
                method: 'POST'
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

        // Filter items based on search query
        const filtered = allFoods.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFoods(filtered);
    };

    // Resets
    useEffect(() => {
        fetchFoods();
    }, [])

    return (
        <div>
            <div className={(buttonPopup.trigger || foodPopup.trigger) ? 'blur fridge-outer' : 'fridge-outer'}>
            <input onChange={handleSearchChange} className='search' type="text" placeholder='Search...' value={searchQuery}></input>
                <div className="Fridge">
                    {foods.map((item, index) => (
                        <Item key={index} name={item.name} quan={item.quantity} onItemClicked={handleItemClicked}></Item>
                    ))}
                </div>
                <button onClick={() => setButtonPopup(prevData => ({...prevData, trigger: true}))} className='addButton'>Add new items</button>
            </div>
            <Popup trigger={buttonPopup.trigger} setTrigger={setButtonPopup}>
                <h1>Add to your Fridge</h1>
                <form onSubmit={handleSubmit}>
                    <FormInput refer={foodRef} type="text" placeholder="Banana" label="Name"/>
                    <FormInput refer={quanRef} type="number" min="1" max="100" placeholder="1" label="Quantity"/>
                    <FormInput refer={typeRef} type="text" placeholder="Type" label="Type"/> {/* make drop down menu */}
                    <button className='confirmButton'>Confirm</button>
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
                <button onClick={handleApplyChanges} className='confirmButton'>Apply Changes</button>
            </Popup>
        </div>
    );
}

export default Fridge;