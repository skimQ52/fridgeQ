import React from 'react';

export default function Item(props) {
    return (
        <div className='Item'>
            <h2 className='nameItem'>{props.name}</h2>
            <h2 className='quanItem'>{props.quan}x</h2>
        </div>
    );
}