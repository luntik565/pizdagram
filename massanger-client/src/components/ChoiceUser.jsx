import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function ChoiceUser() {
    const [myChats, setMychats] = useState([]);
    const navigate = useNavigate();
    const myId = localStorage.getItem("userid");

    useEffect(() => {
        if (!myId) return;
        async function resp() {
            try {
                const req = await axios.get(`http://localhost:8000/room/myrooms/${myId}`);
                setMychats(req.data); 
            } catch (error) {
                console.error("Ошибка при загрузке чатов:", error);
            }
        }
        resp();
    }, [myId]);

    function openChat(roomId) {
        navigate(`/chat?room=${roomId}`);
    }

    return (
        <div>
            <h1 className='title'>Список чатов</h1>
            <h2 className='countusers'>Кол-во чатов: {myChats.length}</h2>
            <div className="listuser-wrap">
                {myChats.map((chat) => {
                    const companion = chat.members.find(member => String(member.id) !== String(myId));
                    const displayName = companion ? companion.username : chat.name;
                    return (
                        <div className="listuser" key={chat.id}>
                            <p>{displayName}</p> 
                            <button 
                                onClick={() => openChat(chat.id)}
                                className="write-btn"
                                style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#007bff', 
                                    cursor: 'pointer', 
                                    padding: 0, 
                                    font: 'inherit', 
                                    textDecoration: 'underline' 
                                }}
                            >
                                Открыть чат
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
