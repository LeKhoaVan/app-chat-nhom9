import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

export default function Messager({ message, own, userId}) {
    const CTime = (date) => {
        let tempDate = new Date(date);
        let fDate =tempDate.getHours()+":"+tempDate.getMinutes();
        return fDate;
      };
  return (
    <View style={[
        styles.container, own? styles.me_container : styles.notMe_container]}> 
      <Text style={[styles.text,{color: own? '#fff' : '#000' }]}>{message.text}</Text>
      <Text style={{color:'#939393',fontSize:13}}>{CTime(message.createdAt)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        padding:10,
        margin:10,
        borderRadius:10,
        maxWidth:'70%',
    },
    me_container:{
        backgroundColor:'#056282',
        marginLeft:'auto',
        marginRight:10,
    },
    notMe_container:{
        backgroundColor:'#A5EBFF',
        marginLeft:10,
        marginRight:'auto',
    },
    text:{
        fontSize:16,
    }
})