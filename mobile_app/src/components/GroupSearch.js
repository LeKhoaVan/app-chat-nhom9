import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from "@react-navigation/native";

export default function GroupSearch({item,navigation}) {
    const {setAuthorize,setCurrentChat} = useContext(AuthContext);
    const nav = useNavigation();
  return (
    <TouchableOpacity
        onPress={()=>{
            setCurrentChat(item)
            setAuthorize(item.authorization)
            nav.navigate('ChattingScreen')
        }}
        style={{
            flexDirection:'row',
            alignItems:'flex-end',
            padding:10,
        }}>
        <Image 
            source={{uri:item.img}}
            style={{
                width:60,
                height:60,
                borderRadius:100,
            }}/>
        <Text
            style={{
                fontSize:16,
                borderBottomWidth:1,
                borderBottomColor:'#EBE8E8',
                width:'100%',
                padding:20,
            }}>
                {item.name}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({})