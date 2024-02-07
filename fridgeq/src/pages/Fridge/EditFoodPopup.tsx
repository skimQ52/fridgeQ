import Popup from "../../components/Popup.tsx";
import React, {useState} from "react";

interface EditFoodPopupProps {
    name: string,
    quantity: number,
    onSubmit: (name: string, quan: number, e: React.FormEvent) => void,
    onClick: () => void,
}

export function EditFoodPopup(props: EditFoodPopupProps) {

    const [name, setName] = useState(props.name);
    const [quantity, setQuantity] = useState(props.quantity);

    const handleQuantityChange = (change: 1 | -1) => {
        if ((quantity === 99 && change === 1) || (quantity === 0 && change === -1)) {
            return;
        }
        setQuantity(quantity + change);
    };

    function updateFood(e: React.FormEvent) {
        props.onSubmit(name, quantity, e);
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