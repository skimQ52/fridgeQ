import Popup from "../Popup";
import React, {useState} from "react";

interface EditFoodPopupProps {
    name: string,
    quantity: number,
    onSubmit: (name: string, quan: number) => void,
    onClick: () => void,
}

export function EditFoodPopup(props: EditFoodPopupProps) {

    const [name, setName] = useState(props.name);
    const [quantity, setQuantity] = useState(props.quantity);

    const handleQuantityChange = (change: 1 | -1) => {
        if (quantity === 99 || quantity === 0) {
            return;
        }
        console.log(quantity);
        setQuantity(quantity + change);
    };

    function updateFood() {
        props.onSubmit(name, quantity);
    }

    return (
        <Popup onClick={props.onClick}>
            <h1>{name}</h1>
            <h2>You currently have:</h2>
            <h3>{quantity}x</h3>
            <div style={{
                width: '100%',
                justifyContent: 'space-between',
                display: 'flex',
                flexDirection: 'row',
                paddingBottom: '20px'
            }}>
                <button onClick={() => {
                    handleQuantityChange(-1)
                }} className="small-btn">-
                </button>
                <button onClick={() => {
                    handleQuantityChange(1)
                }} className="small-btn">+
                </button>
            </div>
            <button onClick={updateFood} className='glow-on-hover confirmButton'>Update</button>
        </Popup>
    );
}