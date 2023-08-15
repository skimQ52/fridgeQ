import Flip from 'react-reveal/Flip';
import Zoom from 'react-reveal/Zoom';
import React, { useEffect, useState, useRef } from "react";
import Item from './Item';
import Popup from './Popup';
import config from 'react-reveal/globals';
import FormInput from './FormInput';
config({ ssrFadeout: true });

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
        // console.log(foods);
    }, [])

    const [buttonPopup, setButtonPopup] = useState(false);

    const foodRef = useRef()
    const quanRef = useRef()
    const typeRef = useRef()

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(foodRef.current.value);
        console.log(quanRef.current.value);
        console.log(typeRef.current.value);

        const data = {
            _id: 30,
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
                console.error('Error:', error);
        });
    }

    return (
        <div>
            <Flip right cascade>
            {/* <Zoom cascade> */}
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
            </Flip>
            {/* </Zoom> */}
            <button onClick={() => setButtonPopup(true)} className='addButton'>Add new items</button>
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup}>
                <h1>Add to your Fridge</h1>
                <form onSubmit={handleSubmit}>
                    <FormInput refer={foodRef} type="text" placeholder="Banana" label="Name"/>
                    <FormInput refer={quanRef} type="number" min="1" max="100" placeholder="1" label="Quantity"/>
                    <FormInput refer={typeRef} type="text" placeholder="Type" label="Type"/> {/* make drop down menu */}
                    <button className='confirmButton'>Confirm</button>
                </form>
            </Popup>
        </div>
    );
}

export default Fridge;