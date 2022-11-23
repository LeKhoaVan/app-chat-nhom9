import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import FriendReceive from '../components/FriendReceive';
import axios from 'axios';
import { Url } from '../contexts/constants';
export default function ReceiveFR({ navigation }) {
  
  const { userInfo, listReceive, setListReceive} = useContext(AuthContext);
  
  useEffect(() => {
    const loadlistReceive= async() => {
      try {
        const res = await axios.get(`${Url}/api/users/receiveFrs/${userInfo._id}`);
        setListReceive(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    loadlistReceive();
  }, [])
  return (
    <View
      style={{
      }}>
      {listReceive.length==0?
      <Text
        style={{
          fontSize: 15,
          marginTop:50,
          textAlign:'center',
        }}>
        Không có lời mời kết bạn đã nhận
      </Text>:<></>}
      <ScrollView>
        {listReceive.map((u) => (
          <FriendReceive key={u} item={u} />
        ))
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({})