import { StyleSheet} from 'react-native'

import React from 'react'
import FriendRequestNavigator from '../navigation/FriendRequestNavigator'


export default function ContactsScreen() {
  return (
    <FriendRequestNavigator/>
  )
}
const styles = StyleSheet.create({
  container:{
    flex:1,
  },
})