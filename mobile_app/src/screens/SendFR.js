import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import FriendSend from '../components/FriendSend';
import axios from 'axios';
import { Url } from '../contexts/constants';
export default function SendFR({ navigation }) {
  
  const { userInfo,listSend, setListSend } = useContext(AuthContext);
  
  useEffect(() => {
    const loadlistSend= async() => {
      try {
        const res = await axios.get(`${Url}/api/users/sendFrs/${userInfo._id}`);
        setListSend(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    loadlistSend();
  }, [])
  return (
    <View
      style={{
      }}>
      {listSend.length==0?
      <Text
        style={{
          fontSize: 15,
          marginTop:50,
          textAlign:'center',
        }}>
        Không có lời mời kết bạn đã gửi
      </Text>:<></>}
      <ScrollView>
        {listSend.map((u) => (
          <FriendSend key={u} item={u} />
        ))
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({})