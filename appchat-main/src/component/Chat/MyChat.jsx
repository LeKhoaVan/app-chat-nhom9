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
//import 'bootstrap/dist/css/bootstrap.css';

import Popup from "./Popup";


export default function MyChat() {
  const {authState:{user:{avt, _id, }}} = useContext(AuthContext)

  const [conversations, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [myFriend, setMyFriend] = useState([]);
  const [userCons, setUserCons] = useState([]);
  const [userAuth, setUserAuth] = useState("");
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

  useEffect(() => {
    const getUserCon = async () => {
      let list = [];
      for (let index = 0; index < currentChat?.members.length; index++) {
        try {
          const res = await axios.get("http://localhost:8800/api/users?userId="+ currentChat?.members[index]); 
          list.push(res.data)
        } catch (err) {
          console.log(err);
        }
        
      }
      console.log(list);
      setUserCons(list);
    };
    getUserCon();
    console.log(currentChat)
  },[currentChat]);

  
  

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
            <div className="user_con">
              <div className="iv_title">
                <p>Thành viên</p>
                <ArrowDropDownIcon/>
              </div>
              <div className="iv_main">
                <ul className="list-user">
                  {userCons.map( (user)=>(
                    <li>
                            <div className="avt"><img src={user.avt ? user.avt : "data:image/jpeg;base64,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"} /></div>
                          
                          
                          <div className="text">
                            <p className="">{user.username}</p>
                            <p className="auth">
                            {currentChat.authorization.map( (auth)=>(
                              auth===user._id ? "Quản trị viên" : ""
                            ))}
             
                            </p>
                          </div>
                              
                          {currentChat.authorization.map( (auth)=>(
                              auth != _id || user._id == _id ?  
                               <div></div> : 
                            <div className="more">
                              <MoreHorizIcon/>
                              <div className="more-option">
                    
                              {currentChat.authorization.map( (auth1)=>( 
                                auth1 === user._id ?
                                 <div className="item">Gỡ quyền quản trị viên</div> 
                                 :
                                 <div></div>
                              ))}

                            {
                              
                              
                              currentChat.authorization.some( (auth1)=>( 
                                auth1 === user._id
                              )) ? <div></div> : <div className="item">Chỉ định quản trị viên</div>
                             
                            } 
      
                                <div className="item">Xóa khỏi nhóm</div>
                               
                             </div>
                           </div>
                           
                          ))}
                          
                           
                      
                          
                      
                    </li>

                  ))}


            
                </ul>
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
  <div className="form-group">
    <label for="exampleFormControlInput1">Nhập tên nhóm</label>
    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Nhập tên nhóm"></input><br></br>
  </div>
  
  <div className="input-group">
  <input type="search" className="form-control rounded" placeholder="Tìm kiếm"  aria-describedby="search-addon" />
  <button type="button" className="btn btn-outline-primary">Tìm</button>
</div>

<div><p>____________________________________________________________________________</p></div>
<div className="form-check">
  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
  <label className="form-check-label" for="flexRadioDefault1">
    Nguyễn Hoàng Quân
  </label>
</div>
<div className="form-check">
  <input className="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" checked></input>
  <label className="form-check-label" for="flexRadioDefault2">
    Nguyễn Hoàng Quan
  </label>
</div>



<br></br>
<button type="button" className="btn btn-primary">Tạo nhóm</button>
<button type="button" className="btn btn-secondary">Huỷ</button>
  
</form>
        </Popup>
    </div>
  );
}