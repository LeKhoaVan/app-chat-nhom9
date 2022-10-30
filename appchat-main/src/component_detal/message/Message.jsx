import "./message.css";
import moment from "moment";
import axios from "axios";
import { Component, useEffect, useState, useRef, useContext} from "react";


export default function Message({ message, own, onClickDelete, userId, onClickDeleteMgsUser, onClickDeleteMgsFri, avatar  }) {

  
  const [user, setUser] = useState([]);
  const [messageDelete, setMessageDelete] = useState(null);


  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios("http://localhost:8800/api/users/name?userId="+message.sender);  
        setUser(res.data);
      } catch (err) {
        console.log(err); 
      }
    };
    getUser();
  }, [message]);



 const handleDeleteMessage = async () => {
    try {
       
        const res = await axios.put("http://localhost:8800/api/messages/recall", {"id": message._id} );
        console.log(res.data);
        message.text = "tin nhắn đã được thu hồi"
        onClickDelete(message._id);
      } catch (err) {
        console.log(err);
      };
  };

  const handleDeleteMgsUser = async () =>{
    try {
      const data = {
        id: message._id,
        delUser : userId
      };

      const res = await axios.put("http://localhost:8800/api/messages/del",data );
      console.log(res.data);
      onClickDeleteMgsUser(message._id);
    } catch (err) {
      console.log(err);
    };
  };

  const handleDeleteMgsFri = async() => {
    try {
      const data = {
        id: message._id,
        delUser : userId
      };
  
      await axios.put("http://localhost:8800/api/messages/del",data );
      message.delUser =  "OneNexius209"
      onClickDeleteMgsFri("OneNexius209");
      console.log(message._id)
    } catch (err) {
      console.log(err);
    };
  };

  
  

  if(own){
    return (
      <ul class="dropdown-own">
      <div className={own ? "message own" : "message"}>
        
          <div className="messageTop">
              <div className="messageText">
                <p>{message.text}</p>
                <div class="dropdown-content-own">
                  <li>
                    <span className="sendbutton" onClick={handleDeleteMessage}>
                     thu hồi
                    </span> 

                    <span className="sendbutton" onClick={handleDeleteMgsUser} >
                      xóa phía mình
                    </span> 
                    <span className="sendbutton" >
                      ghim
                    </span> 
                  </li>
                </div>
              </div>
              <img
                className="messageImg"
                src={avatar}
                alt=""
              />
            
          </div>
          <div className="messageBottom">{moment(message.createdAt).format("LT")}</div>
        
      </div>
      </ul>
    );
  }
  else{
    return (
      <div className={own ? "message own" : "message"}>
        <ul class="dropdown">
          <div className="messageTop">
            <img
                className="messageImg"
                src={user.avt}
                alt=""
              />
              <div className="messageText">
              <span className="owner">{user.username}</span>
              
              <p>{message.text}</p>
                <div class="dropdown-content">
                <li>
                    <span className="sendbutton" onClick={handleDeleteMgsFri}>
                      xóa bên mình
                    </span> 
                    <span className="sendbutton" >
                      ghim
                    </span> 
                </li>
              </div>
            
            </div>
            
          </div>
          <div className="messageBottom">{moment(message.createdAt).format("LT")}</div>
        </ul>
      </div>
    );
  }
}
