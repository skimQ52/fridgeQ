import Popup from "../../components/Popup.tsx";
import React, {useRef, useState} from "react";
import NumberInput from "../../components/NumberInput.tsx";
import TextInput from "../../components/TextInput.tsx";

interface AddFoodPopupProps {
    onClick: () => void;
    onSubmit: (name: string, quan: number, type: string, e: React.FormEvent<HTMLFormElement>) => void;
}


export function AddFoodPopup(props: AddFoodPopupProps) {

    const foodRef = useRef<HTMLInputElement>(null);
    const quanRef = useRef<HTMLInputElement>(null);
    const [typeSelectState, setTypeSelectState] = useState<string>('');

    const makeNewFood = async (e: any) => {
        if (!foodRef.current || !quanRef.current || !typeSelectState) {
            return;
        }
        props.onSubmit(foodRef.current.value, parseInt(quanRef.current.value), typeSelectState, e);
    }

    const handleTypeSelect = (event: any) => {
        const query = event.target.value;
        setTypeSelectState(query);
    };

    return (
        <Popup onClick={props.onClick}>
            <h1>Add to your Fridge</h1>
            <form onSubmit={makeNewFood}>
                <TextInput label="Name" refer={foodRef} placeholder="Banana" maxLength={18}/>
                <NumberInput label="Quantity" refer={quanRef} placeholder="1"/>
                <select onChange={handleTypeSelect} className="input input-select">
                    <option value="" defaultValue="true">Type</option>
                    <option value="vegetables">Vegetables</option>
                    <option value="proteins">Proteins</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="dairy">Dairy</option>
                    <option value="condiments">Condiments</option>
                    <option value="snacks">Snacks</option>
                </select>
                <button className="glow-on-hover confirmButton">Confirm</button>
            </form>
        </Popup>
    );
}