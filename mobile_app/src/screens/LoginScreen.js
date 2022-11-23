import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {AuthContext}  from '../contexts/AuthContext';


export default function Login({navigation}) {
  const [visible,setVisible] = useState(true)
  const [loading,setLoading] = useState(false)
  const {login} = useContext(AuthContext)
  const [alert, setAlert] = useState('')
  const [email,setEmail] = useState('');
  const [password,setPassword] =useState('');
  const login_onpress = async () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if(reg.test(email)===false){
        setAlert("Định dạng email không đúng")
        ref_inputEmail.current.focus()
        setTimeout(() => setAlert(''), 5000)
    }
    else        
    try {
        const loginData =  await login({email:email,password:password})
        if (!loginData.success) {
            setAlert(loginData.message)
            setTimeout(() => setAlert(''), 5000)
        }
    } catch (error) {
        console.log(error)
    }
  }
  const ref_inputEmail = useRef();
  const ref_inputPassword = useRef();
  return (
    <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{width:'100%',alignItems:'center'}}>
            <Image
              source={require('../image/logo.jpg')}
              style={styles.logo}/>
            <View style={styles.inputEmail}>
                <Ionicons name='mail-outline' size={25} color={'#056282'} style={styles.icon}/>
                  <TextInput
                    ref={ref_inputEmail}
                    style={styles.input}
                    placeholder='Email'
                    value={email}
                    keyboardType='email-address'
                    onChangeText={(value)=>setEmail(value)}
                    onPressIn={()=>
                      setAlert('')}
                    onSubmitEditing={() => ref_inputPassword.current.focus()}
                    onBlur={()=>{
                      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                      if(reg.test(email)===false){
                        setAlert("Định dạng email không đúng")
                        ref_inputEmail.current.focus()
                        setTimeout(() => setAlert(''), 5000)
                      }
                    }}
                    />
            </View>
            <View style={styles.inputPass_cont}>
            <Ionicons name='lock-closed-outline' size={25} color={'#056282'} style={styles.icon}/>
              <TextInput
                ref={ref_inputPassword}
                style={styles.inputPass}
                placeholder='Mật khẩu'
                value={password}
                onChangeText={(value)=>setPassword(value) }
                onPressIn={()=>setAlert('')}
                secureTextEntry={visible}
                />
              <TouchableOpacity
                style={{width:'10%'}}
                onPress={()=>{
                  setVisible(!visible);
                }}>
              <Ionicons
                name={visible === false ? 'eye-outline' : 'eye-off-outline'}
                size={26}
                />
              </TouchableOpacity>
            </View>
            <Text style={{color:'#F15151',fontSize:16}}>{alert}</Text>
            <TouchableOpacity
              style={styles.btnLogin}
              onPress={()=>{
                login_onpress()
              }}>
              {/* {isLoading ?(
                <ActivityIndicator  size={28}/>
              ):(
              
                <Text style={styles.textLogin}>Đăng nhập</Text>
              )} */}
              <Text style={styles.textLogin}>Đăng nhập</Text>
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
                style={styles.btnRegister}
                onPress={()=> {navigation.navigate('RegisterScreen')}}>
                <Text style={styles.textRegister}>Đăng ký</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnForgot}>
                <Text style={styles.textForgot}>Quên mật khẩu</Text>
              </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
    width:180,
    height:180,
    borderRadius:100,
    marginTop:-100,
  },
  inputEmail:{
    width:'90%',
    borderBottomWidth:1,
    borderBottomColor:'#D0D4D3',
    fontSize:16,
    marginTop:10,
    paddingVertical:10,
    flexDirection:'row',
    alignItems:'center',
  },
  input:{
    fontSize:16,
    width:'90%',
  },
  icon:{
    marginRight:10,
  },
  inputPass_cont:{
    flexDirection:'row',
    width:'90%',
    alignItems:'center',
  },
  inputPass:{
    fontSize:16,
    paddingVertical:10,
    width:'83%',
    maxWidth:'83%',
  },
  btnLogin:{
    width:'90%',
    backgroundColor:'#056282',
    alignItems:'center',
    justifyContent:'center',
    height:45,
    borderRadius:20,
    marginTop:5,
    marginBottom:5,
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
    height:45,
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
    marginTop:10,
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