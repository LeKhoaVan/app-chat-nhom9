import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { GestureHandlerRootView,Swipeable } from 'react-native-gesture-handler'
import axios from 'axios';
import { AuthContext } from '../contexts/AuthContext';
import { Url } from '../contexts/constants'
import Ionicons from 'react-native-vector-icons/Ionicons' 

export default function Conversation({ conversation, currentUser,navigation}) {
  const [user, setUser] = useState({});
  const [lastMess, setLastMess] = useState({});
  const [name,setName]= useState("");
  const {currentChat,setCurrentChat,userInfo} = useContext(AuthContext);
  const ref_sw = useRef();
  const CTime = (date) => {
    let tempDate = new Date(date);
    let minute = tempDate.getMinutes();
    {minute<10? minute='0'+minute:minute=minute}
    let fDate =tempDate.getHours()+":"+minute;
    return fDate;
  };
  const friendId = conversation.members.find((m) => m !== userInfo._id);
  const mess=(m)=>{
    if(m.length<=23)
      return m
    else 
      return m.slice(0,19)+'...'
  }
  const getUser = async () => {
    try {
      const res = await axios(`${Url}/api/users?userId=${friendId}`);  
      setUser(res.data);
    } catch (err) {
      // console.log(err); 
    }
  };
  const getLastMess = async () => {
    try {
      const res = await axios(`${Url}/api/messages/lastmess/${conversation._id}`);  
      setLastMess(res.data);
      const ress = await axios(`${Url}/api/users/name?userId=${res.data.sender}`);  
      setName(ress.data.username);
    } catch (err) {
      // console.log(err); 
    }
  };
  useEffect(() => {
    getUser();
    getLastMess();
    // getUsernameSendLastMess();
  }, []);
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
        <Text style={styles.last_chat}>{lastMess?.text? conversation.name?   mess( name+': '+lastMess?.text) :mess(lastMess?.text): 'Chưa có tin nhắn'}</Text>
        
      </View>
      <Text>{lastMess?.text? CTime(lastMess?.createdAt):''}</Text>
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