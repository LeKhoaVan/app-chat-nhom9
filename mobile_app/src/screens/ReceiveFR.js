import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import FriendReceive from '../components/FriendReceive';
export default function ReceiveFR({ navigation }) {
  const [listReceive, setListReceive] = useState([])
  const { userInfo, } = useContext(AuthContext);
  
  useEffect(() => {
    const loadlistReceive= () => {
      let listR=[]
      userInfo.receiveFrs.forEach((c) => {
          listR.push(c)
      });
      setListReceive(listR)
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