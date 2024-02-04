import React, {useEffect, useState} from "react";
import FridgeItem from './FridgeItem';

import {useAuthContext} from '../../hooks/useAuthContext';
import {usePage} from '../../context/PageContext';

import {addFood, deleteFood, getFoods, updateFood} from '../../services/foodService';

import {AddFoodPopup} from "./AddFoodPopup";
import {EditFoodPopup} from "./EditFoodPopup";
import {FilterBar} from "./FilterBar";

const Fridge = () => {

    const {user} = useAuthContext();
    const { setCurrentPage } = usePage();

    const [foods, setFoods] = useState([]);
    const [allFoods, setAllFoods] = useState([]);
    const [filteredFoods, setFilteredFoods] = useState([]);

    const [isAddFoodPopup, setIsAddFoodPopup] = useState(false);
    const [isEditFoodPopup, setIsEditFoodPopup] = useState(false);
    const [editFoodPopupName, setEditFoodPopupName] = useState('');
    const [editFoodPopupQuan, setEditFoodPopupQuan] = useState(0);

    const fetchFoods = async () => {
        try {
            const data = await getFoods(user.token);
            setFoods(data)
            setFilteredFoods(data)
            setAllFoods(data)
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleDelete = async (name) => {
        try {
            const response = await deleteFood(name, user.token);
            console.log(response);
            setIsEditFoodPopup(false);
            await fetchFoods()
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleNewFood = async (name, quantity, type, e) => {
        const existingFood = Object.values(foods).find(food => food.name.toLowerCase() === name.toLowerCase());
        if (existingFood) {
            const newQuantity = existingFood.quantity + quantity;
            const response = await handleUpdateFood(existingFood.name, newQuantity);
            console.log(response);
            return;
        }

        const data = {
            name: name,
            type: type,
            quantity: quantity,
        };

        try {
            const dataString = JSON.stringify(data)
            const response = await addFood(dataString, user.token);
            console.log(response);
            await fetchFoods();
        } catch (error) {
            e.preventDefault();
            console.error('Error:', error);
        }
    }

    const handleUpdateFood = async (name, quantity, e) => {
        console.log(name + quantity);
        if (quantity === 0) { // Need to delete
            await handleDelete(name);
            return;
        }
        try {
            const response = await updateFood(name, quantity, user.token);
            console.log(response);
            setIsEditFoodPopup(false);
            await fetchFoods();
        } catch (error) {
            e.preventDefault();
            console.error('Error:', error);
        }
    }
    const handleQueryChange = (query, filter) => {
        const filtered = allFoods.filter(item =>
            filter ? item.type.toLowerCase().includes(filter.toLowerCase()) : item.name.toLowerCase().includes(filter.toLowerCase())
        );
        const filtered2 = query ? filtered.filter(item => item.name.toLowerCase().includes(query.toLowerCase())) : filtered;
        setFoods(filtered2);
        setFilteredFoods(filtered2);
    };

    const sortAlphabetically = (sort) => {
        if (!sort) {
            const sortedFoods = [...filteredFoods].sort((a, b) => a.name.localeCompare(b.name));
            setFoods(sortedFoods);
            return;
        }
        setFoods(filteredFoods);
    }

    const showEditFoodPopup = (name, quan) => {
        setIsEditFoodPopup(true);
        setEditFoodPopupName(name);
        setEditFoodPopupQuan(parseInt(quan));
    }

    // On load
    useEffect(() => {
        if (user) {
            setCurrentPage('Fridge');
            (async () => {//IIFE
                try {
                    await fetchFoods(user.token)
                } catch (error) {
                    console.error('Error:', error);
                }
            })();
        }
    },[])

    return (
        <div className='page'>
            <div className={(isAddFoodPopup || isEditFoodPopup) ? 'fridge-outer blur' : 'fridge-outer'}>
                <FilterBar onChange={handleQueryChange} sort={sortAlphabetically}/>

                <div className="Fridge">
                    {foods.map((item, index) => (
                        <FridgeItem key={index} type={item.type} name={item.name} quan={item.quantity}
                                    onItemClicked={showEditFoodPopup} time={item.updatedAt}></FridgeItem>
                    ))}
                </div>

                <button onClick={() => setIsAddFoodPopup(true)} className='glow-on-hover add-btn'>+</button>
            </div>
            {isAddFoodPopup &&
                <AddFoodPopup onClick={() => setIsAddFoodPopup(false)} onSubmit={handleNewFood}/>
            }
            {isEditFoodPopup &&
                <EditFoodPopup onClick={() => setIsEditFoodPopup(false)} onSubmit={handleUpdateFood}
                               name={editFoodPopupName} quantity={editFoodPopupQuan}/>
            }
        </div>
    );
}

export default Fridge;