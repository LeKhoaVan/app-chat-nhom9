import "./message.css";
import * as moment from 'moment';
import 'moment/locale/vi';
import axios from "axios";
import { Component, useEffect, useState, useRef, useContext } from "react";


export default function Message({ message, own, onClickDelete, userId, onClickDeleteMgsUser, onClickDeleteMgsFri, avatar }) {


  const [user, setUser] = useState([]);
  const [messageDelete, setMessageDelete] = useState(null);


  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await axios("http://localhost:8800/api/users/name?userId="+message.sender);  
  //       setUser(res.data);
  //     } catch (err) {
  //       console.log(err); 
  //     }
  //   };
  //   getUser();
  // }, [message]);



  const handleDeleteMessage = async () => {
    try {

      const res = await axios.put("http://localhost:8800/api/messages/recall", { "id": message._id });
      console.log(res.data);
      message.text = "tin nhắn đã được thu hồi"
      message.reCall=true
      message.type=0
      onClickDelete(message._id);
    } catch (err) {
      console.log(err);
    };
  };

  const handleDeleteMgsUser = async () => {
    try {
      const data = {
        id: message._id,
        delUser: userId
      };

      const res = await axios.put("http://localhost:8800/api/messages/del", data);
      console.log(res.data);
      onClickDeleteMgsUser(message._id);
    } catch (err) {
      console.log(err);
    };
  };

  const handleDeleteMgsFri = async () => {
    try {
      const data = {
        id: message._id,
        delUser: userId
      };

      await axios.put("http://localhost:8800/api/messages/del", data);
      message.delUser = "OneNexius209"
      onClickDeleteMgsFri("OneNexius209");
      console.log(message._id)
    } catch (err) {
      console.log(err);
    };
  };



  if (own) {
    return (
      <div className={own ? "message own" : "message"}>
      <ul class="dropdown">
          <div className="messageTop">
              <div className="messageText">
               
              {message.type === 0 ? <p>{message.text}</p> : ''}
              {message.type === 1 ? <img src={message.text} className="messageImgSend"></img> : ''}
              {message.type === 2 ? <video id="my_video_1" width="100%" class="video-js vjs-default-skin"
                controls
              >
                <source src={message.text} type='video/mp4' />

              </video> : ''}

              {message.type === 3 ? <iframe src={message.text} width="100%" height="500px">
              </iframe> : ''}

                <div class="dropdown-content own">
             
                    <li className="sendbutton" onClick={handleDeleteMessage}>
                     thu hồi
                    </li> 

                    <li className="sendbutton" onClick={handleDeleteMgsUser} >
                      xóa phía mình
                    </li> 
                    <li className="sendbutton" >
                      ghim
                    </li> 
      
                </div>
              </div>
              <div className="messageImg"> <img
              className="messageImg"
              src={avatar}
              alt=""
            /></div>
          </div>
         
       

      
      </ul>
      <div className="messageBottom">{moment(message.createdAt).fromNow()}</div>
      </div>
    );
  }
  else {
    return (
      <div className={own ? "message own" : "message"}>
        <ul class="dropdown">
          <div className="messageTop">
            {message.avt?
            <img
                className="messageImg"
                src={message.avt}
                alt=""
              />:<view className="messageImg"></view>}
              <div className="messageText">
              <span className="owner">{message.username}</span>
              {message.type === 0 ? <p>{message.text}</p> : ''}
              {message.type === 1 ? <img src={message.text} width="100%" height="450px"></img> : ''}
              {message.type === 2 ? <video id="my_video_1" width="100%" class="video-js vjs-default-skin"
                controls
              >
                <source src={message.text} type='video/mp4' />

              </video> : ''}

              {message.type === 3 ? <iframe src={message.text} width="100%" height="500px">
              </iframe> : ''}
                <div class="dropdown-content">
                <li>
                  <span className="sendbutton" onClick={handleDeleteMgsFri}>
                    xóa phía mình
                  </span>
                  <span className="sendbutton" >
                    ghim
                  </span>
                </li>
              </div>

            </div>

          </div>
          
        </ul>
        <div className="messageBottom">{moment(message.createdAt).fromNow()} </div>
      </div>
    );
  }
}
