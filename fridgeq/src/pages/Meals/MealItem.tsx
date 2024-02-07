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

    const truncatedDesc = props.desc.length > 100
        ? `${props.desc.substring(0, 100)}...`
        : props.desc;

    return (
        <div className='Meal' onClick={handleClick}>
            <p className='nameMeal'>{props.name}</p>
            <p className='typeMeal'>{props.type}</p>
            <div className='descContainer'>
                <p className="descMeal">"{truncatedDesc}"</p>
            </div>
        </div>
    );
}