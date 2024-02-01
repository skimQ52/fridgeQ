import React, { useState } from 'react';

interface ParagraphInputProps {
    defaultValue: string;
    maxlength: number;
    onTextChange: (text: string) => void;
    label: string;
}

export default function ParagraphInput(props: ParagraphInputProps) {
    const { defaultValue, maxlength, onTextChange, label} = props;
    const [text, setText] = useState(defaultValue);

    const handleChange = (e: any) => {
	    const newText = e.target.value;
	    if (newText.length <= maxlength) {
	    setText(newText);
	    onTextChange(newText); // Call the callback to update the parent's state
	    }
    };

    return (
	    <div className='ParagraphInput'>
		    <label className='labelInput'>{label}</label>
		    <textarea
			    rows={4}
			    cols={50}
                value={text}
                onChange={handleChange}
                placeholder="Type your text here..."
            />
            <div className='charCount'>
                <p className='charCountText'>
                    {text.length}/{maxlength}
                </p>
            </div>

        </div>
    );
}