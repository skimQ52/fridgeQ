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
    time: Date;
    onItemClicked: (name: string) => void;
}
export default function FridgeItem(props: FridgeItemProps) {
    const handleClick = () => {
        props.onItemClicked(props.name); // Pass the desired string value
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
            image = '';
    }

    return (
        <div className='Item' onClick={handleClick}>
            <p className='nameItem'>{props.name}</p>
            <img src={image} alt="type descriptor"/>
            <h2 className='quanItem'>{props.quan}x</h2>
            <h1 className={daysDifference < 2 ? "timeItem green" : daysDifference < 5 ? "timeItem yellow" : "timeItem red"}>{daysDifference} days old</h1>
        </div>
    );
}