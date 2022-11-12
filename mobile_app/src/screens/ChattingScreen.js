import { StyleSheet, Text, View,TouchableOpacity, TextInput, ScrollView, ActivityIndicator,} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Messager from '../components/Messager'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Url, UrlSK } from '../contexts/constants'
import { AuthContext } from '../contexts/AuthContext'
import {io} from 'socket.io-client';

import axios from 'axios'

export default function ChattingScreen({navigation}) {
    const [newMessage, setNewMessage] = useState("");
    const scrollView_ref = useRef();
    const [messages, setMessages] = useState([]);
    const [user, setUser] = useState([]);
    const {userInfo,currentChat,socket,setSenderMessage,setRecallStatus} = useContext(AuthContext);
    const [arrivalMessage, setArrivalMessages] = useState(null);
    const [Nmember,setNMember]= useState(0);
    const [recallMessage, setRecallMessages] = useState(null);
  
  useEffect(() => {
    const friendId = currentChat.members.find((m) => m !== userInfo._id);
    const getUser = async () => {
      try {
        const res = await axios(`${Url}/api/users?userId=${friendId}`);  
        setUser(res.data);
      } catch (err) {
            console.log(err); 
      }
    }
    getUser();
  },[userInfo._id,currentChat]);
  useEffect(() => {
    const getMessages = async () => {
      let messageList =[];
      try {
        const res = await axios.get(`${Url}/api/messages/${currentChat._id}`); 

        for(let i =0; i< res.data.length;i++) {
          if(res.data[i].delUser[0] !== userInfo._id) {
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
    setNMember(currentChat.members.length)
  }, [currentChat]);
  useEffect(() =>{
    socket.current = io(`${UrlSK}`);
    socket.current.on("getMessage",(data) =>{
      setArrivalMessages({
        _id:data._id,
        sender: data.senderId,
        text: data.text,
        type:0,
        delUser: data.delUser,
        conversationId: data.conversationId,
        createdAt: data.date,
        username: data.username,
        avt: data.avt,
      });
    });
    socket.current.on("getStatus",(data) =>{
      setSenderMessage({
        _id:Math.random(),
        sender: data.senderId,
        text: data.text,
        type:0,
        delUser: data.delUser,
        conversationId: data.conversationId,
        createdAt: data.date,
        username: data.username,
      });
      setRecallStatus(null)
    });

    socket.current.on("recallMgsStatus",(data) =>{
      setRecallStatus({
        _id:Math.random(),
        sender: data.senderId,
        text: data.text,
        type:0,
        delUser: data.delUser,
        conversationId: data.conversationId,
        createdAt: data.date,
        username: data.username,
      })
    });
   
  },[currentChat]);

  useEffect(() =>{
    arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
    currentChat?._id === arrivalMessage.conversationId 
    && messages[messages.length-1]._id != arrivalMessage._id &&
    setMessages((prev)=>[...prev, arrivalMessage])
    // console.log("arrivalMessage:",arrivalMessage)
  },[arrivalMessage, currentChat])

  useEffect(() => {
    socket.current.emit("addUser", userInfo._id);
    socket.current.on("getUsers", (users) => {
      console.log(users)
    })},[userInfo._id]);
  const onClickDeleteMgs = (id) => {
    setRecallMessages(id);
    // const mgsdelete = messages.filter(
    //   (message) => message._id !== id
    // );
    // messages.find((message) => message._id !== id).text = "tin nhắn đã được bạn xóa";
    // setMessages(messages);
   
    const receiverIds = [];
    
    for (let index = 0; index < currentChat.members.length; index++) {
      if (currentChat.members[index] !== userInfo._id) {
        receiverIds.push(currentChat.members[index]);
      }
    }
    //gửi tin nhắn thu hồi
    socket.current.emit("deleteMessage", {
      _id:Math.random(),
      messagesCurrent: messages,
      messageId: id,
      senderId: userInfo._id,
      receiverIds,
      text: "tin nhắn đã được thu hồi",
    });

    socket.current.emit("recallMessageStatus", {
      senderId: userInfo._id,
      username: userInfo.username,
      receiverIds: currentChat.members,
      type:0,
      text: "tin nhắn đã được thu hồi",
      conversationId: currentChat._id,
      delUser:"",
      date: Date.now(),
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
  const sendSubmit = async () => {
    
    if(newMessage.trim()  !=="" ){
    const message = {
      sender: userInfo._id,
      text: newMessage,
      type:0,
      conversationId: currentChat._id,
      reCall: false,
      delUser:"",
      date: Date.now(),
      username: userInfo.username,
      avt: messages[messages.length-1].sender != userInfo._id? userInfo.avt:null,  
    };  

    
    
  
    // const receiverId = currentChat.members.find(
    //   (member) => member !== _id
    // );
    const receiverIds = [];
    
    for (let index = 0; index < currentChat.members.length; index++) {
      if (currentChat.members[index] !== userInfo._id) {
        receiverIds.push(currentChat.members[index]);
      }
    }


    try {
      const res = await axios.post(`${Url}/api/messages`,message);
      // setMessages([...messages, res.data]);  
      socket.current.emit("sendMessage", {
        _id:res.data._id,
        senderId: userInfo._id,
        receiverIds,
        type:0,
        text: newMessage,
        conversationId: currentChat._id,
        delUser:"",
        date: Date.now(),
        username: userInfo.username,
        avt:messages[messages.length-1].sender != userInfo._id? userInfo.avt:null,
      });
  
      socket.current.emit("sendStatus", {
        senderId: userInfo._id,
        username: userInfo.username,
        receiverIds: currentChat.members,
        type:0,
        text: newMessage,
        conversationId: currentChat._id,
        delUser:"",
        date: Date.now(),
        
      })    
      
    } catch (err) {
      console.log(err);
    }
    
  }
  };
  
  return (
    <SafeAreaView style={{height:'100%'}}>
        <View style={styles.Header}>
            <TouchableOpacity 
                onPress={()=> navigation.goBack()}>
                <Ionicons 
                    name='arrow-back'
                    size={25}
                    color='#fff'
                    />
            </TouchableOpacity>
            <View style={styles.Name}>
                <Text style={styles.text_Name}>{currentChat.name? currentChat.name : user.username}</Text>
                <Text style={styles.active}>{currentChat.name? Nmember+' thành viên' : 'Đang hoạt động'}</Text>
            </View>
            <TouchableOpacity>
                <Ionicons
                    name='call-outline'
                    size={25}
                    color='#fff'/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons
                    name='videocam-outline'
                    size={25}
                    color='#fff'/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('MoreInfo')}>
                <Ionicons
                    name='list-outline'
                    size={25}
                    color='#fff'/>
            </TouchableOpacity>
        </View>
        <View style={styles.MessageList}>
        <ScrollView
            ref={scrollView_ref}
            onContentSizeChange={() => scrollView_ref.current.scrollToEnd({animated: false})}> 
            <KeyboardAwareScrollView  onKeyboardDidShow={()=>scrollView_ref.current.scrollToEnd({animated: false})}>
                {messages.map((m) => (
                     <Messager 
                        key={m._id} 
                        message={m} 
                        own={m.sender === userInfo._id} 
                        userId={userInfo._id}
                        onClickDelete = {onClickDeleteMgs} 
                        onClickDeleteMgsUser={onClickDeleteMgsMy}
                        onClickDeleteMgsFri = {onClickDeleteMgsOfFri}
                        />))}          
            </KeyboardAwareScrollView>
        </ScrollView>
        </View>
        <View style={styles.input}>
            <View style={{width:'10%',justifyContent:'center',alignItems:'center'}}>
            <TouchableOpacity >
                <Ionicons
                    name='happy-outline'
                    size={25}/>
            </TouchableOpacity>
            </View>
            <TextInput style={styles.input_text}
                placeholder='Nhập tin nhắn'
                value={newMessage}
                onChangeText={(value)=>setNewMessage(value)}/>
            {newMessage? 
                <View style={{width:'18%',alignItems:'center',}}>
                    <TouchableOpacity
                        onPress={()=>{
                          sendSubmit();
                          setNewMessage("");
                          }}>
                        <Ionicons
                                name='send'
                                size={25}
                                color={'#056282'}/>
                    </TouchableOpacity>
                </View>:
                <View style={{flexDirection:'row',width:'18%', alignItems:'center',justifyContent:'space-around',paddingHorizontal:5}}>
                    <TouchableOpacity>
                        <Ionicons
                            name='attach'
                            size={25}/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                    <Ionicons
                        name='images-outline'
                        size={25}/>
                    </TouchableOpacity>
                </View>
                }   
        </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    Header:{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems:'center',
        backgroundColor:'#056282',
        padding:10,
    },
    text_Name:{
        color:'#fff',
        fontSize:16,
        fontWeight:'500',
    },
    active:{
        color:"#fff",
        fontSize:12,
        fontWeight:'300'
    },
    Name:{
        width:200,
    },
    MessageList:{
        flex:1,
    },
    input:{
        display:'flex',
        flexDirection:'row',
        backgroundColor:"#fff",
        paddingVertical:10,
        justifyContent:'center',
        alignItems:'center',
        height:60,
    },
    input_text:{
        width:'72%',
        height:50,
        maxHeight:100,
        fontSize:16,
    }
})