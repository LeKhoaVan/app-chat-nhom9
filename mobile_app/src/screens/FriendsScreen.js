import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

export default function FriendsScreen({navigation}) {
  return (
    <View>
      <TouchableOpacity onPress={()=>navigation.navigate("FriendRequest")}>
        <Text>FriendsScreen</Text>
        <Text>FriendsScreen</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})