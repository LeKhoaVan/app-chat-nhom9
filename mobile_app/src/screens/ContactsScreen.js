import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import ContactsNavigator from '../navigation/ContactsNavigator'


export default function ContactsScreen() {
  return (
    <ContactsNavigator/>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
})