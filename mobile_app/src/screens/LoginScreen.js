import { ActivityIndicator, Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function Login({navigation}) {
  const [show,setShow] = useState(false)
  const [visible,setVisible] = useState(true)
  const [loading,setLoading] = useState(false)
  return (
    <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <View style={{width:'100%',alignItems:'center'}}>
          <Image
            source={require('../image/logo.jpg')}
            style={styles.logo}/>
          <TextInput
            style={styles.inputEmail}
            placeholder='Email'/>
          <View style={styles.inputPass_cont}>
            <TextInput
              style={styles.inputPass}
              placeholder='Mật khẩu'
              secureTextEntry={visible}/>
            <TouchableOpacity
              style={{width:'10%'}}
              onPress={()=>{
                setShow(!show);
                setVisible(!visible);
              }}>
            <Ionicons
              name={show === false ? 'eye-outline':'eye-off-outline'}
              size={26}
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.btnLogin}
            onPress={()=>{
              setLoading(!loading)
              navigation.navigate('HomeNavigator')
            }}>
            {loading ?(
              <ActivityIndicator  size={22}/>
            ):(
            
              <Text style={styles.textLogin}>Đăng nhập</Text>
            )}
            
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginWith}>
            <Image 
              source={require('../image/google.png')} 
              style={styles.logoGoogle}/>
            <Text style ={styles.textLoginWith}>Đăng nhập với Google</Text>
          </TouchableOpacity>
            <View style={styles.btnBottom}>
            <TouchableOpacity
              style={styles.btnRegister}>
              <Text style={styles.textRegister}>Đăng ký</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnForgot}>
              <Text style={styles.textForgot}>Quên mật khẩu</Text>
            </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView> 
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    width:'100%',
  },  
  logo:{
    width:200,
    height:200,
    borderRadius:100,
  },
  inputEmail:{
    width:'90%',
    borderBottomWidth:1,
    borderBottomColor:'#D0D4D3',
    fontSize:16,
    marginTop:10,
    paddingVertical:10,
  },
  inputPass_cont:{
    flexDirection:'row',
    width:'90%',
    alignItems:'center',
  },
  inputPass:{
    fontSize:16,
    paddingVertical:10,
    width:'90%',
    maxWidth:'90%',
  },
  btnLogin:{
    width:'90%',
    backgroundColor:'#056282',
    alignItems:'center',
    padding:10,
    borderRadius:20,
    marginTop:5,
  },
  textLogin:{
    fontSize:16,
    color:'#fff',
  },
  loginWith:{
    display:'flex',
    flexDirection:'row',
    borderWidth:1,
    width:'90%',
    borderRadius:20,
    borderColor:'#D0D4D3',
    padding:5,
    justifyContent:'center',
    alignItems:'center',
    marginVertical:10,
  },
  logoGoogle:{
    width:30,
    height:30,
    marginRight:10,
  },
  textLoginWith:{
    fontSize:16,
  },
  btnBottom:{
    flexDirection:'row',
    width:'90%',
    marginBottom:40,
    paddingHorizontal:40,
    justifyContent:'space-between',
  },
  textRegister:{
    fontSize:18,
    color:'#056282',
  },
  textForgot:{
    fontSize:18,
    color:'#F15151',
  }
})