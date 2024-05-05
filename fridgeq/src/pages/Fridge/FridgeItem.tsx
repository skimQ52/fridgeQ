import React from 'react';
import grains from '../../imgs/grains.png';
import dairy from '../../imgs/dairy.png';
import fruits from '../../imgs/fruits.png';
import vegetables from '../../imgs/vegetables.png';
import proteins from '../../imgs/proteins.png';
import condiments from '../../imgs/condiments.png';
import snacks from '../../imgs/snacks.png';

interface FridgeItemProps {
    type: string;
    name: string;
    quan: number;
    time: string;
    onItemClicked: (name: string, quan: number) => void;
}
export default function FridgeItem(props: FridgeItemProps) {
    const handleClick = () => {
        props.onItemClicked(props.name, props.quan); // Pass the desired string value
    };
    const timeUpdated = new Date(props.time); //when object was last updated
    const currentDate = new Date(); // current date
    const timeDifference = currentDate.getTime() - timeUpdated.getTime();
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    let image;

    switch (props.type) {
        case 'grains':
            image = grains;
            break;
          case 'dairy':
            image = dairy;
            break;
          case 'vegetables':
            image = vegetables;
            break;
          case 'fruits':
            image = fruits;
            break;
          case 'proteins':
            image = proteins;
            break;
          case 'condiments':
            image = condiments;
            break;
          case 'snacks':
            image = snacks;
            break;
          default:
            image = fruits;
    }

    return (
        <div className="bobbing select-none h-36 w-36 flex flex-col bg-white drop-shadow-md rounded-3xl" onClick={handleClick}>
            <h2 className='text-xl mt-3 ml-3 overflow-clip'>{props.name}</h2>
            <img className="max-h-16 max-w-28 block m-auto mt-0" src={image} alt="type descriptor"/>
            <div className="ml-3 mr-3 flex flex-row justify-between">
                <h1 className={daysDifference < 2 ? "mt-2 green" : daysDifference < 5 ? "mt-2 yellow" : "mt-2 red"}>
                    {daysDifference} days old
                </h1>
                <h2 className='text-2xl mt-0'>{props.quan}x</h2>
            </div>

        </div>
    );
}