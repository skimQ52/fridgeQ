import React, { useState } from 'react';

interface ParagraphInputProps {
    defaultValue: string;
    maxlength: number;
    onTextChange: (text: string) => void;
    label: string;
}

export default function ParagraphInput(props: ParagraphInputProps) {
  const [text, setText] = useState(props.defaultValue);
  const maxLength = props.maxlength;

  const handleChange = (e: any) => {
    const newText = e.target.value;
    if (newText.length <= maxLength) {
      setText(newText);
      props.onTextChange(newText); // Call the callback to update the parent's state
    }
  };

  return (
    <div className='ParagraphInput'>
        <label className='labelInput'>{props.label}</label>
        <textarea
            rows={4}
            cols={50}
            value={text}
            onChange={handleChange}
            placeholder="Type your text here..."
        />
        <div className='charCount'>
            <p className='charCountText'>
                {text.length}/{maxLength}
            </p>
        </div>
        
    </div>
  );
}