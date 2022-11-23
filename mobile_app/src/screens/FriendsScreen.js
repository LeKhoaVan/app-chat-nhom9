import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import Friend from '../components/Friend';
import Ionicons from 'react-native-vector-icons/Ionicons'
import axios from 'axios';
import { Url } from '../contexts/constants';
export default function FriendsScreen({ navigation }) {

  const { userInfo, listFriend, setListFriend} = useContext(AuthContext);
  
  useEffect(() => {
    const loadlistFriend = async() => {
      try {
        const res = await axios.get(`${Url}/api/users/friends/${userInfo._id}`);
        setListFriend(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    loadlistFriend();
  }, [])
  return (
    <View
      style={{
      }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 10,
        }}
        onPress={() => {
          navigation.navigate('FriendRequest')
        }}>
        <Ionicons name='person-add' size={25} color={'#056282'}
          style={{
            backgroundColor: '#EAFAF8',
            borderRadius: 100,
            padding: 5,
            marginRight: 15,
          }} />
        <Text style={{
          fontSize: 16,
        }}>Lời mời kết bạn</Text>
      </TouchableOpacity>
      <Text
        style={{
          fontSize: 15,
          padding: 10,

        }}>
        Danh sách bạn bè ({listFriend.length})
      </Text>
      <ScrollView>
        {listFriend.map((u) => (
          <Friend key={u} item={u} />
        ))
        }
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({})