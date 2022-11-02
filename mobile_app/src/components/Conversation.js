import { StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native'
import React, { useEffect, useState } from 'react'
import { GestureHandlerRootView,Swipeable } from 'react-native-gesture-handler'
import axios from 'axios';

export default function Conversation({ conversation, currentUser,navigation}) {
  const [user, setUser] = useState([]);
  const [lastMess, setLastMess] = useState([]);
  const CTime = (date) => {
    let tempDate = new Date(date);
    let fDate =tempDate.getHours()+":"+tempDate.getMinutes();
    return fDate;
  };
  const mess=(m)=>{
    if(m.length<=23)
      return m
    else 
      return m.slice(0,19)+'...'
  }

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser);
    const getUser = async () => {
      try {
        const res = await axios("http://192.168.74.90:8800/api/users?userId="+friendId);  
        setUser(res.data);
      } catch (err) {
        console.log(err); 
      }
    };
    const getLastMess = async () => {
      try {
        const res = await axios("http://192.168.74.90:8800/api/messages/lastmess/"+conversation._id);  
        setLastMess(res.data);
        
      } catch (err) {
        console.log(err); 
      }
    };
    getUser();
    getLastMess();

  }, [currentUser, conversation]);

  // const rightSwipeActions = () => {
  //   return (
  //     <View>
  //       <Text>Book</Text>
  //     </View>
  //   );
  // };
  return (
    // <GestureHandlerRootView>
    // <Swipeable
    //   renderRightActions={rightSwipeActions}
    //   // onSwipeableRightOpen={() => swipeFromRightOpen(item.id)}
    // >
    <TouchableOpacity
      onPress={()=>navigation.navigate('ChattingScreen')}>
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
        <Text style={styles.last_chat}>{lastMess?.text? conversation.name?   mess('Khoa: '+lastMess?.text) :mess(lastMess?.text): 'Chưa có tin nhắn'}</Text>
        
      </View>
      <Text>{lastMess?.text? CTime(lastMess?.createdAt):''}</Text>
    </View>
    </TouchableOpacity>
    // </Swipeable>
    // </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
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