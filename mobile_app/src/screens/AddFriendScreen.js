import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function AddFriendScreen({ navigation }) {
  const [email, setEmail] = useState('');
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#fff',
          padding: 10,
          marginBottom: 20,
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
      <View
        style={{
          padding:10
        }}>
        <Text style={styles.text}>Thêm bạn bằng Email</Text>
        <View style={styles.inputText}>
          <TextInput
            placeholder='Nhập email'
            style={styles.input}
            onChangeText={(e) => setEmail(e)}
            value={email} />
          {email ?
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => setEmail('')}
              >
                <Ionicons
                  name='close-outline'
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: '#E0DFDF',
                  padding: 5,
                  borderRadius: 100,
                  marginLeft: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 35,
                  height: 35,
                }} >
                <Ionicons
                  name='search-outline'
                  size={20}
                  color={'#000'}
                />
              </TouchableOpacity>
            </View> : <></>}
        </View>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 20,
  },
  inputText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#72808E',
    padding: 10,
    height: 55,
  },
  input: {
    width: '75%',
    fontSize: 16,
  },
})