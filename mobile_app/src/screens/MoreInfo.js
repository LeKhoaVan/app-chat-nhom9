import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Url } from '../contexts/constants';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function MoreInfo() {
    const {userInfo,currentChat,socket} = useContext(AuthContext);
    const[avt,setAvt] = useState(null);
    const[user,SetUser] = useState({});
    const getUser = async () => {
        const friendId = currentChat.members.find((m) => m !== userInfo._id);
        try {
          const res = await axios(`${Url}/api/users/name?userId=${friendId}`);  
          {res.data.avt === ""? setAvt("null"):setAvt(res.data.avt) }
          SetUser(res.data);
        } catch (err) {
          console.log(err); 
        }
      };
      useEffect(()=>{
        console.log(currentChat);
        if(!currentChat.name)
            getUser();
        else
            setAvt(currentChat.img);
      },[])
  return (
    <View style={styles.container}>
      <View 
        style={{
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'#fff',
          width:'100%',
          paddingHorizontal:10,
          paddingVertical:30,

        }}>
        <Image 
            source={{uri:avt}}
            style={{
                width:100,
                height:100,
                borderRadius:100,
            }}/>
            <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',paddingVertical:20}}>
              <Text style={{fontSize:23,fontWeight:'500'}}>{currentChat.name? currentChat.name:user.username}</Text>
              {currentChat.name?
              <TouchableOpacity>
                <Ionicons
                    name='pencil-sharp' size={16} style={{backgroundColor:'#DEDEDE',padding:6,borderRadius:100,marginLeft:10}}/>
              </TouchableOpacity>:<></>}
            </View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity
                style={{alignItems:'center',justifyContent:'center',paddingHorizontal:20}} >
                <Ionicons
                  name='search' size={25} style={{backgroundColor:'#DEDEDE',padding:10,borderRadius:100,width:47}}/>
                <Text style={{fontSize:15,width:90,textAlign:'center'}}>Tìm kiếm tin nhắn</Text>
              </TouchableOpacity>
              {currentChat.name?
              <TouchableOpacity
                style={{alignItems:'center',justifyContent:'center',paddingHorizontal:20}} >
                <Ionicons
                  name='person-add-outline' size={25} style={{backgroundColor:'#DEDEDE',padding:10,borderRadius:100,width:47}}/>
                <Text style={{fontSize:15,width:90,textAlign:'center'}}>Thêm thành viên</Text>
              </TouchableOpacity>:<></>}
              
            </View>
      </View>
      <View 
      style={{
        justifyContent:'flex-start',
        backgroundColor:'#fff',
        width:'100%',
        padding:15,
        marginTop:10,
      }} >
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingVertical:10,}}> 
            <Ionicons
                name='images-outline' size={23} color={'#7E7E7E'} style={{marginLeft:10,paddingBottom:15}}/>
            <Text style={{fontSize:16,marginLeft:15,borderBottomWidth:1,borderBottomColor:'#DEDEDE',width:'100%',paddingBottom:15}}>
              Ảnh, file, link đã gửi</Text>
        </TouchableOpacity>
        {currentChat.name?
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingVertical:10,}}> 
            <Ionicons
                name='people-outline' size={23} color={'#7E7E7E'} style={{marginLeft:10,paddingBottom:15}}/>
            <Text style={{fontSize:16,marginLeft:15,borderBottomWidth:1,borderBottomColor:'#DEDEDE',width:'100%',paddingBottom:15}}>
              Xem thành viên</Text>
        </TouchableOpacity>:<></>}
        {!currentChat.name?
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingVertical:10,}}> 
            <AntDesign
                name='addusergroup' size={23} color={'#7E7E7E'} style={{marginLeft:10,paddingBottom:15}}/>
            <Text style={{fontSize:16,marginLeft:15,borderBottomWidth:1,borderBottomColor:'#DEDEDE',width:'100%',paddingBottom:15}}>
              Tạo nhóm với {user.username}</Text>
        </TouchableOpacity>:<></>}
        {!currentChat.name?
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingVertical:10,}}> 
            <Ionicons
                name='person-add-outline' size={23} color={'#7E7E7E'} style={{marginLeft:10,paddingBottom:15}}/>
            <Text style={{fontSize:16,marginLeft:15,borderBottomWidth:1,borderBottomColor:'#DEDEDE',width:'100%',paddingBottom:15}}>
              Thêm {user.username} vào nhóm</Text>
        </TouchableOpacity>:<></>}
        {!currentChat.name?
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingVertical:10,}}> 
            <Entypo
                name='block' size={23} color={'#7E7E7E'} style={{marginLeft:10,paddingBottom:15}}/>
            <Text style={{fontSize:16,marginLeft:15,borderBottomWidth:1,borderBottomColor:'#DEDEDE',width:'100%',paddingBottom:15}}>
              Chặn tin nhắn</Text>
        </TouchableOpacity>:<></>}
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingVertical:10,}}> 
            <Ionicons
                name='trash-outline' size={23} color={'#FD2828'} style={{marginLeft:10}}/>
            <Text style={{fontSize:16,marginLeft:15,width:'100%',color:'#FD2828'}}>
              Xóa lịch sử trò chuyện</Text>
        </TouchableOpacity>
        {currentChat.name?
        <TouchableOpacity style={{flexDirection:'row',alignItems:'center',paddingBottom:10,}}> 
            <Ionicons
                name='exit-outline' size={23} color={'#FD2828'} style={{marginLeft:10,paddingTop:15}}/>
            <Text style={{fontSize:16,marginLeft:15,width:'100%',borderTopWidth:1,borderTopColor:'#DEDEDE',color:'#FD2828',paddingTop:15}}>
              Rời nhóm</Text>
        </TouchableOpacity>:<></>}
        
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#DEDEDE',
    },
})