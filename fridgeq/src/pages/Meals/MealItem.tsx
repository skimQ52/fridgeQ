import React from 'react';

interface MealItemProps {
    type: string;
    name: string;
    desc: string;
    onItemClicked: (name: string) => void;
}

export default function MealItem(props: MealItemProps) {

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