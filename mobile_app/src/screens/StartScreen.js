import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function StartScreen() {
  return (
    <View
        style={{
            flex:1,
            justifyContent:'center',
            alignItems:'center',
            backgroundColor:'#1dbbd6',
        }}>
      <Image
        source={require('../image/logo.jpg')}
        style={{
            width:200,
            height:200,
        }}/>
    </View>
  )
}

const styles = StyleSheet.create({})