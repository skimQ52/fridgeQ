import Flip from 'react-reveal/Flip';
import Zoom from 'react-reveal/Zoom';
import React, { useEffect, useState, useRef, useId } from "react";
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
    }, [])

    const [buttonPopup, setButtonPopup] = useState(false);

    const foodRef = useRef()
    const quanRef = useRef()
    const typeRef = useRef()

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

        let check = false;
        Object.values(foods).forEach(food => {
            if (food.name.toLowerCase() === foodRef.current.value.toLowerCase()) {
                check = true;
            }
        });
        if (check) {
            return;
        }

        // let test = foodNameExists(foodRef.current.value);
        // if (test) {
        //     // e.preventDefault();
        //     console.log("exists2");
        //     return;
        // }
        console.log("test3");
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

    return (
        <div>
            {/* <Flip right cascade> */}
            {/* <Zoom cascade> */}
            <div className="Fridge">
                {foods.map((item, index) => (
                    <Item key={index} name={item.name} quan={item.quantity}></Item> 
                ))}
            </div>
            {/* </Flip> */}
            {/* </Zoom> */}
            <button onClick={() => setButtonPopup(true)} className='addButton'>Add new items</button>
            <Popup trigger={buttonPopup} setTrigger={setButtonPopup} onClose={() => console.log("fukumean")}>
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