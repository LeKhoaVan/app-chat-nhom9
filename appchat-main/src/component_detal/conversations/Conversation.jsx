import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css"
import moment from "moment";





export default function Conversation({ conversation, currentUser, timeM, myMes,recall}) {
  const [user, setUser] = useState([]);
  const [newMes, setNewMes] = useState([]);
  const [userName, setUserName] = useState([]);


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


  useEffect(() => {
    const getNewMes = async () => {
      //http://localhost:8800/api/messages/lastmess/63681efaf338cdd7632c04f1
      try {
        const res = await axios("http://localhost:8800/api/messages/lastmess/"+conversation._id);
        const newM = res.data;

        
        if(res.data.conversationId === conversation._id){
          if(newM.reCall){
            newM.text = "tin nhắn đã thu hồi"
            setNewMes(newM)
          }
          else{
            setNewMes(newM);
          }
        }

        

        console.log(newMes)
          
      } catch (err) {
        console.log(err); 
      }
    };
    getNewMes();
  }, [conversation]);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const res = await axios("http://localhost:8800/api/users?userId="+newMes.sender);  
        setUserName(res.data.username);
        
      } catch (err) {
        console.log(err); 
      }
    };
  
    getUserName();
  },[newMes]);

  
    return (
      <div className="bodyConversation">
        <div className='conversation'>
          <img className='conversationImg' src={conversation.name? conversation.img: user.avt  } alt='avarta'  />
          <span className='conversationName'>{conversation.name? conversation.name : user.username  }</span>
          <span className='time'>
            {myMes? 
              <>
                {myMes.conversationId === conversation._id? moment(myMes.createdAt).format("LT"): moment(newMes.createdAt).format("LT")}
              </>
              :
              <>
                {moment(newMes.createdAt).format("LT")}
                
              </>
              }
              
             
          </span>
        </div>
      
        <div>
            <span className="messageConver">
             {recall? recall.conversationId === conversation._id?
            <>
              {myMes.sender === currentUser? "Bạn": myMes.username} : {recall.text}
            </> 
            :
            <>
               {myMes ? 
              (
                myMes.conversationId === conversation._id ? 
                <>
                  {myMes.sender === currentUser? "Bạn": myMes.username} : {myMes.text}
                </>
                : 
                <>
                  {(newMes ? (newMes.sender === currentUser ? "bạn" : userName) : "bạn")} : {newMes !== null ? newMes.text : "vừa tham gia nhóm"} 
                </>     
              )
              :
              (    
                <>
                  {(newMes ? (newMes.sender === currentUser ? "bạn" : userName) : "bạn")} : {newMes !== null ? newMes.text : "vừa tham gia nhóm"} 
                </>     
              )       
            }
            </>
            :
            <>
               {myMes ? 
              (
                myMes.conversationId === conversation._id ? 
                <>
                  {myMes.sender === currentUser? "Bạn": myMes.username} : {myMes.text}
                </>
                : 
                <>
                  {(newMes ? (newMes.sender === currentUser ? "bạn" : userName) : "bạn")} : {newMes !== null ? newMes.text : "vừa tham gia nhóm"} 
                </>     
              )
              :
              (    
                <>
                  {(newMes ? (newMes.sender === currentUser ? "bạn" : userName) : "bạn")} : {newMes !== null ? newMes.text : "vừa tham gia nhóm"} 
                </>     
              )       
            }
            </>
            }
          </span>
  
        </div>
      </div>
      
    )
  

  
}
