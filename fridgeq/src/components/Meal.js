import React from 'react';

export default function Meal(props) {
    const handleClick = () => {
        props.onItemClicked(props.name); // Pass the desired string value
    };

    return (
        <div className='Meal' onClick={handleClick}>
            <p className='nameMeal'>{props.name}</p>
            <p className='typeMeal'>Breakfast</p>
            <div className='descContainer'>
                <p className="descMeal"> I like to eat this sometimes with soup or whatever</p>
            </div>
        </div>
    );
}