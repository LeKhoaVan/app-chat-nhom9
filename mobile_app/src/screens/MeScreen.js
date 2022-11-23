import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../contexts/AuthContext'
export default function MeScreen() {
  const { userInfo } = useContext(AuthContext);
  // console.log('UserInfo:',userInfo);
  const Cdate = (date) => {
    let tempDate = new Date(date);
    let fDate = tempDate.getDate() + "/" + (tempDate.getMonth() * 1 + 1) + "/" + tempDate.getFullYear();
    return fDate;
  };
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: userInfo.avt }}
        style={{
          width: 150,
          height: 150,
          borderRadius: 100,
          borderWidth: 1,
          borderColor: '#fff'
        }} />
      <Text style={styles.text}>{userInfo.username}</Text>
      <View>
        <Text style={styles.text}>Email: {userInfo.email}</Text>
        <Text style={styles.text}>Ngày sinh: {Cdate(userInfo.birthday)}</Text>
        <Text style={styles.text}>Giới tính: {userInfo.gender}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    marginTop: 20,
    fontSize: 20,
  },
})