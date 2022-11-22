import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import FriendSend from '../components/FriendSend';
export default function SendFR({ navigation }) {
  const [listSend, setListSend] = useState([])
  const { userInfo, } = useContext(AuthContext);
  
  useEffect(() => {
    const loadlistSend= () => {
      let listS=[]
      userInfo.sendFrs.forEach((c) => {
          listS.push(c)
      });
      setListSend(listS)
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