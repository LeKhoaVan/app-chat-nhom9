import { ActivityIndicator, Alert, Image, Keyboard, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerificationScreen({ route }) {
    const pin1 = useRef();
    const pin2 = useRef();
    const pin3 = useRef();
    const pin4 = useRef();
    const [pin1v, setPin1v] = useState("");
    const [pin2v, setPin2v] = useState("");
    const [pin3v, setPin3v] = useState("");
    const [pin4v, setPin4v] = useState("");
    const { checkOTP,loadUser_Register,setUserToken} = useContext(AuthContext)
    const [alert, setAlert] = useState(null)
    const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
    const otpCode = () => {
        return (pin1v + pin2v + pin3v + pin4v);
    }
    const otp = async () => {
        try {
            const otpData = await checkOTP({
                email: route.params,
                otp: otpCode()
            })
            console.log({email: route.params,
                otp: otpCode});
            if (otpData.success) {
                setIsRegisterSuccess(true);
                setTimeout(()=>{
                        setUserToken(otpData.accessToken);
                        AsyncStorage.setItem('userToken',otpData.accessToken);
                        loadUser_Register() ;
                        setAlert(null)
                        setIsRegisterSuccess(false)
                    },2000)
            }
            else{
                setAlert(otpData.message)
                setTimeout(() => setAlert(null), 5000)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <View
            style={{
                backgroundColor: '#f7f7f7',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Image
                source={require('../image/verification.png')}
                style={{ width: 150, height: 150 }} />
            <Text
                style={{
                    fontSize: 16,
                }}>
                ???? g???i m?? OTP ?????n
            </Text>
            <Text
                style={{
                    fontSize: 16,
                    fontWeight: '500'
                }}>
                {route.params}
            </Text>
            <Text
                style={{ fontSize: 15 }}>
                Xin ki???m tra email v?? ??i???n m?? x??c nh???n b??n d?????i</Text>
            <View
                style={{
                    width: '80%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 20,
                }}>
                <TextInput
                    ref={pin1}
                    style={{
                        borderWidth: 2,
                        borderRadius: 10,
                        width: 50,
                        height: 50,
                        fontSize: 35,
                        textAlign: 'center',
                    }}
                    value={pin1v}
                    autoFocus={true}
                    selectTextOnFocus={true}
                    maxLength={1}
                    keyboardType={'number-pad'}
                    onChangeText={(e) => {
                        setPin1v(e.replace(/[^0-9]/g, ''))
                        if (e.replace(/[^0-9]/g, '') != "") pin2.current.focus();
                    }}
                />
                <TextInput
                    ref={pin2}
                    style={{
                        borderWidth: 2,
                        borderRadius: 10,
                        width: 50,
                        height: 50,
                        fontSize: 35,
                        textAlign: 'center',
                    }}
                    value={pin2v}
                    selectTextOnFocus={true}
                    maxLength={1}
                    keyboardType={'number-pad'}
                    onChangeText={(e) => {
                        setPin2v(e.replace(/[^0-9]/g, ''))
                        if (e.replace(/[^0-9]/g, '') != "") pin3.current.focus();
                    }}
                />
                <TextInput
                    ref={pin3}
                    style={{
                        borderWidth: 2,
                        borderRadius: 10,
                        width: 50,
                        height: 50,
                        fontSize: 35,
                        textAlign: 'center',
                    }}
                    value={pin3v}
                    selectTextOnFocus={true}
                    maxLength={1}
                    keyboardType={'number-pad'}
                    onChangeText={(e) => {
                        setPin3v(e.replace(/[^0-9]/g, ''))
                        if (e.replace(/[^0-9]/g, '') != "") pin4.current.focus();
                    }}
                />
                <TextInput
                    ref={pin4}
                    style={{
                        borderWidth: 2,
                        borderRadius: 10,
                        width: 50,
                        height: 50,
                        fontSize: 35,
                        textAlign: 'center',
                    }}
                    value={pin4v}
                    selectTextOnFocus={true}
                    maxLength={1}
                    keyboardType={'number-pad'}
                    onChangeText={(e) => {
                        setPin4v(e.replace(/[^0-9]/g, ''))
                        if (e.replace(/[^0-9]/g, '') != "") Keyboard.dismiss();
                    }}
                />
            </View>
            <Text
                style={{
                    fontSize: 17,
                    marginTop: 20,
                    color: '#DC0E0E',
                }}>
                {alert}
            </Text>
            <TouchableOpacity
                onPress={()=>otp()}
                style={{
                    backgroundColor: '#056282',
                    padding: 12,
                    borderRadius: 10,
                    width: 150,
                    height:50,
                    justifyContent:'center',
                    alignItems: 'center',
                    marginTop: 20,
                }}>


                {isRegisterSuccess ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 16, color: '#fff' }}>????ng nh???p..</Text>
                        <ActivityIndicator size={'large'} />
                    </View>
                ) : (

                    <Text
                        style={{
                            fontSize: 16,
                            color: '#fff',
                        }}>X??c th???c</Text>
                )}
            </TouchableOpacity>
            <View
                style={{
                    alignItems: 'center',
                    marginTop: 30,
                }}>
                <Text
                    style={{ fontSize: 16 }}>
                    B???n ch??a nh???n m?? ho???c m?? ???? h???t h???n?</Text>
                <TouchableOpacity>
                    <Text
                        style={{
                            color: '#056282',
                            fontSize: 15,
                            fontWeight: '600'
                        }}>G???i l???i m??</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})