import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css"
import moment from "moment";

export default function Conversation({ conversation, currentUser}) {
  const [user, setUser] = useState([]);
  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser);
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
       <span className='conversationName'>{conversation.name? conversation.name : user.username  }</span>
      <span className='time'>09:00</span>
    </div>
  )
}
