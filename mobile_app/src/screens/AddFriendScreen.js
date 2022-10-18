import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function AddFriendScreen() {
  const [email,setEmail]=useState('');
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>Thêm bạn bằng Email</Text>
        <View style={styles.inputText}>
            <TextInput
                placeholder='Nhập email'
                style={styles.input}
                onChangeText={(e)=>setEmail(e)}
                value={email}/>
            <TouchableOpacity
                onPress={()=>setEmail('')}
                style={styles.btnclean}>
                  <Ionicons
                    name='close-outline'
                    size={20}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnSearch}>
                <Text>Tìm kiếm</Text>
            </TouchableOpacity>
        </View>
      </View>
      <View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:10,
    },
    text:{
      fontSize:16,
      fontWeight:'400',
    },
    inputText:{
      display:'flex',
      flexDirection:'row',
      justifyContent:'center',
      alignItems:'center',
      marginTop:10,
      borderWidth:1,
      borderRadius:10,
      borderColor:'#72808E',
      paddingVertical:10,
    },
    input:{
      width:'70%',
    },
    btnclean:{
      
    },
    btnSearch:{
      backgroundColor:'#056282',
      padding:10,
      borderRadius:10,
    }
})