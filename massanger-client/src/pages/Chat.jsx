import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import io from 'socket.io-client'
import Messages from '../components/Messages'
import InputBox from '../components/InputBox'
import PrewiewFile from '../components/PrewiewFile'

const socket = io("http://localhost:8000", { autoConnect: false })

export default function Chat() {
  const { search } = useLocation()
  const [croomId, setcroomId] = useState('');
  const [history, setHistory] = useState([]);
  const [roomInfo, setRoomInfo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  const myId = localStorage.getItem('userid')

  useEffect(() => {
    const searchparams = Object.fromEntries(new URLSearchParams(search))
    const currentRoom = searchparams.room

    if (!currentRoom) return
    setcroomId(currentRoom)

    socket.connect()
    socket.emit('join', { room: currentRoom, Id: myId })

    socket.on('chatHistory', ({ history, roomInfo }) => {
      setHistory(history)
      setRoomInfo(roomInfo)
    })

    socket.on('newMessage', (newMessage) => {
      setHistory((prev) => {
        if (prev.some(msg => msg.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      })
    })

    return () => {
      socket.off('chatHistory')
      socket.off('newMessage')
      socket.disconnect()
    }
  }, [search, myId])

  function clearFileState() {
    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }
    setSelectedFile(null);
    setPreviewURL(null);
  }

  async function handleSendMess(text) {
    if (!text.trim() && !selectedFile) return

    let finalImageUrl = null
    
    if (selectedFile) {
      const formdata = new FormData()
      formdata.append('file', selectedFile)

      try {
        const res = await axios.post('http://localhost:8000/api/upload/message', formdata, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        if (res.data && res.data.url) {
          finalImageUrl = res.data.url
        }
      } catch (error) {
        console.error("Ошибка загрузки файла:", error);
        return; 
      }
    }

    // Отправляем на бэкенд
    socket.emit('messageSend', {
      txt: text.trim() || null,
      uId: myId,
      rId: croomId,
      mURL: finalImageUrl
    })

    // Очищаем файл после отправки
    clearFileState();
  }

  let chatTitle = 'загрузка...'
  if (roomInfo) {
    if (roomInfo.isGroup) {
      chatTitle = roomInfo.name
    } else {
      const companion = roomInfo.members.find(m => String(m.id) !== String(myId))
      chatTitle = companion ? companion.username : 'chat'
    }
  }

  return (
    <div className='container'>
      <div className='main-wrapper'>
        <p>{chatTitle}</p>
        <div className="messages-container">
          {history.map((h) => (
            <Messages key={h.id} userid={h.userId} text={h.massage} time={h.createdAt} image={h.mediaURL}/>
          ))}
        </div>

        {previewURL && (
          <PrewiewFile preview={previewURL} onCancel={clearFileState} />
        )}
        <InputBox 
          sendMessage={handleSendMess} 
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
          setPreviewURL={setPreviewURL}
        />
      </div>
    </div>
  )
}