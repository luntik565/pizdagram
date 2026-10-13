import React from 'react'

export default function Messages({userid, text, time, image}) {
  const myId = localStorage.getItem('userid')

  return (
  <div 
    style={{
      display: 'flex',        
      justifyContent: myId === String(userid) ? 'flex-end' : 'flex-start',
      width: '100%',        
      marginBottom: '12px' // Чуть увеличили отступ между сообщениями
    }}                
  >        
    <div 
      className="message"           
      style={{          
        backgroundColor: myId === String(userid) ? '#a12fec' : '#2563eb',
      }}          
    >                   
      {image && (        
        <img         
          src={image}           
          alt="Медиа"           
          style={{           
            width: '100%',
            height: 'auto',           
            maxHeight: '300px',
            objectFit: 'cover',
            borderRadius: '10px', 
            display: 'block' 
          }} 
        />        
      )}        
      
      {text && (
        <p style={{wordBreak: 'break-word' }}>
          {text}
        </p>
      )}

      <div style={{ alignSelf: 'flex-end', marginTop: '2px' }}>
        <small 
          className='time' 
          style={{ 
            fontSize: '0.75rem',
            userSelect: 'none'
          }}
        >
          {time ? new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
        </small>
      </div>
    </div>
  </div>
  )
}