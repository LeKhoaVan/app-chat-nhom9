import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../contexts/AuthContext';

export default function CreateGroup({navigation}) {
    const {userInfo,currentChat,socket,setSenderMessage,setRecallStatus,userCons} = useContext(AuthContext);
    const [image,setImage]=useState("https://firebasestorage.googleapis.com/v0/b/appchatmobile-group9.appspot.com/o/image%2F70d296cd-524e-47ff-b39a-103bd25164e5-1668599358386?alt=media&token=ab42ec4e-dc70-4d9f-bd4b-824088d7dcb6");
    return (
        <SafeAreaView>
            <View style={styles.Header}>
                <TouchableOpacity 
                    onPress={()=> navigation.goBack()}>
                    <Ionicons 
                        name='arrow-back'
                        size={25}
                        color='#fff'
                        />
                </TouchableOpacity>
                <View style={styles.Name}>
                    <Text style={styles.text_Name}>Tạo nhóm mới</Text>
                    <Text style={styles.active}>Đã chọn:0</Text>
                </View>
            </View>
            <View 
                style={{
                    flexDirection:'row',
                    padding:10,
                    justifyContent:'center',
                    alignItems:'center'}}>
                {image==""? 
                <TouchableOpacity
                    style={{
                        width:'25%',
                        height:70,
                        justifyContent:'center',
                        alignItems:'center'}}>
                    <Ionicons name='camera-outline' size={30}/>
                </TouchableOpacity>:
                <Image
                    source={{uri:image}}
                    style={{width:70,height:70,borderRadius:100}}/>}
                <TextInput
                    placeholder='Đặt tên nhóm'
                    style={{
                        fontSize:16,
                        borderBottomWidth:1,
                        borderBottomColor:'#7E7E7E',
                        width:'75%',
                        height:50}}/>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    Header:{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'flex-start',
        alignItems:'center',
        backgroundColor:'#056282',
        padding:10,
    },
    text_Name:{
        color:'#fff',
        fontSize:16,
        fontWeight:'500',
    },
    active:{
        color:"#fff",
        fontSize:12,
        fontWeight:'300'
    },
    Name:{
        marginLeft:10,
    },
})