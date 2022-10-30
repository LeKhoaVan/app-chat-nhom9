import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AuthContext } from '../contexts/AuthContext'


export default function SettingScreen() {
    const{logout} = useContext(AuthContext)
  return (
    <View>
        <TouchableOpacity style={styles.button}>
            <Ionicons 
                name='image-outline'
                size={25}
                color='#0DA1B6'/>
            <Text style={styles.text}>Cập nhập ảnh đại diện</Text>
            <Ionicons 
                name='chevron-forward'
                size={25}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Ionicons 
                name='mail'
                size={25}
                color='#FF5042'/>
            <Text style={styles.text}>Đổi email</Text>
            <Ionicons 
                name='chevron-forward'
                size={25}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Ionicons 
                name='key-outline'
                size={25}
                color='#17D8B7'/>
            <Text style={styles.text}>Đổi mật khẩu</Text>
            <Ionicons 
                name='chevron-forward'
                size={25}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <MaterialCommunityIcons
                name='block-helper'
                size={25}
                color='#FA1010'/>
            <Text style={styles.text}>Danh sách chặn</Text>
            <Ionicons 
                name='chevron-forward'
                size={25}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
            <Ionicons 
                name='language'
                size={25}
                color='#E572F6'/>
            <Text style={styles.text}>Ngôn ngữ</Text>
            <Ionicons 
                name='chevron-forward'
                size={25}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={()=>logout()}>
        <Ionicons 
                name='md-log-out-outline'
                size={25}
                color='#CDCBCD'/>
            <Text style={styles.text}>Đăng xuất</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    button:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        padding:15,
        borderBottomWidth:1,
        borderBottomColor:'#ECE9E9',
    },
    text:{
        marginRight:'auto',
        marginLeft:20,
        fontSize:17,
    },
})