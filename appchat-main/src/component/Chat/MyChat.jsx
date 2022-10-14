import { Component, useEffect, useState , useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Tooltip from "@mui/material/Tooltip";
import Conversation from '../../component_detal/conversations/Conversation';
import Message from '../../component_detal/message/Message';
import "../../component_detal/message/message.css";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InputEmoji from "react-input-emoji";
import SendIcon from '@mui/icons-material/Send';
import axios from "axios";



export default function MyChat() {


  const [conversations, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [myFriend, setMyFriend] = useState([]);
  const [newMessage, setNewMessages] = useState("");
  const user = {
    _id: "6332c906d0b824a970f4ff52",
    username: "kely",
    password: "12345",
    email: "lekhoavan@gmail",
    following: [
      "6332d32ed0b824a970f4ff53"
    ]
  };

  // const receiverId = currentChat.members.find(
  //   (member) => member !== user._id
  // );
  // console.log(receiverId);

  useEffect(() => {
    const getMyFriend = async () => {
      try { 
        const res = await axios.get("http://localhost:8800/api/conversations/findById/"+currentChat?._id);
        const friendId = res.data.find((m) => m !== "6332c906d0b824a970f4ff52");
        console.log(friendId)
        const friend = await axios.get("http://localhost:8800/api/users?userId="+friendId);  
        console.log(friend);
        setMyFriend(friend.data);
      } catch (err) {
        console.log(err); 
      }
    };
    getMyFriend();
  },[user._id,currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/messages/" + currentChat?._id);
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

 
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/conversations/" + user._id);
        setConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [user._id]);

  const sendSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    try {
      const res = await axios.post("http://localhost:8800/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessages("");
    } catch (err) {
      console.log(err);
    }
  };

  function AutoScroll(){
    var element = document.querySelector(".live-chat");

    element.scrollTop = element.scrollHeight ;
  }


  return (
    <>
    <div>
      <div className="mychat-cont">
        <div className="search-c">
          <div className="search-cont">
            <SearchIcon />
            <input type="text"placeholder="Tìm kiếm"/>
          </div>
          <Tooltip placement="bottom-end"  title="Thêm bạn"> 
          <PersonAddAlt1Icon />
          </Tooltip>
          <Tooltip  placement="bottom-end" title="Tạo nhóm chat">
            <GroupAddIcon />
          </Tooltip>
        </div>
        <div className="recent-chat">
          <p className="Recent"></p>
          <div className="recent-user">

            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} />
              </div>
            ))}


          </div>
        </div>

      </div>
      <div className="chattingpage">
          {
                    currentChat  ?
                <>    
            <div className="top-header">
                <div className="user-header">
                    <Avatar>TN</Avatar>
                    <p className="user-name">{
                        myFriend.username 
                        
                    }</p>
                </div>
                <div>
                    <div className="user-fet">
                        <Tooltip
                            title="Tìm kiếm tin nhắn"
                            placement="bottom-end">
                            <SearchIcon />
                        </Tooltip>
                        <Tooltip
                            title="Cuộc gọi thoại"
                            placement="bottom-end">
                            <CallIcon />
                        </Tooltip>
                        <Tooltip
                            title="Cuộc gọi video"
                            placement="bottom-end">
                            <VideoCallIcon />
                        </Tooltip>
                        <Tooltip
                            title="Thông tin"
                            placement="bottom-end">
                            <MoreHorizIcon />
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div onLoad={AutoScroll} className="live-chat">  
                <div>
                  {messages.map((m) => (
                     <Message message={m} own ={m.sender === user._id}/>
                  ))} 
                </div>   
            </div>

            <div className="sender-cont">
                <div className="send-message">

                <InputEmoji  onChange ={(e) => setNewMessages(e)} 
                    value={newMessage}
                     placeholder="Nhập tin nhắn"/>

                </div>

                <Button  variant="contained"  className="sendbutton" endIcon={<SendIcon/>}
                          onClick={sendSubmit}>
                </Button>
            </div>
            </> : <span className="noChat">Chưa có tin nhắn</span>
          }  
        </div>
    </div>
    </>
  );
}


