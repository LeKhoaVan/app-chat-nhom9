import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView,Swipeable } from 'react-native-gesture-handler'
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Url } from '../contexts/constants'
import Ionicons from 'react-native-vector-icons/Ionicons' 

export default function Conversation({ conversation, currentUser,navigation,myMes,recall}) {
  const [user, setUser] = useState({});
  const [newMes, setNewMes] = useState([]);
  const [userName, setUserName] = useState([]);
  const {currentChat,setCurrentChat,userInfo} = useContext(AuthContext);
  const ref_sw = useRef();
  const CTime = (date) => {
    let tempDate = new Date(date);
    let minute = tempDate.getMinutes();
    {minute<10? minute='0'+minute:minute=minute}
    let fDate =tempDate.getHours()+":"+minute;
    return fDate;
  };
  const mess=(m)=>{
    if(m.length<=23)
      return m
    else 
      return m.slice(0,19)+'...'
  }
  useEffect(()=>{
    const friendId = conversation.members.find((m) => m !== currentUser);
    const getUser = async () => {
      try {
        const res = await axios(`${Url}/api/users?userId=${friendId}`);  
        setUser(res.data);
       
      } catch (err) {
        console.log(err); 
      }
    };
    getUser();
  },[currentUser, conversation])
  useEffect(() => {
    const getNewMes = async () => {
      try {
        const res = await axios(`${Url}/api/messages/lastmess/${conversation._id}`);
        const newM = res.data;
        if(res.data.conversationId === conversation._id){
          if(newM.reCall){
            newM.text = "tin nhắn đã thu hồi"
            setNewMes(newM)
          }
          else{
            setNewMes(newM);
          }
        }
        console.log(newMes)    
      } catch (err) {
        console.log(err); 
      }
    };
    getNewMes();
  }, [conversation]);

  useEffect(() => {
    const getUserName = async () => {
      try {
        const res = await axios(`${Url}/api/users/name?userId=${newMes.sender}`);  
        setUserName(res.data.username);
        
      } catch (err) {
        console.log(err); 
      }
    };
  
    getUserName();
  },[newMes]);
  const rightSwipeActions = () => {
    return (
      <View style={{justifyContent:'center',backgroundColor:'red',paddingHorizontal:20}}>
        <TouchableOpacity
          onPress={()=>{
            ref_sw.current.close();
          }}>
          <Ionicons name='trash-outline' size={21} color={'#fff'}/>
        </TouchableOpacity>
        
      </View>
    );
  };
  return (
    <GestureHandlerRootView>
    <Swipeable
      ref={ref_sw}
      renderRightActions={rightSwipeActions}
      // onSwipeableRightOpen={() => swipeFromRightOpen(item.id)}

    >
    <TouchableOpacity
      onPress={()=>{
        navigation.navigate('ChattingScreen')
        setCurrentChat(conversation)
        }}>
    <View style={styles.container}>
      <Image 
          source={{uri : conversation.name? conversation.img: user.avt}}
          style={{
              width:60,
              height:60,
              borderRadius:100,
              backgroundColor:'#008FF3',
          }}/>
      <View style={styles.center}>
        <Text style={styles.name_user}>{conversation.name? conversation.name : user.username}</Text>
        <Text style={styles.last_chat}>{newMes?.text? conversation.name?   mess( userName+': '+newMes?.text) :mess(newMes?.text): 'Chưa có tin nhắn'}</Text>
      </View>
      <Text>{newMes?.text?  CTime( myMes? myMes.conversationId === conversation._id? 
              myMes.createdAt:newMes.createdAt:newMes.createdAt):""}</Text>
    </View>
    </TouchableOpacity>
    </Swipeable>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:20,
    paddingVertical:10,
    borderBottomWidth:1,
    borderBottomColor:'#ECE9E9',
  },
  center:{
    marginRight:'auto',
    marginLeft:20,
  },
  name_user:{
    fontWeight:'400',
    fontSize:16,
  },
  last_chat:{
    marginTop:3,
    color:'#72808E'

  }
})