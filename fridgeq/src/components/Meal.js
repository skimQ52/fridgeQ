import React from 'react';

export default function Meal(props) {
    const handleClick = () => {
        props.onItemClicked(props.name); // Pass the desired string value
    };

    return (
        <div className='Meal' onClick={handleClick}>
            <p className='nameMeal'>{props.name}</p>
            <p className='typeMeal'>{props.type}</p>
            <div className='descContainer'>
                <p className="descMeal">"{props.desc}"</p>
            </div>
        </div>
    );
}