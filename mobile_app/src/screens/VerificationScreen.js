import { Image, Keyboard, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useRef, useState } from 'react'

export default function VerificationScreen({route}) {
    const pin1 = useRef();
    const pin2 = useRef();
    const pin3 = useRef();
    const pin4 = useRef();
    const [pin1v,setPin1v]=useState("");
    const [pin2v,setPin2v]=useState("");
    const [pin3v,setPin3v]=useState("");
    const [pin4v,setPin4v]=useState("");
  return (
    <View
        style={{
            backgroundColor:'#f7f7f7',
            flex:1,
            justifyContent:'center',
            alignItems:'center',
        }}>
        <Image
            source={require('../image/verification.png')}
            style={{width:150,height:150}}/>
        <Text>
            Đã gửi mã OTP đến
        </Text>
        <Text>
        {route.params} 
        </Text>
        <Text>Xin kiểm tra email và điền mã xác nhận bên dưới</Text>
        <View
            style={{
                width:'80%',
                flexDirection:'row',
                justifyContent:'space-around',
                marginTop:20,
            }}>
            <TextInput
                ref={pin1}
                style={{
                    borderWidth:2,
                    borderRadius:10,
                    width:50,
                    height:50,
                    fontSize:35,
                    textAlign:'center',
                }}
                value={pin1v}
                autoFocus={true}
                selectTextOnFocus={true}
                maxLength={1}
                keyboardType={'number-pad'}
                onChange={(e)=>{
                    setPin1v(e)
                    if(e!="") pin2.current.focus();
                }}
                />
            <TextInput
                ref={pin2}
                style={{
                    borderWidth:2,
                    borderRadius:10,
                    width:50,
                    height:50,
                    fontSize:35,
                    textAlign:'center',
                }}
                value={pin2v}
                selectTextOnFocus={true}
                maxLength={1}
                keyboardType={'number-pad'}
                onChange={(e)=>{
                    setPin2v(e)
                    if(e!="") pin3.current.focus();
                }}
                />
            <TextInput
                ref={pin3}
                style={{
                    borderWidth:2,
                    borderRadius:10,
                    width:50,
                    height:50,
                    fontSize:35,
                    textAlign:'center',
                }}
                value={pin3v}
                selectTextOnFocus={true}
                maxLength={1}
                keyboardType={'number-pad'}
                onChange={(e)=>{
                    setPin3v(e)
                    if(e!="") pin4.current.focus();
                }}
                />
            <TextInput
                ref={pin4}
                style={{
                    borderWidth:2,
                    borderRadius:10,
                    width:50,
                    height:50,
                    fontSize:35,
                    textAlign:'center',
                }}
                value={pin4v}
                selectTextOnFocus={true}
                maxLength={1}
                keyboardType={'number-pad'}
                onChange={(e)=>{
                    setPin4v(e)
                    if(e!="") Keyboard.dismiss();
                }}
                />
        </View>
    </View>
  )
}

const styles = StyleSheet.create({})