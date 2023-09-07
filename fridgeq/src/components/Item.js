import React from 'react';

export default function Item(props) {
    const handleClick = () => {
        props.onItemClicked(props.name); // Pass the desired string value
    };
    const timeUpdated = new Date(props.time); //when object was last updated
    const currentDate = new Date(); // current date
    const timeDifference = currentDate - timeUpdated;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

    return (
        <div style={props.style} className='Item' onClick={handleClick}>
            <p className='nameItem'>{props.name}</p>
            <h2 className='quanItem'>{props.quan}x</h2>
            <h1 className={daysDifference < 2 ? "timeItem green" : daysDifference < 5 ? "timeItem yellow" : "timeItem red"}>{daysDifference} days old</h1>
        </div>
    );
}