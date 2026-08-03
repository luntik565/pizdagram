import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'

const socket = io("http://localhost:8000", { autoConnect: false })

export default function Chat() {
  const { search } = useLocation()
  const [croomId, setcroomId] = useState('');
  const [history, setHistory] = useState([]);
  const [text, setText] = useState('');
  const [roomInfo, setRoomInfo] = useState(null);
  const myId = localStorage.getItem('userid')
  useEffect( () => {
    const searchparams = Object.fromEntries(new URLSearchParams(search))
    const currentRoom = searchparams.room

    if(!currentRoom) return;

    setcroomId(currentRoom)

    socket.connect()
    socket.emit('join', {
      room: currentRoom,
      Id: myId
    })

    return()=>{
      socket.off()
      socket.disconnect()
    }
  }, [search, myId])

  useEffect(()=>{
    socket.on('chatHistory', ({history, roomInfo}) =>{
      setHistory(history)
      setRoomInfo(roomInfo)
      console.log(history, roomInfo);
    })

    socket.on('newMessage', (newMessage)=>{
      setHistory((prev)=> [...prev, newMessage])
    })
    return ()=>{
      socket.off('chatHistory')
    }
  },[])

  function handleSendMess(e){
    e.preventDefault() 
    if(!text.trim()) return;
    console.log(text);
    socket.emit('messageSend', {
      txt: text,
      uId: myId,
      rId: croomId
    })
    setText('')
  }

  let chatTitle = 'загрузка...'
  if(roomInfo){
    if(roomInfo.isGroup){
      chatTitle = roomInfo.name
    }else{
      const companion = roomInfo.members.find(m => String(m.id) !== String(myId))
      chatTitle = companion ? companion.username : 'chat'
    }
  }

  return (
    <div className='container'>
      <div className='main-wrapper'>
        <p>{chatTitle}</p>
        <div className="messages-container">
          {history.map((h)=>(
          <div 
            key={h.id} 
            style={{
              display: 'flex',
              justifyContent: myId === String(h.userId) ? 'flex-end' : 'flex-start',
              width: '100%',
              marginBottom: '10px'
            }}
          >
              <div 
                className="message" 
                style={{backgroundColor: myId === String(h.userId) ? 'rgb(161, 47, 236)' : 'blue',}}
              >
                <p style={{ margin: 0 }}>{h.massage}</p>
                <div style={{ textAlign: 'right', marginTop: '4px' }}>
                  <small className='time' style={{ opacity: 0.7, fontSize: '0.75rem' }}>
                    <sub>{new Date(h.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</sub>
                  </small>
                </div>
            </div>
          </div>
          ))}
        </div> 
        <div className="input-box">
          <input 
            type="text" 
            onChange={(e)=> setText(e.target.value)}
            value={text}
            placeholder="Введите сообщение..."
            style={{ width: '90%', padding: '8px', marginRight: '10px' }}

          />
          <svg onClick={handleSendMess} xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 16 16"><path fill="currentColor"  d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5"/></svg>
        </div>
      </div>
    </div>
  )
}