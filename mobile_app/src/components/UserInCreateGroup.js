import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../contexts/AuthContext';

export default function UserInCreateGroup({item}) {
  const { listUserGroupNew, setListUserGroupNew } = useContext(AuthContext);
  return (
    <TouchableOpacity
        onPress={()=>{
          const members = listUserGroupNew.filter(
            (u) => u._id !== item._id
          )
          setListUserGroupNew(members)
        }}
        style={{
            marginRight:10,
        }}>
      <Image 
        source={{uri:item.avt}}
        style={{width:60,height:60, borderRadius:100,}}
        />
      <Ionicons 
        name='close'
        color={'#7C7C7C'}
        size={18}
        style={{
          position:'absolute',
          backgroundColor:'#E0DFDF',
          borderRadius:100,
          marginLeft:40,
        }}/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})