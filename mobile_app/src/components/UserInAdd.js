import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../contexts/AuthContext';

export default function UserInAdd({ item }) {
  const { listUserGroupAddNew, setListUserGroupAddNew } = useContext(AuthContext);
  return (
    <TouchableOpacity
      onPress={() => {
        const members = listUserGroupAddNew.filter(
          (u) => u._id !== item._id
        )
        setListUserGroupAddNew(members)
      }}
      style={{
        marginRight: 10,
      }}>
      <View>
        <Image
          source={{ uri: item.avt }}
          style={{ width: 60, height: 60, borderRadius: 100, }}
        />
        {item.isActive ?
          <View
            style={{
              width: 12,
              height: 12,
              backgroundColor: '#46AB5E',
              borderRadius: 100,
              position: 'absolute',
              marginTop: 45,
              marginLeft: 45,
            }}>
          </View> : <></>}
      </View>
      <Ionicons
        name='close'
        color={'#7C7C7C'}
        size={18}
        style={{
          position: 'absolute',
          backgroundColor: '#E0DFDF',
          borderRadius: 100,
          marginLeft: 40,
        }} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})