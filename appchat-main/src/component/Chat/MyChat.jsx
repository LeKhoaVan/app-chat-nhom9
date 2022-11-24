import { Component, useEffect, useState, useRef, useContext } from "react";
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
import LogoutIcon from '@mui/icons-material/Logout';
import PopupQuestion from "../PopupQuestion/PopupQuestion";
import PopupQuestionOutGroup from "../PopupQuestion/PopupQuestionOutGroup";
import PopupNotify from "../PopupQuestion/PopupNotify";
import avatar from '../../assets/avatar.jpg';
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import { io } from "socket.io-client";
import { AuthContext } from "../../contexts/AuthContext";
//import 'bootstrap/dist/css/bootstrap.css';
import isEmail from "validator/lib/isEmail"
import Popup from "./Popup";


//Avarta
import PopupAvartar from "./Avarta/Popup";
import FileInput from "./Avarta/FileInput";
import styles from "./Avarta/styles.module.css";


// send image
import storage from "./Avarta/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import { async } from "@firebase/util";

export default function MyChat() {
  const { authState: { user: { avt, _id, username } } ,socket} = useContext(AuthContext)

  const [conversations, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [myFriend, setMyFriend] = useState([]);
  const [userCons, setUserCons] = useState([]);
  const [authorize, setAuthorize] = useState([]);
  const [userAuth, setUserAuth] = useState("");
  const [newMessage, setNewMessages] = useState("");
  const [arrivalMessage, setArrivalMessages] = useState(null);
  const [senderMessage, setSenderMessage] = useState(null);
  const [recallMessage, setRecallMessages] = useState(null);
  const [deleteMessage, setDeleteMessages] = useState([]);
  const [listUserGroupNew, setListUserGroupNew] = useState([]);
  const [listUserGroupAdd, setlistUserGroupAdd] = useState([]);
  const [userSearch, setUserSearch] = useState(null);
  const [userSearchAddNew, setUserSearchAddNew] = useState(null);
  const [userSearchAddCheckExist, setUserSearchAddCheckExist] = useState(null);
  const [userSearchCon, setUserSearchCon] = useState(null);
  const [convGroupForm, setConvGroupForm] = useState({})
  const [conActive, setConActive] = useState(null)
  const [popupQuestion, setPopupQuestion] = useState({
    title: '',
    mes: '',
    isLoading: false
  })
  const [popupQuestionOutGroup, setPopupQuestionOutGroup] = useState({
    title: '',
    mes: '',
    isLoading: false
  })
  const [popupNotify, setPopupNotify] = useState({
    title: '',
    mes: '',
    isLoading: false
  })


  const [recallStatus, setRecallStatus] = useState(null)
  

  const [openPopup, setOpenPopup] = useState(false);
  const [openPopup2, setOpenPopup2] = useState(false);



  // poppu onpen form Avarta
  const [openPopupAvarta, setOpenPopupAvarta] = useState(false);



  const [data, setData] = useState({
    name: "",
    img: ""
  });

  const [emailCheck, setEmailCheck] = useState('')

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const handleInputState = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const url = "http://localhost:8800/api/conversations/updateImg/" + currentChat?._id;
      const { data: res } = await axios.put(url, data);
      console.log(res)

    } catch (error) {
      console.log(error)
    }

  };

  const [stateDis, setStateDis] = useState({
    disabled: true
  });




  //send image
  const handleImageChange = (e) => {
    const messageimage = {
      sender: _id,
      text: '',
      type: 1,
      conversationId: currentChat._id,
      reCall: false,
      delUser: "",
      date: Date.now(),
      username: username,
      avt: avt,
    };



    const imageRef = ref(storage, `/image/${e.target.files[0].name + v4()}`);
    uploadBytes(imageRef, e.target.files[0])
      .then(() => {
        getDownloadURL(imageRef)
          .then(async (url) => {

            messageimage.text = url


            console.log(messageimage)


            const receiverIds = [];

            for (let index = 0; index < currentChat.members.length; index++) {
              if (currentChat.members[index] !== _id) {
                receiverIds.push(currentChat.members[index]);
              }
            }
            try {
              const res = await axios.post("http://localhost:8800/api/messages", messageimage);
              //setMessages([...messages, res.data]);
              socket.current.emit("sendMessage", {
                _id:res.data._id,
                senderId:_id,
                receiverIds,
                type: 1,
                text: messageimage.text,
                conversationId: currentChat._id,
                reCall: false,
                delUser: "",
                date: Date.now(),
                username: username,
                avt: avt,
              });
  
              socket.current.emit("sendStatus", {
                senderId: _id,
                username: username,
                receiverIds: currentChat.members,
                type: 1,
                text: messageimage.text,
                conversationId: currentChat._id,
                delUser: "",
                date: Date.now(),
    
              });

            } catch (err) {
              console.log(err);
            }


          })
          .catch((error) => {
            console.log(error.message, "error getting the image url");
          });

      })
      .catch((error) => {
        console.log(error.message);
      });

  };


   // send all file
   const handleFileChange = async (e) => {
    const messageFile = {
      sender: _id,
      text: '',
      type: e.target.files[0].type.match('video.*')? 2:3,
      conversationId: currentChat._id,
      reCall: false,
      delUser: "",
      date: Date.now(),
      username: username,
      avt: avt,
    };

     // Max= 1 GB
    const maxAllowedSize = 1 * 1024 * 1024 *1024;
    if (e.target.files[0].size > maxAllowedSize) {
      
      alert("Kích thước file vượt quá 1 GB");
       return false;
    }
    
    console.log(e.target.files[0].type)
    
     const upload = ref(storage, e.target.files[0].type.match('video.*') ? `/video/${e.target.files[0].name + v4()}`:`/file/${e.target.files[0].name + v4()}`);
   
    uploadBytes(upload, e.target.files[0])
      .then(() => {
        getDownloadURL(upload)
          .then(async (url) => {

            messageFile.text = url

            console.log(messageFile)

            const receiverIds = [];

            for (let index = 0; index < currentChat.members.length; index++) {
              if (currentChat.members[index] !== _id) {
                receiverIds.push(currentChat.members[index]);
              }
            }

            try {
              const res = await axios.post("http://localhost:8800/api/messages", messageFile);
              // setMessages([...messages, res.data]);
              socket.current.emit("sendMessage", {
                _id:res.data._id,
                senderId: _id,
                receiverIds,
                type: e.target.files[0].type.match('video.*')? 2:3,
                text: messageFile.text,
                conversationId: currentChat._id,
                reCall: false,
                delUser: "",
                date: Date.now(),
                username: username,
                avt: avt,
              });
  
              socket.current.emit("sendStatus", {
                senderId: _id,
                username: username,
                receiverIds: currentChat.members,
                type: e.target.files[0].type.match('video.*')? 2:3,
                text: messageFile.text,
                conversationId: currentChat._id,
                delUser: "",
                date: Date.now(),
  
              })

            } catch (err) {
              console.log(err);
            }


          })
          .catch((error) => {
            console.log(error.message, "error getting the file url");
          });

      })
      .catch((error) => {
        console.log(error.message);
      });
  };





  function Demo() {
    const morInfo = document.querySelector(".morInfo_con");
    const cssObj = window.getComputedStyle(morInfo, null);
    const width_morInfo = cssObj.getPropertyValue("display");
    if (width_morInfo === "none") {
      document.querySelector(".chattingpage").style.width = '50%';
      document.querySelector(".morInfo_con").style.display = 'flex';
    }
    else {
      document.querySelector(".chattingpage").style.width = '73%';
      document.querySelector(".morInfo_con").style.display = 'none';
    }
  }

  function SetAuth(conId, userId) {

    const article = { conId, userId };
    const con = axios.put('http://localhost:8800/api/conversations/setAuthorize', article)
    con.then(value => {
      setAuthorize(value.data)
    })

  }

  function RemoveAuth(conId, userId) {
    const article = { conId, userId };
    const con = axios.put('http://localhost:8800/api/conversations/removeAuthorize', article)
    con.then(value => {
      setAuthorize(value.data)
    })

  }


  function RemoveUserCon(conId, userId) {

    const article = { conId, userId };
    const con = axios.put('http://localhost:8800/api/conversations/removeMember', article)

    con.then(async value => {
      let list = [];
      for (let index = 0; index < value.data.length; index++) {
        const res = await axios.get("http://localhost:8800/api/users?userId=" + value.data[index]);
        list.push(res.data)
      }
      setUserCons(list);
    })



  }

  function AddUserCon(conId) {
    let userId =
    listUserGroupAdd.map((userGr) => {
        return userGr._id
      })

    const article = { conId, userId };

    const con = axios.put('http://localhost:8800/api/conversations/addMember', article)

    con.then(async value => {
      let list = [];
      for (let index = 0; index < value.data.length; index++) {
        const res = await axios.get("http://localhost:8800/api/users?userId=" + value.data[index]);
        list.push(res.data)
      }
      setUserCons(list);
    })
  }


  function DisbandGroup() {
    setPopupQuestion({
      title: 'Giải tán nhóm',
      mes: 'Bạn có chắc chắn muốn giải tán nhóm?',
      isLoading: true
    });
  }
  async function disbandGroupSure(choose) {
    if (choose) {
      try {
        const con = await axios.delete('http://localhost:8800/api/conversations/deleteCon', {
          data: { convId: currentChat._id }
        })
        // const res = await axios.get("http://localhost:8800/api/conversations/" + _id);
        // setConversation(res.data);
        Demo()
        setCurrentChat(null)
        setAuthorize([])

        setPopupQuestion({
          title: '',
          mes: '',
          isLoading: false
        });
      }
      catch (err) {
        console.log(err);
      }
    } else {
      setPopupQuestion({
        title: '',
        mes: '',
        isLoading: false
      });
    }
  }

  async function HandleOutGroup() {
    setPopupQuestionOutGroup({
      title: 'Rời nhóm',
      mes: 'Bạn có chắc chắn muốn rời nhóm?',
      isLoading: true
    })
  }

  function outGroupSure(choose) {
    if (choose) {
      try {

        if (authorize.length == 1 && authorize[0] === _id) {
          setPopupQuestionOutGroup({
            title: '',
            mes: '',
            isLoading: false
          });
          setPopupNotify({
            title: 'Thông báo',
            mes: 'Cần chỉ định thêm quản trị viên trước khi rời nhóm',
            isLoading: true
          });

        }
        else {
          const article = {
            conId: currentChat._id,
            userId: _id
          };
          const con = axios.put('http://localhost:8800/api/conversations/removeMember', article)
          // const res = await axios.get("http://localhost:8800/api/conversations/" + _id);
          // setConversation(res.data);
          Demo()
          setCurrentChat(null)
          setAuthorize([])
          setPopupQuestionOutGroup({
            title: '',
            mes: '',
            isLoading: false
          });
        }


      }
      catch (err) {
        console.log(err);
      }
    } else {
      setPopupQuestionOutGroup({
        title: '',
        mes: '',
        isLoading: false
      });
    }

  }
  function handleNotify(choose) {
    if (choose) {
      setPopupNotify({
        title: '',
        mes: '',
        isLoading: false
      });
    }
  }

  async function handleChatOne(senderId, receiverId) {
    let conv
    let checkCon = false
    conversations.forEach((c) => {
      if (c.members.length == 2 && c.authorization.length == 0) {
        if (c.members.some((member) => (member == senderId))) {
          if (c.members.some((member) => (member == receiverId))) {
            checkCon = true
            conv = c
          }
        }

      }
    })
    if (checkCon) {
      setCurrentChat(conv);
      setAuthorize(conv.authorization)
      setConActive(conversations.indexOf(conv))
    }
    else {
      const args = { senderId, receiverId }
      try {
        const res = await axios.post("http://localhost:8800/api/conversations", args);

        //const con = await axios.get("http://localhost:8800/api/conversations/" + _id);
        //setConversation(con.data);
        setCurrentChat(res.data);
        setAuthorize(res.data.authorization)
        setConActive(0)
      } catch (err) {
        console.log(err)
      }

    }

    setUserSearchCon(null)
    document.querySelector('#search-user').value = ""



  }



  // const receiverId = currentChat.members.find(
  //   (member) => member !== user._id
  // );
  // console.log(receiverId);
  useEffect(() => {
    socket.current = io("ws://localhost:8800");
    socket.current.on("getMessage", (data) => {
      setArrivalMessages({
        _id:data._id,
        sender: data.senderId,
        text: data.text,
        type: data.type,
        reCall: data.reCall,
        delUser: data.delUser,
        conversationId: data.conversationId,
        createdAt: data.date,
        username: data.username,
        avt: data.avt
      });

       //load conversation latest
       conversations.find((conv) => {

        if(conv._id === data.conversationId){
          conv.updatedAt = new Date(Date.now()).toISOString();
          for(let index=0; index<conv.members.length; index++){
            if(conv.members[index] === _id){
              const concsts = conversations.sort((a,b) => b.updatedAt.localeCompare(a.updatedAt))
                setConversation(concsts);
                concsts.forEach((con,index)=>{
                  if(con === currentChat)
                    setConActive(index)
                })
            }              
          }
        }
    })

    });
    socket.current.on("getStatus", (data) => {
      setSenderMessage({
        sender: data.senderId,
        text: data.text,
        type: data.type,
        delUser: data.delUser,
        conversationId: data.conversationId,
        createdAt: data.date,
        username: data.username,
      });
      setRecallStatus(null)
    });

    socket.current.on("recallMgsStatus", (data) => {
      setRecallStatus({
        sender: data.senderId,
        text: data.text,
        type: data.type,
        delUser: data.delUser,
        conversationId: data.conversationId,
        createdAt: data.date,
        username: data.username,
      })
    });

  }, [currentChat]);


  const ktt=(messages)=>{
    if(messages.length==0) 
      return true;
    else
      if(messages[messages.length-1]._id != arrivalMessage._id)
        return true;
      else return false;
  }

  useEffect(() => {
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
      currentChat?._id === arrivalMessage.conversationId && ktt(messages) &&
      setMessages((prev) => [...prev, arrivalMessage])
    console.log(arrivalMessage)
  }, [arrivalMessage, currentChat])

  useEffect(() => {
    socket.current.emit("addUser", _id);
    socket.current.on("getUsers", (users) => {
      // console.log(users)
    })
    let data={
      usersId:_id,
      isActive:true,
    }
    const activeOn = async () => {
      try {
        const res = await axios.put('http://localhost:8800/api/users/'+_id, data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    activeOn();
  }, [_id]);

  useEffect(() => {
    const getMyFriend = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/conversations/findById/" + currentChat?._id);
        const friendId = res.data.find((m) => m !== _id);
        //console.log(friendId)
        const friend = await axios.get("http://localhost:8800/api/users?userId=" + friendId);
        //console.log(friend);
        setMyFriend(friend.data);
        // const friendId = res.data.find((m) => m !== _id);
        // console.log(friendId)
        // const friend = await axios.get("http://localhost:8800/api/users?userId="+friendId);  
        // console.log(friend);
        // setMyFriend(friend.data);
      } catch (err) {
        console.log(err);
      }
    };
    getMyFriend();
  }, [_id, currentChat]);

  useEffect(() => {
    const getMessages = async () => {
      let messageList = [];
      try {
        const res = await axios.get("http://localhost:8800/api/messages/" + currentChat?._id);

        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].delUser[0] !== _id) {
            if (res.data[i].reCall === true) {
              res.data[i].text = "tin nhắn đã được thu hồi"
              messageList.push(res.data[i]);
            }
            else {
              messageList.push(res.data[i]);
            }
          }
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
  }, [_id, authorize, listUserGroupNew]);


  const sendSubmit = async () => {

    if (newMessage.trim() !== "") {
      const message = {
        sender: _id,
        text: newMessage,
        type: 0,
        conversationId: currentChat._id,
        reCall: false,
        delUser: "",
        date: Date.now(),
        username: username,
        avt: avt,
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


      


      const timeUpdate= {
        "convId" : currentChat._id,
      }

      try {
        const res = await axios.post("http://localhost:8800/api/messages", message);
        const updateTime = await axios.put("http://localhost:8800/api/conversations/updateAt", timeUpdate);
        // setMessages([...messages, res.data]);
        setNewMessages("");
        socket.current.emit("sendMessage", {
          _id:res.data._id,
          senderId: _id,
          receiverIds,
          type: 0,
          text: newMessage,
          conversationId: currentChat._id,
          reCall: false,
          delUser: "",
          date: Date.now(),
          username: username,
          avt: avt,
        });
  
        socket.current.emit("sendStatus", {
          senderId: _id,
          username: username,
          receiverIds: currentChat.members,
          type: 0,
          text: newMessage,
          conversationId: currentChat._id,
          delUser: "",
          date: Date.now(),
  
        })

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
      id:Math.random(),
      messagesCurrent: messages,
      messageId: id,
      senderId: _id,
      receiverIds,
      text: "tin nhắn đã được thu hồi",
      username: username,
      avt: avt,
    });

    socket.current.emit("recallMessageStatus", {
      senderId: _id,
      username: username,
      receiverIds: currentChat.members,
      type: 0,
      text: "tin nhắn đã được thu hồi",
      conversationId: currentChat._id,
      delUser: "",
      date: Date.now(),
    });






  }

  //nhận tin nhắn thu hồi
  useEffect(() => {

    socket.current.on("delMgs", (data) => {
      console.log(data.messageId)

      setMessages(data.messagesCurrent)


      //nhận vào và đưa vào Mess
      // setArrivalMessages({
      //   sender: data.senderId,
      //   text: data.text,
      //   createdAt: Date.now(),
      // })

    });


  }, []);


  //xóa tin nhắn phía tôi (tin nhắn của tôi)
  const onClickDeleteMgsMy = (id) => {

    const mgsdelete = messages.filter(
      (message) => message._id !== id
    );

    setMessages(mgsdelete);
  }



  //xóa tin nhắn phía tôi (tin nhắn của bạn)
  const onClickDeleteMgsOfFri = async (id) => {
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
          const res = await axios.get("http://localhost:8800/api/users?userId=" + currentChat?.members[index]);
          list.push(res.data)
        } catch (err) {
          console.log(err);
        }

      }
      setUserCons(list);
    };
    getUserCon();
  }, [currentChat]);

  async function handleTextSearchUser(e) {
    if (e.keyCode == 13) {
      return false;
    }    
    let textSearch = document.querySelector('#search-user').value
    setEmailCheck(textSearch)
    setUserSearchCon(null)
    try {
      var url = "";
      if (!isEmail(emailCheck)){
        //alert('?')
        url = "http://localhost:8800/api/users/userByMailOrName?username="+ textSearch;
      }
      else{
        url = "http://localhost:8800/api/users/userByMailOrName?email="+ textSearch;
      }
      const res = await axios.get(url);
      

      setUserSearchCon(res.data)
    } catch (err) {
      setUserSearchCon(null)
    }
  }

  async function handleTextSearch(e) {
    if (e.keyCode == 13) {
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
  function checkAddUserNewGroup(){
    return listUserGroupNew.some((userN)=>
      userN._id == userSearch._id
    )
  }


 function checkIfUserExistInConv() {
    try {
      const res =  axios.get("http://localhost:8800/api/conversations/findConvByUserID/"+ currentChat?._id+"/"+userSearchAddNew?._id);
      
      console.log(res.data)
     
      //setUserSearchAddCheckExist(res.data)
      //return res.data;
      res.then(value => {
        setUserSearchAddCheckExist(value.data)
      })
    } catch (error) {
      console.log(error.message)
    }
  }

  async function handleTextSearch2(e) {
    e.preventDefault()
    if (e.keyCode == 13) {
      return false;
    }
    let textSearch = document.querySelector('#search-group2').value
    try {
      const res = await axios.get("http://localhost:8800/api/users/userByMailOrName?email=" + textSearch);     
      setUserSearchAddNew(res.data)
    } catch (err) {
      setUserSearchAddNew(null)
    }
    checkIfUserExistInConv()
  }

  function clickButtonAdd2(e) {
    // e.preventDefault()
    // //checkIfUserExistInConv()
    // let check = checkAddUserNewGroup2()
    // if(check){
    //   setUserSearchAddNew(null)
    //   document.querySelector('#search-group2').value = ""
    // }
    // else if(userSearchAddCheckExist === "false"){
    //   setlistUserGroupAdd([...listUserGroupAdd,userSearchAddNew])
    //   setUserSearchAddNew(null)
    //   document.querySelector('#search-group2').value = ""
    //   setUserSearchAddCheckExist(null)
    // }else{
    //   alert('Thành viên hiện đang trong nhóm')
    // }
    e.preventDefault()
    //checkIfUserExistInConv()
    let check = checkAddUserNewGroup2()
    if(check){
      setUserSearchAddNew(null)
      document.querySelector('#search-group2').value = ""
    }
    else{
      setlistUserGroupAdd([...listUserGroupAdd,userSearchAddNew])
      setUserSearchAddNew(null)
      document.querySelector('#search-group2').value = ""
      setUserSearchAddCheckExist(null)
    }
  }

  function checkAddUserNewGroup2(){
    return listUserGroupAdd.some((userN)=>
      userN._id == userSearchAddNew._id
    )
  }

  function clickButtonAdd(e) {
    e.preventDefault()
    let check = checkAddUserNewGroup()
    if(check){
      setUserSearch(null)
      document.querySelector('#search-group').value = ""
    }
    else{
      setListUserGroupNew([...listUserGroupNew, userSearch])
      setUserSearch(null)
      document.querySelector('#search-group').value = ""
      let countMem = 0;
      listUserGroupNew.map((userGr) => {
        countMem++;
        return countMem;
      })
      if (countMem > 0) {
        setStateDis({
          disabled: false
        })
      } else {
        setStateDis({
          disabled: true
        })
      }
    }
  }




  function AutoScroll() {
    var element = document.querySelector(".live-chat");
    element.scrollTop = element.scrollHeight;
  }





  const createNewConvGroup = async () => {

    let listMemberId =
      listUserGroupNew.map((userGr) => {
        return userGr._id
      })
    let nameGroup = document.querySelector('#groupName').value
    const conv = ({
      members: [
        _id, ...listMemberId
      ],
      name: nameGroup,
      authorization: _id,
      img: 'https://cdn-icons-png.flaticon.com/512/1057/1057089.png?w=360'
    })
    try {
      const res = await axios.post("http://localhost:8800/api/conversations/newConvGroup", conv);
      setCurrentChat(res.data);
      setAuthorize(res.data.authorization)
      setConActive(0)
    } catch (err) {
      console.log(err.message);
    }
    setStateDis({
      disabled: true
    })

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
            <input type="text" placeholder="Tìm kiếm" id="search-user" onKeyUp={handleTextSearchUser} />
            <div className="model-usersearch">
              {userSearchCon ? (userSearchCon._id == _id ?
                <div className="nullUser">Đây là bạn</div> :
                <div className="item" onClick={() => {
                  handleChatOne(_id, userSearchCon._id)
                }}>
                  <Avatar src={userSearchCon.avt}></Avatar>
                  <p>{userSearchCon.username}</p>
                </div>) : <div className="nullUser">Không tìm thấy người dùng này</div>}

            </div>
          </div>
          {/* <Tooltip placement="bottom-end"  title="Thêm bạn"> 
          <PersonAddAlt1Icon />
          </Tooltip> */}
          <Tooltip placement="bottom-end" title="Tạo nhóm chat">
            <IconButton onClick={() => { setOpenPopup(true); }}><GroupAddIcon /></IconButton>

          </Tooltip>
        </div>
        <div className="recent-chat">
          <p className="Recent"></p>
          <div className="recent-user">

            {conversations.map((c, index) => (
              <div onClick={() => {
                setCurrentChat(c)
                setAuthorize(c.authorization)
                setConActive(index)
              }}>

                <Conversation conversation={c} currentUser={_id} timeM={arrivalMessage} myMes={senderMessage}
                  recall={recallStatus} active={conActive == index ? true : false} />


              </div>
            ))}

          </div>
        </div>

      </div>
      <div className="chattingpage" id="chattingpage">
        {
          currentChat ?
            <>
              <div className="top-header">
                <div className="user-header">
                  <Avatar src={currentChat ? (currentChat.img ? currentChat.img : myFriend.avt) : ""}></Avatar>
                  <p className="user-name">{
                    currentChat ? (currentChat.name ? currentChat.name : myFriend.username) : <span></span>


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
                        <MoreHorizIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </div>
              </div>
              <div onLoad={AutoScroll} className="live-chat">

                <div>
                  {messages.map((m) => (
                    <Message message={m} own={m.sender === _id} onClickDelete={onClickDeleteMgs}
                      userId={_id} onClickDeleteMgsUser={onClickDeleteMgsMy}
                      onClickDeleteMgsFri={onClickDeleteMgsOfFri} avatar={avt} />
                  ))}
                </div>

              </div>
              <div className="sender-cont">
                <div className="send-message">
                  <InputEmoji
                    onChange={(e) => setNewMessages(e)}
                    value={newMessage}
                    placeholder="Nhập tin nhắn"
                    onEnter={() => sendSubmit()}
                    cleanOnEnter
                  />

                  {/* <Tooltip
                  title="Gửi hình ảnh"
                  placement="bottom-end">
                  <ImageIcon />
                  </Tooltip> */}

                  <label for="myfile"><ImageIcon /></label>
                  <input type="file" accept="image/png, image/jpeg" id="myfile" name="myfile" style={{ display: 'none' }} onChange={handleImageChange} />


                  {/* <Tooltip
                    title="Đính kèm file"
                    placement="bottom-end">
                    <AttachFileIcon />
                  </Tooltip> */}

                  <label for="myfile1"><AttachFileIcon /></label>
                  <input type="file" id="myfile1" name="myfile1" style={{ display: 'none' }} onChange={handleFileChange} />


                </div>
                <Tooltip
                  title="Gửi tin nhắn"
                  placement="bottom-end">
                  <span
                    className="sendbutton"
                    onClick={() => sendSubmit()
                    }>
                    <SendIcon />
                  </span>
                </Tooltip>
              </div>
            </> : <div className="noChat">
            <div className="header-name">Chào mừng bạn đến với CynoChat</div>
            </div>
        }
      </div>
      <div className="morInfo_con">
        <div className="namechat">
          <p className="text_namechat">Thông tin hội thoại</p>
        </div>
        <div className="mainInfo">
          <div className="infomation_con">

            <Avatar src={currentChat ? (currentChat.img ? currentChat.img : myFriend.avt) : ""}
              sx={{ width: 70, height: 70 }}>
            </Avatar>
            <div className="name_con">
              <p className="text_name">{currentChat ? (currentChat.name ? currentChat.name : myFriend.username) : <span></span>}</p>

              {currentChat?.authorization.length > 0 ?
                <Tooltip
                  title="Chỉnh sửa"
                  placement="bottom-end">
                  <IconButton onClick={() => { setOpenPopupAvarta(true); setData(currentChat) }}>
                    <Edit />
                  </IconButton>
                </Tooltip> : <div></div>}

            </div>
            <div>
            {currentChat?.authorization.length > 0 ?
            <div className="edit_button">
              <IconButton onClick={() => { setOpenPopup2(true); }}><GroupAddIcon /></IconButton>
              <p className="title_edit_button">Thêm thành viên</p>
            </div>      
                  : <div></div>}
            </div>
            {/* <div className="edit_button">
                <IconButton>
                  <GroupAddIcon />
                </IconButton>
                <p className="title_edit_button">Tạo nhóm trò chuyện</p>
              </div> */}
          </div>
          {currentChat?.authorization.length > 0 ?
            <div className="user_con">
              <div className="iv_title">
                <p>Thành viên</p>
                <ArrowDropDownIcon />
              </div>
              <div className="iv_main">
                <ul className="list-user">
                  {userCons.map((user) => (
                    <li>
                      <div className="avt"><img src={user.avt ? user.avt : ""} /></div>


                      <div className="text">
                        <p className="text-name">{user.username}</p>
                        <p className="auth">
                          {authorize.map((auth) => (
                            auth === user._id ? "Quản trị viên" : ""
                          ))}

                        </p>
                      </div>

                      {authorize.map((auth) => (
                        auth != _id || user._id == _id ?
                          <div></div> :
                          <div className="more">
                            <MoreHorizIcon />
                            <div className="more-option">

                              {authorize.map((auth1) => (
                                auth1 === user._id ?
                                  <div className="item"
                                    onClick={() => RemoveAuth(currentChat._id, user._id)}>Gỡ quyền quản trị viên</div>
                                  :
                                  <div></div>
                              ))}

                              {


                                authorize.some((auth1) => (
                                  auth1 === user._id
                                )) ? <div></div> : <div className="item"
                                  onClick={() => {
                                    SetAuth(currentChat._id, user._id)
                                  }}>Chỉ định quản trị viên</div>

                              }
                              <div className="item" onClick={() => {
                                RemoveUserCon(currentChat._id, user._id)

                              }}
                              >Xóa khỏi nhóm</div>

                            </div>
                          </div>

                      ))}





                    </li>

                  ))}


                </ul>
              </div>
            </div> : <div></div>}
          <div className="image_video_con">
            <div className="iv_title">
              <p>Ảnh/Video</p>
              <ArrowDropDownIcon />
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
              <ArrowDropDownIcon />
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
              <ArrowDropDownIcon />
            </div>
            <div className="iv_main">
              <p className="not_value">Chưa có link được chia sẻ trong hội thoại này</p>
              <span className="button_iv">
                Xem tất cả
              </span>
            </div>
          </div>
          <div className="user_con">
            <div className="iv_title">
              <p>Thiết lập bảo mật</p>
              <ArrowDropDownIcon />
            </div>
            <div className="iv_main">
              <span className="option-security">
                <DeleteOutlineIcon />
                <p>Xóa lịch sử trò chuyện</p>
              </span>
            </div>
            {currentChat?.authorization.length > 0 ?
              <div className="iv_main">
                <span onClick={() =>
                  HandleOutGroup()
                } className="option-security">
                  <LogoutIcon />
                  <p>Rời nhóm</p>
                </span>
              </div> : <div></div>}

            {authorize.map((auth) => (
              auth != _id ?
                <div></div> :
                <div className="iv_main">
                  <span onClick={() => {
                    DisbandGroup()
                  }} className="option-security disband">
                    <p className="disband">Giải tán nhóm</p>
                  </span>
                </div>
            ))}
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
            <input type="text" className="form-control ip-addGr" id="groupName" placeholder="Nhập tên nhóm"></input><br></br>
          </div>

          <div className="input-group">
            <input className="form-control rounded ip-addGr search" type="text" onKeyUp={handleTextSearch} id="search-group" placeholder="Nhập email để tìm kiếm" />
            <div className="model-search">
              {userSearch ?
                <div className="item">
                  <Avatar src={userSearch.avt}></Avatar>
                  <p>{userSearch.username}</p>
                  {userSearch._id === _id ? <div className="add">bạn</div> : 
                  
                 
                  <button onClick={clickButtonAdd} className="add">Thêm</button>

                  }
                </div> : <div className="nullUser">Không thấy user</div>}

            </div>
          </div>

          <div className="line-form"></div>
          <p className="title-Add">Đã chọn</p>
          <ul className="listAdd">
            {listUserGroupNew.map((user_gr) => (
              <li className="itemAdd">
                <Avatar src={user_gr.avt}></Avatar>
                <p>{user_gr.username}</p>
                <button onClick={(e) => {
                  e.preventDefault()
                  const members = listUserGroupNew.filter(
                    (u) => u._id !== user_gr._id
                  )
                  setListUserGroupNew(members)
                  let countMem = listUserGroupNew.length - 1;

                  if (countMem < 2) {
                    setStateDis({
                      disabled: true
                    })
                  } else {
                    setStateDis({
                      disabled: false
                    })
                  }
                }} className="remove">xóa</button>
              </li>
            ))}



          </ul>


          <br></br>
          <div className="GroupAddButton">
            <button type="button" className="btn-addGr btn-primary" id="createGroup"
              disabled={stateDis.disabled}
              onClick={(e) => {
                e.preventDefault()
                createNewConvGroup()
                setListUserGroupNew([])
                setOpenPopup(false)
              }}>Tạo nhóm</button>
            <button type="button" className="btn-addGr btn-secondary" onClick={() => {
              setOpenPopup(false)
            }}>Huỷ</button>
          </div>

        </form>

      </Popup>
      <Popup
        title="Thêm thành viên"
        openPopup={openPopup2}
        setOpenPopup={setOpenPopup2}
      >
        <form>
          <div className="input-group">
            <input className="form-control rounded ip-addGr search" type="text" 
            onKeyUp={handleTextSearch2}
            id="search-group2" placeholder="Nhập email để tìm kiếm" /> 
                
            <div className="model-search">
              {userSearchAddNew?
                <div className="item">
                  <Avatar src={userSearchAddNew.avt}></Avatar>
                  <p>{userSearchAddNew.username}</p>
                  {/* {userSearchAddNew._id === _id ? <div className="add">Bạn</div> :
                    <button onClick={clickButtonAdd2}className="add">Thêm</button>    
                  //userSearchAddNew._id === userSearchAddCheckExist._id? <div className="add">Người này đã trong nhóm</div> :
                  } */}
                  {userSearchAddNew._id === _id ? <div className="add">bạn</div> :
                  
                  currentChat.members.some((auth1) => (
                    auth1 === userSearchAddNew._id
                  )) ?  
                  <div className="add">Đã là thành viên</div> : 
                  <button onClick={clickButtonAdd2} className="add">Thêm</button>

                  }
                </div> : <div className="nullUser">Không thấy user</div>}

            </div>
          </div>
          <div className="line-form"></div>
          <p className="title-Add">Đã chọn</p>
          <ul className="listAdd">
            {listUserGroupAdd.map((user_gr) => (
              <li className="itemAdd">
                <Avatar src={user_gr.avt}></Avatar>
                <p>{user_gr.username}</p>
                <button onClick={(e) => {
                  e.preventDefault()
                  const members = listUserGroupAdd.filter(
                    (u) => u._id !== user_gr._id
                  )
                  setlistUserGroupAdd(members)
                }} className="remove">xóa</button>
              </li>
            ))}



          </ul>


          <br></br>

          <div className="GroupAddButton">

            <button type="button" className="btn-addGr btn-primary" onClick={(e) => {
              e.preventDefault()
              setlistUserGroupAdd([])
              setOpenPopup2(false)
              AddUserCon(currentChat._id)
            }}>Xác nhận</button>

            <button type="button" className="btn-addGr btn-secondary" onClick={() => {
              setOpenPopup2(false)
            }}>Huỷ</button>
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
      {popupQuestion.isLoading && <PopupQuestion onDialog={disbandGroupSure} title={popupQuestion.title} mes={popupQuestion.mes} />}
      {popupQuestionOutGroup.isLoading && <PopupQuestionOutGroup onDialog={outGroupSure} title={popupQuestionOutGroup.title} mes={popupQuestionOutGroup.mes} />}
      {popupNotify.isLoading && <PopupNotify onDialog={handleNotify} title={popupNotify.title} mes={popupNotify.mes} />}
    </div>
  );
}