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
  const [authorize, setAuthorize] = useState([]);
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

   function SetAuth(conId, userId){

    const article = { conId,userId };
    const con = axios.put('http://localhost:8800/api/conversations/setAuthorize', article)
    con.then(value => {
      setAuthorize(value.data)
    })
    
  }

  function RemoveAuth(conId, userId){
    const article = { conId,userId };
    const con = axios.put('http://localhost:8800/api/conversations/removeAuthorize', article)
    con.then(value => {
      setAuthorize(value.data)
    })
    
  }

   function RemoveUserCon(conId, userId){
   
    const article = { conId,userId };
    const con = axios.put('http://localhost:8800/api/conversations/removeMember', article)

    con.then(async value => {
      let list = [];
      for (let index = 0; index < value.data.length; index++) {
          const res = await axios.get("http://localhost:8800/api/users?userId="+ value.data[index]); 
          list.push(res.data)  
      }
      setUserCons(list);
    })
    
    
   
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
      setUserCons(list);
    };
    getUserCon();
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
              <div onClick={() => {
                setCurrentChat(c)
                setAuthorize(c.authorization)
              }}>
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
              
              <Avatar src="data:image/jpeg;base64,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"
                sx={{width:70,height:70}}>
                </Avatar>
              <div className="name_con">
                <p className="text_name">{currentChat?.name}</p>
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
                            <div className="avt"><img src={user.avt ? user.avt : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHoAUQMBIgACEQEDEQH/xAAaAAADAQEBAQAAAAAAAAAAAAADBAUCAQAG/8QAOhAAAQQABAMFBAgFBQAAAAAAAQACAxESITFBBBNRBSJhgZEUccHRJDIzQlKhseEVU3KS8AYWQ2Jz/8QAGgEAAwEBAQEAAAAAAAAAAAAAAQIDBAAFBv/EACQRAAIBAwQBBQEAAAAAAAAAAAABAgMREgQTITFRIkGRobEU/9oADAMBAAIRAxEAPwBWGGqI0R+XYy1R44C0JgRd0Yh5r0XIyUqTtawgyI6O12ReSa0TYY0EWPNMN4a2pXNLs0U9LKfEeSS6GyguhN5BWH8OQl3w52njMz1tO49kqWHCM9SlxHqFUlZSAYd1aLPOqx9XBNmhytAkhoWPNVnxWEGSCwqKRlnSvdpEvlnovKh7KvJs0Q2ang+jjaWo4aayRxCDstCKl57dz66EHEWwWbKMLAz0RWxi6IWntAbVDJTk0a6FOXLixZzbGWSXkZSbL2VuCsuYH5jNPCxm1Sk+GTnR2VkxKjyPBZdCOivkjzZUWyYYlh0KpOiAFoDwEckTVBoR5K8mLC8hkHaZdbE+I2XW3omGssWmWgFEawLHke+4CYjzXnQ3unBEAulgq0bhSceiceGJyIBCE7hXg9wUqpMbdXD1XQ1r220gg7go3FlHyTGsfXeaLQZIHlxNUq7mAJaeWJn13NHvRyJqll0RZ2yOBA1SEscoGXqVT4jiGNxGKYYj0agMa1/fnmB8KyTKROdFIlcqX8bV5Vfon4Geq8myJbR9Q+MxiyMuoQBNhP1ifBTj21M9mGPC0/8AZt/EJeXtCfBieyIncxtP7rGkz120XBxF5YUhxvG4LDWuaCNS74JJvajY83RP/Vb4ztx2TWkNyyIAsfqmSYucUT/bxHOcYDheVlPf7ia1oDTkNmtASxkbxQuXiGEnW2C0vJwPDF14mmuli0ylHpjS0taXrj0UH/6h5oDeSK3dmhv7WgkJMjYy4ddEh7NA1zncwNHRu3qkpouFDz9IcSdRqmun0IqUqavNoo8R2zEGGmWBsKCkTdoPlf3YjS7y+DA7rnYurgvOjDa5cxN7BUSSMlWU5cR6Me0zfyXei8vVJ+N66m4M+3UBfxRu3E5/+Z+a6O03hx+lNr+mvip8cR6N9EdkcX3i3zCmx0m/cZPGl+vEtPkPmuHiS4EDiW0ddM/zWI4oiT3Wu9xCZbwsBH2fvQc7Dqhf3FC6XIt4iLxsgZ+q6X8S/wCvxLCN8Lm/NOjg+HP3fzXfYoDohulFpmum/lkuZk+WGUOzz77Rl6ofsxdm6ZwPhI35qq7gYgP2QzwMPX8kyrslLQxb5/SW7ggW2Znl16Y2162hnhHV9uR7y0/FVHdnQnQj0QX9nRbEJlXkRloIeCX7LP8Azmf3BdT/APD4uo9F1NvyJ/wQ8fZxrraLPmUSPC5ugy3CnGdrciMqzKb4eWN1CPRTaLQkORuoAtaPJG5mzikrc0YQAQcgttn7wJIB8yPVI4miM7DofnTnDPxW+YTVWkmSE5uO/XK13nB2THDXMhDEoqg5jsfFYElt3yKX5luNt0GvVZ5oByzo6DZDE7cCvkAN5DqsOeKtDdLmRsgOmNjLyCZInKYfGuoHMXk2Im4TLaXNtuI0EzE5zTRaABqb0SURLqJNDetUVpFEPfk/etPcqWMkZD4LcQe2r/VYoGrFgeHTfolxJhFMvTyC2JCCSSlsUyDNdbSWGhVAkIkbsDQKz3ACDjGQWTINjlsusNkMiQYqxZhZxZknPceCXMuGjlpVBYxODyL8iV1jnMZdJmKzHpSy94rwQOZZBJsBDc8mqOmqNibmHxt6uXkvzPAeq8usDIVMlgiqINkrhcTo6gTmhDQLTtfMIsmhgOGIm7sWTeQWxJkDsl/+NvuWm/UHvROuMcw7FaMmmeiXbr5rn3L8Vwbh+ZZonxWJZSQ54A1pDP2h/pXD02XHXCGbu93dDc4V3aCxshHQ+9BgQbEP8K4lbPUrqGQbH//Z"} /></div>
                          
                          
                          <div className="text">
                            <p className="">{user.username}</p>
                            <p className="auth">
                            {authorize.map( (auth)=>(
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
                    
                              {authorize.map( (auth1)=>( 
                                auth1 === user._id ?
                                 <div className="item"
                                 onClick={() => RemoveAuth(currentChat._id,user._id)}>Gỡ quyền quản trị viên</div> 
                                 :
                                 <div></div>
                              ))}

                            {
                              
                              
                              authorize.some( (auth1)=>( 
                                auth1 === user._id
                              )) ? <div></div> : <div className="item"
                                onClick={() => {SetAuth(currentChat._id,user._id)
                                }}>Chỉ định quản trị viên</div>
                             
                            } 
                                <div className="item" onClick={() => {
                                  RemoveUserCon(currentChat._id,user._id)
                                  
                                }} 
                                >Xóa khỏi nhóm</div>
                               
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