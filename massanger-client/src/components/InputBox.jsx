import React, { useState, useRef, useEffect } from 'react'

export default function InputBox({ sendMessage, selectedFile, setSelectedFile, setPreviewURL }) {
    const [text, setText] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!selectedFile && fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, [selectedFile]);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file)
            const objURL = URL.createObjectURL(file);
            setPreviewURL(objURL)
        }
    }

    function handleMessageSubmit(e) {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        if (!text.trim() && !selectedFile) return;
        sendMessage(text);
        setText('');
    }

    return (
        <div className="input-box">        
            <input 
                type="text" 
                onChange={(e) => setText(e.target.value)}
                value={text}
                placeholder="Введите сообщение..."
                className='text-input'
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        handleMessageSubmit(e);
                    }
                }}
            />
            <label className='file-input-icon'>
                <svg xmlns="http://w3.org" width="1.5em" height="1.5em" viewBox="0 0 24 24">
                    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14"/>
                </svg>
                <input 
                    type="file" 
                    accept='image/*'
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className='file-input'
                />
            </label>

            <svg 
                onClick={handleMessageSubmit} 
                xmlns="http://w3.org" 
                width="1.5em" 
                height="1.5em" 
                viewBox="0 0 16 16" 
                style={{ cursor: 'pointer' }} 
            >
                <path fill="currentColor" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5"/>
            </svg>
        </div>
    )
}