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


//Avarta
import PopupAvartar from "./Avarta/Popup";
import FileInput from "./Avarta/FileInput";
import styles from "./Avarta/styles.module.css";


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
  const [recallMessage, setRecallMessages] = useState(null);
  const [deleteMessage, setDeleteMessages] = useState([]);
  const [listUserGroupNew, setListUserGroupNew] = useState([]);
  const [userSearch, setUserSearch] = useState(null);

  const socket = useRef();

  const [openPopup, setOpenPopup] = useState(false);




  // poppu onpen form Avarta
const [openPopupAvarta, setOpenPopupAvarta] = useState(false);

 

const [data, setData] = useState({
  name: "",
  img: ""
});

const handleChange = ({ currentTarget: input }) => {
  setData({ ...data, [input.name]: input.value });
};

const handleInputState = (name, value) => {
  setData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const url = "http://localhost:8800/api/conversations/updateImg/"+currentChat?._id;
    const { data : res } = await axios.put(url,data);
    console.log(res)
    
  } catch (error) {
    console.log(error)
  }
  
};





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
    socket.current.on("getMessage",(data) =>{
      setArrivalMessages({
        sender: data.senderId,
        text: data.text,
        delUser: data.delUser,
        conversationId: data.conversationId,
        createdAt: Date.now(),
      })
    });  
  },[currentChat]);

  

  useEffect(() =>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
    currentChat?._id === arrivalMessage.conversationId && 
    setMessages((prev)=>[...prev, arrivalMessage])
    console.log(arrivalMessage)
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
      let messageList =[];
      try {
        const res = await axios.get("http://localhost:8800/api/messages/" + currentChat?._id); 

        for(let i =0; i< res.data.length;i++) {
          if(res.data[i].delUser[0] !== _id) {
            if(res.data[i].reCall === true){
              res.data[i].text = "tin nhắn đã được thu hồi"
              messageList.push(res.data[i]);
            }
            else{
              messageList.push(res.data[i]);
            }
          }
          
        }

        for(let i =0; i< res.data.length;i++) {
          
        }
        setMessages(messageList);
      } catch (err) {
        console.log(err);
      }
    };
    getMessages();
  }, [currentChat]);

  // useEffect(() => {
  //   socket.current.emit("authorize", );
  //   socket.current.on("getAu", (data) => {
      
  //   })
  // },[authorize]);

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
  }, [_id,authorize]);

  const sendSubmit = async () => {
    if(newMessage!==""){
    const message = {
      sender: _id,
      text: newMessage,
      conversationId: currentChat._id,
      reCall: false,
      delUser:""
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
      conversationId: currentChat._id,
      delUser:""
    });


    try {
      const res = await axios.post("http://localhost:8800/api/messages", message);
      setMessages([...messages, res.data]);
      setNewMessages("");
    } catch (err) {
      console.log(err);
    }
  }
  };

  
  const onClickDeleteMgs = (id) => {
    setRecallMessages(id);
    // const mgsdelete = messages.filter(
    //   (message) => message._id !== id
    // );
    // messages.find((message) => message._id !== id).text = "tin nhắn đã được bạn xóa";
    // setMessages(messages);
   
    const receiverIds = [];
    
    for (let index = 0; index < currentChat.members.length; index++) {
      if (currentChat.members[index] !== _id) {
        receiverIds.push(currentChat.members[index]);
      }
    }

    //gửi tin nhắn thu hồi
    socket.current.emit("deleteMessage", {
      messagesCurrent: messages,
      messageId: id,
      senderId: _id,
      receiverIds,
      text: "tin nhắn đã được thu hồi",
    });

  }

  //nhận tin nhắn thu hồi
  useEffect(() =>{
    
    socket.current.on("delMgs", (data) =>{
      console.log(data.messageId)
      
      setMessages(data.messagesCurrent)
      
      //nhận vào và đưa vào Mess
      // setArrivalMessages({
      //   sender: data.senderId,
      //   text: data.text,
      //   createdAt: Date.now(),
      // })
      
    });
  },[]);  
  

  //xóa tin nhắn phía tôi (tin nhắn của tôi)
  const onClickDeleteMgsMy = (id) => {
    
    const mgsdelete = messages.filter(
      (message) => message._id !== id
    );

    setMessages(mgsdelete);
  }


  
   //xóa tin nhắn phía tôi (tin nhắn của bạn)
   const onClickDeleteMgsOfFri =  async (id) => {
    const mgsList = messages.filter(
      (mes) => mes.delUser !== id
    )
    setMessages(mgsList)
    
  }

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

  async function handleTextSearch(e){
    if(e.keyCode == 13){
      return false;
    }
    let textSearch = document.querySelector('#search-group').value
    try { 
      const res = await axios.get("http://localhost:8800/api/users/userByMailOrName?email=" + textSearch);
      
      setUserSearch(res.data)
    } catch (err) {
      setUserSearch(null)
    }
  }
  function clickButtonAdd(e){
    e.preventDefault()
    setListUserGroupNew([...listUserGroupNew,userSearch])
    console.log(listUserGroupNew)
  }

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
                    <Avatar src={currentChat?.img}></Avatar>
                    <p className="user-name">{
                      currentChat?.name 
                        //myFriend.username 
                        
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
                     <Message message={m} own ={m.sender === _id} onClickDelete = {onClickDeleteMgs} 
                        userId={_id} onClickDeleteMgsUser={onClickDeleteMgsMy}
                          onClickDeleteMgsFri = {onClickDeleteMgsOfFri} avatar={avt}/>
                  ))} 
                </div>

            </div>
            <div className="sender-cont">
                <div className="send-message">
                  <InputEmoji  
                      onChange ={(e) => setNewMessages(e)} 
                      value={newMessage}
                      placeholder="Nhập tin nhắn"
                      onEnter={()=>sendSubmit()}/>
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
                      onClick={()=>sendSubmit()}
                      >
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
              
              <Avatar src={currentChat?.img}
                sx={{width:70,height:70}}>
                </Avatar>
              <div className="name_con">
                <p className="text_name">{currentChat?.name}</p>
                <Tooltip 
                  title="Chỉnh sửa"
                  placement="bottom-end">
                  <IconButton onClick={() => { setOpenPopupAvarta(true);  setData(currentChat)}}>
                    <Edit />
                  </IconButton>
                </Tooltip>
              </div>
              {/* <div className="edit_button">
                <IconButton>
                  <GroupAddIcon />
                </IconButton>
                <p className="title_edit_button">Tạo nhóm trò chuyện</p>
              </div> */}
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
    <input type="text" className="form-control ip-addGr" placeholder="Nhập tên nhóm"></input><br></br>
  </div>
  
<div className="input-group">
  <input className="form-control rounded ip-addGr" type="text" onKeyUp={handleTextSearch} id="search-group" placeholder="Tìm kiếm bằng email" />
  <div className="model-search">
    {userSearch ? 
    <div className="item">
      <Avatar src={userSearch.avt}></Avatar>
      <p>{userSearch.username}</p>
      {userSearch._id === _id ? <div className="add">bạn</div> :<button onClick={clickButtonAdd} className="add">Thêm</button>}
    </div> : <div className="nullUser">Không thấy user</div>}
    
  </div>
</div>

<div className="mt-10"><p>____________________________________________________________________________</p></div>
<p className="title-Add">Đã thêm</p>
<ul className="listAdd">
{listUserGroupNew.map( (user_gr)=>( 
      <li className="itemAdd">
          <Avatar src={user_gr.avt}></Avatar>
          <p>{user_gr.username}</p>
          <button onClick={(e)=>{
            e.preventDefault()
            const members = listUserGroupNew.filter(
              (u) => u._id !== user_gr._id
            )
            setListUserGroupNew(members)
          }} className="remove">xóa</button>
      </li>                                           
  ))}

                        
     
</ul>


<br></br>
<div className="GroupAddButton">
  <button type="button" className="btn-addGr btn-primary">Tạo nhóm</button>
  <button type="button" className="btn-addGr btn-secondary">Huỷ</button>
</div>
  
</form>
        </Popup>



        <PopupAvartar
                title="Thông tin nhóm"
                openPopup={openPopupAvarta}
                setOpenPopup={setOpenPopupAvarta}>

              <h1 >{currentChat?.name}</h1>
              
              <div className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit} >
				
				<input
					type="text"
					className={styles.input}
					placeholder="Ten nhom"
					name="name"
					onChange={handleChange}
					value={data.name}
				/>
				
				<FileInput
					name="img"
					label="Choose Image"
					handleInputState={handleInputState}
					type="image"
					value={data.img}
				/>
				
				<button type="submit" className={styles.submit_btn} onClick={() => { 
          setOpenPopupAvarta(false); 
          //window.location.reload(false)
           }}>
					Submit
				</button>
			</form>
		</div>
        </PopupAvartar>
    </div>
  );
}