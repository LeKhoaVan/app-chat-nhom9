import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css"

export default function Conversation({ conversation, currentUser }) {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== "6332c906d0b824a970f4ff52");
    const getUser = async () => {
      try {
        const res = await axios("http://localhost:8800/api/users?userId="+friendId);  
        setUser(res.data);
      } catch (err) {
        console.log(err); 
      }
    };
    getUser();
  }, [currentUser, conversation]);


  return (
    <div className='conversation'>
      <img className='conversationImg' src='https://khunganhonline.com/images/frame/frame_icon/frame-hinh-giot-nuoc-4005aed94ca66b9f.jpg' alt='avarta' />
       <span className='conversationName'>{user?.username}</span>
      <span className='time'>09:00</span>
    </div>
  )
}
