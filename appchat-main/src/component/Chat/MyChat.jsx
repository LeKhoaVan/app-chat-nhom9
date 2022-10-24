import { Component, useEffect, useState, useRef, useContext} from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Tooltip from "@mui/material/Tooltip";
import Conversation from '../../component_detal/conversations/Conversation';
import Message from '../../component_detal/message/Message';
import "../../component_detal/message/message.css";
import { Alert, Button, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InputEmoji, { $$typeof } from "react-input-emoji";
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import EditIcon from '@mui/icons-material/Edit';
import axios from "axios";
import ChattingPage from "./ChattingPage";
import Edit from "@mui/icons-material/Edit";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import avatar from '../../assets/avatar.jpg'; 
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import {io} from "socket.io-client";
import {AuthContext} from "../../contexts/AuthContext";

import Popup from "./Popup";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MyChat() {
  const {authState:{user:{avt, _id, }}} = useContext(AuthContext)

  const [conversations, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [myFriend, setMyFriend] = useState([]);
  const [newMessage, setNewMessages] = useState("");
  const [arrivalMessage, setArrivalMessages] = useState(null);
  const [senderMessage, setSendMessage] = useState([]);
  const socket = useRef();

  const [openPopup, setOpenPopup] = useState(false);


  function Demo(){
    const morInfo = document.querySelector(".morInfo_con");
    const cssObj = window.getComputedStyle(morInfo,null);
    const width_morInfo = cssObj.getPropertyValue("display");
    if(width_morInfo==="none"){
      document.querySelector(".chattingpage").style.width='50%';
      document.querySelector(".morInfo_con").style.display='flex';
    }
    else{
      document.querySelector(".chattingpage").style.width='73%';
      document.querySelector(".morInfo_con").style.display='none';
    }
  }

  

  // const receiverId = currentChat.members.find(
  //   (member) => member !== user._id
  // );
  // console.log(receiverId);
  useEffect(() =>{
    socket.current = io("ws://localhost:8900");
    socket.current.on("getMessage", (data) =>{
      setArrivalMessages({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      })
    });
  },[]);

  useEffect(() =>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) && 
    setMessages((prev)=>[...prev, arrivalMessage])
  },[arrivalMessage, currentChat])

  useEffect(() => {
    socket.current.emit("addUser", _id);
    socket.current.on("getUsers", (users) => {
      // console.log(users)
    })
  },[_id]);

  useEffect(() => {
    const getMyFriend = async () => {
      try { 
        const res = await axios.get("http://localhost:8800/api/conversations/findById/"+currentChat?._id);
        const friendId = res.data.find((m) => m !== _id);
        console.log(friendId)
        const friend = await axios.get("http://localhost:8800/api/users?userId="+friendId);  
        console.log(friend);
        setMyFriend(friend.data);
      } catch (err) {
        console.log(err); 
      }
    };
    getMyFriend();
  },[_id,currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/messages/" + currentChat?._id);
        setMessages(res.data);
        console.log(currentChat.members[2])
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

 
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/conversations/" + _id);
        setConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [_id]);

  const sendSubmit = async (e) => {
    e.preventDefault();
    const message = {
      sender: _id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    // const receiverId = currentChat.members.find(
    //   (member) => member !== _id
    // );
    const receiverIds = [];
    
    for (let index = 0; index < currentChat.members.length; index++) {
      if (currentChat.members[index] !== _id) {
        receiverIds.push(currentChat.members[index]);
      }
    }

    socket.current.emit("sendMessage", {
      senderId: _id,
      receiverIds,
      text: newMessage,
    });


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
    <div className="fullSc">
      {/* <div className="side-nav">
        <div>
          <Avatar  
            className="avatar"
            alt="avatar" 
            src={avatar}
            sx={{width:46,height:46}}/>
        </div>
        <div className="icon">
          <Tooltip placement="bottom-end" title="Chats">
            <ChatOutlinedIcon />
              </Tooltip>
            <Tooltip placement="bottom-end" title="Contacts">
              <PermContactCalendarIcon />
            </Tooltip>
            <Tooltip placement="bottom-end" title="Settings">
              <SettingsOutlinedIcon />
            </Tooltip>
        </div>
      </div> */}
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
          <IconButton onClick={() => { setOpenPopup(true);  }}><GroupAddIcon /></IconButton>

          </Tooltip>
        </div>
        <div className="recent-chat">
          <p className="Recent"></p>
          <div className="recent-user">

          {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)}>
                <Conversation conversation={c} currentUser={_id} />
              </div>
            ))}
            
          </div>
        </div>

      </div>
      <div className="chattingpage" id="chattingpage">
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
                            <IconButton>
                              <SearchIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title="Cuộc gọi thoại"
                            placement="bottom-end">
                            <IconButton>
                              <CallIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title="Cuộc gọi video"
                            placement="bottom-end">
                            <IconButton>
                              <VideoCallIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            title="Thông tin"
                            placement="bottom-end">
                            <IconButton
                              onClick={Demo}>
                              <MoreHorizIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <div onLoad={AutoScroll} className="live-chat">  
                <div>
                  {messages.map((m) => (
                     <Message message={m} own ={m.sender === _id}  />
                  ))} 
                </div>   
            </div>
            <div className="sender-cont">
                <div className="send-message">
                  <InputEmoji  onChange ={(e) => setNewMessages(e)} 
                      value={newMessage}
                      placeholder="Nhập tin nhắn"/>
                  <Tooltip
                  title="Gửi hình ảnh"
                  placement="bottom-end">
                  <ImageIcon />
                </Tooltip>
                <Tooltip
                  title="Đính kèm file"
                  placement="bottom-end">
                  <AttachFileIcon/>
                  </Tooltip>
                </div>
                  <Tooltip
                    title="Gửi tin nhắn"
                    placement="bottom-end">
                    <span
                      className="sendbutton"
                      onClick={sendSubmit}>
                      <SendIcon/>
                    </span>
                  </Tooltip>
            </div>
            </> : <span className="noChat">Chưa có tin nhắn</span>
          }  
        </div>
        <div className="morInfo_con">
          <div className="namechat">
            <p className="text_namechat">Thông tin hội thoại</p>
          </div>
          <div className="mainInfo">
            <div className="infomation_con">
              <Avatar
                sx={{width:70,height:70}}>
                TN</Avatar>
              <div className="name_con">
                <p className="text_name">Nguyễn Thái Nguyên</p>
                <Tooltip 
                  title="Chỉnh sửa"
                  placement="bottom-end">
                  <IconButton>
                    <Edit/>
                  </IconButton>
                </Tooltip>
              </div>
              <div className="edit_button">
                <IconButton>
                  <GroupAddIcon />
                </IconButton>
                <p className="title_edit_button">Tạo nhóm trò chuyện</p>
              </div>
            </div>
            <div className="image_video_con">
              <div className="iv_title">
                <p>Ảnh/Video</p>
                <ArrowDropDownIcon/>
              </div>
              <div className="iv_main">
                <p className="not_value">Chưa có ảnh/video được chia sẻ trong hội thoại này</p>
                <span className="button_iv">
                  Xem tất cả
                </span>
              </div>
            </div>
            <div className="file_con">
              <div className="iv_title">
                <p>File</p>
                <ArrowDropDownIcon/>
              </div>
              <div className="iv_main">
              <p className="not_value">Chưa có tài liệu được chia sẻ trong hội thoại này</p>
                <span className="button_iv">
                  Xem tất cả
                </span>
              </div>
            </div>
            <div className="link_con">
              <div className="iv_title">
                <p>Link</p>
                <ArrowDropDownIcon/>
              </div>
              <div className="iv_main">
              <p className="not_value">Chưa có link được chia sẻ trong hội thoại này</p>
                <span className="button_iv">
                  Xem tất cả
                </span>
              </div>
            </div>
            <div className="security_con">
              <div className="iv_title">
                <p>Thiết lập bảo mật</p>
                <ArrowDropDownIcon/>
              </div>
              <div className="iv_main">
                <span className="removeall">
                  <DeleteOutlineIcon/>
                  <p>Xóa lịch sử trò chuyện</p>
                </span>
              </div>
            </div>
          </div>
        </div>


        <Popup
                title="Tạo nhóm"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            <form>
  <div class="form-group">
    <label for="exampleFormControlInput1">Nhập tên nhóm</label>
    <input type="text" class="form-control" id="exampleFormControlInput1" placeholder="Nhập tên nhóm"></input><br></br>
  </div>
  
  <div class="input-group">
  <input type="search" class="form-control rounded" placeholder="Tìm kiếm"  aria-describedby="search-addon" />
  <button type="button" class="btn btn-outline-primary">Tìm</button>
</div>

<div><p>____________________________________________________________________________</p></div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
  <label class="form-check-label" for="flexRadioDefault1">
    Nguyễn Hoàng Quân
  </label>
</div>
<div class="form-check">
  <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked></input>
  <label class="form-check-label" for="flexRadioDefault2">
    Nguyễn Hoàng Quan
  </label>
</div>



<br></br>
<button type="button" class="btn btn-primary">Tạo nhóm</button>
<button type="button" class="btn btn-secondary">Huỷ</button>
  
</form>
        </Popup>
    </div>
  );
}