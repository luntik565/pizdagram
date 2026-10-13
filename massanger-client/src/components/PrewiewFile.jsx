import React from 'react'

export default function PrewiewFile({preview, onCancel}) {
  return (
    <div className="preview-container">
        <button className="preview-close-btn" onClick={onCancel} type="button">
        X
        </button>
        <img 
            src={preview}
            alt="Превью"
            className='preview-image' 
        />
    </div>
    )
}
