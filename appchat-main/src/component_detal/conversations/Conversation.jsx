import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css"
import * as moment from 'moment';
import 'moment/locale/vi';





export default function Conversation({ conversation, currentUser, timeM, myMes,recall , active}) {
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
        console.log(res.data.sender)
        // const newM = res.data;
        
        
        if(res.data.conversationId === conversation._id){
          if(res.data.reCall === true){
            res.data.text = "tin nhắn đã thu hồi"
            setNewMes(res.data)
          }
          else{
            setNewMes(res.data);
          }
        }

        

        console.log(res.data)
          
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
      <div className={active ? "bodyConversation active" : "bodyConversation"}>
        <div className='conversation'>
          <img className='conversationImg' src={conversation.name? conversation.img: user.avt  } alt='avarta'  />
          <div className="conversationGrMess">
            <span className='conversationName'>{conversation.name? conversation.name : user.username  }</span>
            <span className="messageConver">
            {recall? recall.conversationId === conversation._id?
                <>
                 {myMes ?
                  <>
                  {myMes.sender === currentUser? "Bạn": myMes.username} : {recall.text}
                  </> 

                  :

                  <>
                  {newMes.sender === currentUser? "Bạn": newMes.username} : tin nhắn đã được thu hồi
                  </>

                  }
                </>
                :
                <>
                  {myMes ? 
                  (
                    myMes.conversationId === conversation._id ? 
                    <>
                      {myMes.sender === currentUser? "Bạn": myMes.username} : {(myMes.type==0? myMes.text:( myMes.type == 1 ? "img" :"file"))}
                    </>
                    : 
                    <>
                      {(newMes ? (newMes.sender === currentUser ? "bạn" : userName) : "bạn")} : {newMes !== "" ? newMes.text : "vừa tham gia nhóm"} 
                    </>     
                  )
                  :
                  (    
                    <>
                      {(newMes ? (newMes.sender === currentUser ? "bạn" : userName) : "bạn")} : {newMes !== null ? (newMes !== null && newMes.type==0 ? newMes.text : (newMes.type == 1 ? "img" :"file")) : "vừa tham gia nhóm"} 
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
                      {myMes.sender === currentUser? "Bạn": myMes.username} : {(myMes.type==0? myMes.text:( myMes.type == 1 ? "img" :"file"))}
                    </>
                    : 
                    <>
                      {(newMes ? (newMes.sender === currentUser ? "bạn" : userName) : "bạn")} : {(newMes !== null && newMes.type==0 ? newMes.text : (newMes.type == 1 ? "img" :"file"))} 
                    </>     
                  )
                  :
                  (    
                    <>
                     {(newMes ? (newMes.sender === currentUser ? "bạn" : userName) : "bạn")} : {(newMes !== null && newMes.type==0 ? newMes.text : (newMes.type == 1 ? "img" :""))} 
                    </>     
                  )       
                }
                </>
                }

            </span>
          </div>
          <span className='time'>
            {myMes? 
              <>
                {myMes.conversationId === conversation._id? moment(myMes.createdAt).fromNow(): moment(newMes.createdAt).fromNow()}
              </>
              :
              <>
                {moment(newMes.createdAt).fromNow()}
                
              </>
              }
              
             
          </span>
        </div>
      
        
      </div>
      
    )
  

  
}
