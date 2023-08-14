import Flip from 'react-reveal/Flip';
import Zoom from 'react-reveal/Zoom';
import React, { useEffect, useState } from "react";
import Item from './Item';
import Popup from './Popup';
import config from 'react-reveal/globals';
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
                <h3>my popup</h3>
                <form>
                    
                </form>
            </Popup>
        </div>
    );
}

export default Fridge;