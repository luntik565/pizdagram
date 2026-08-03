import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function ChoiceUser() {
    const [alluserdata, setAlluserdata] = useState([]);
    const navigate = useNavigate()

    const myId = localStorage.getItem("userid")
    useEffect(()=>{
        async function resp(){
            try {
                const req = await axios.get("http://localhost:8000/auth/getallusers")
                setAlluserdata(req.data) 
            } catch (error) {
                console.log(error);
            }
        }
        resp()
    }, [])

    function roomId(e, friendId){
        e.preventDefault()
        const roomID = [myId, friendId].sort().join('_')
        navigate(`/chat?room=${roomID}`)
    }
  return (
    <div>
        <h1 className='title'>список пользователей</h1>
        <h2 className='countusers'>кол-во {alluserdata.length}</h2>
        <div className="listuser-wrap">
            {alluserdata.map((u)=>(
                <div className="listuser" id={u.id}>
                    <p>{u.username}</p>
                    <a href="" onClick={(e)=> roomId(e, u.id)}>написать</a>
                </div>
            ))}
        </div>
    </div>
  )
}
