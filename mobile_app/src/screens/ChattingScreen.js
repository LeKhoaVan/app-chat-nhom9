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
    const {userInfo,currentChat,socket} = useContext(AuthContext);
    const [arrivalMessage, setArrivalMessages] = useState(null);
    const [Nmember,setNMember]= useState(0);
    useEffect(() => {
        const friendId = currentChat.members.find((m) => m !== userInfo._id);
        const getUser = async () => {
            try {
                const res = await axios(`${Url}/api/users?userId=${friendId}`);  
                setUser(res.data);
            } catch (err) {
                console.log(err); 
            }
        };
        getUser();
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
            setMessages(messageList);
          } catch (err) {
            console.log(err);
          }
        };
        getMessages();
        
      }, [currentChat]);
      useEffect(() =>{
        socket.current = io(`${UrlSK}`,{
          transports:['websocket'],
        }); 
        socket.current.on("getMessage",(data) =>{
          setArrivalMessages({
            _id:Math.random(),
            sender: data.senderId,
            text: data.text,
            type: data.type,
            delUser: data.delUser,
            conversationId: data.conversationId,
            createdAt: Date.now(),
          })
          console.log("text:",data.text);
        });  
        setNMember(currentChat.members.length)
      },[currentChat]);
      useEffect(() => {
        socket.current.emit("addUser",userInfo._id);
        socket.current.on("getUsers", (users) => {
          console.log(users)
        })
      },[userInfo]);
      useEffect(() =>{
        arrivalMessage && currentChat?.members.includes(arrivalMessage.sender) &&
        currentChat?._id === arrivalMessage.conversationId && 
        setMessages((prev)=>[...prev, arrivalMessage])
        console.log("arrivalMessage:",arrivalMessage)
      },[arrivalMessage])
      
      const sendSubmit = async () => {
        if(newMessage!==""){
        const message = {
          sender: userInfo._id,
          text: newMessage,
          type:0,
          conversationId: currentChat._id,
          reCall: false,
          delUser:""
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
        socket.current.emit("sendMessage", {
          senderId: userInfo._id,
          receiverIds,
          text: newMessage,
          type:0,
          conversationId: currentChat._id,
          delUser:""
        });
        try {
          const res = await axios.post(`${Url}/api/messages`,message);
          setMessages([...messages, res.data]);
          setNewMessage("");
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
                     <Messager key={m._id} message={m} own={m.sender === userInfo._id} 
                        userId={userInfo._id}/>))}          
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
                        onPress={()=>sendSubmit()}>
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