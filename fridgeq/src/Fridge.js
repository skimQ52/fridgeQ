// import Fade from 'react-reveal/Fade';
import React, { useEffect, useState } from "react";
import Item from './Item';

const Fridge = () => {

    const [foods, setFoods] = useState([]);

    const fetchFoods = () => {
        fetch("http://localhost:9000/mongoAPI/foods")
            .then(response => {
            return response.json()
            })
            .then(data => {
            setFoods(data)
            })
    }

    useEffect(() => {
        fetchFoods()
        console.log(foods);
    }, [])

    return (
        <div>
            <div className="Fridge">
                {foods.map((item, index) => (
                    <Item key={index} name={item.name} quan={item.quantity}></Item>
                ))}
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
                <Item name="Banana" quan="6"></Item>
            </div>
        </div>
    );
}

export default Fridge;