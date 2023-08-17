import React from 'react';

export default function Item(props) {
    const handleClick = () => {
        props.onItemClicked(props.name); // Pass the desired string value
    };
    return (
        <div style={props.style} className='Item' onClick={handleClick}>
            <h2 className='nameItem'>{props.name}</h2>
            <h2 className='quanItem'>{props.quan}x</h2>
        </div>
    );
}