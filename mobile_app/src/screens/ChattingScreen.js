import { StyleSheet, Text, View,TouchableOpacity, TextInput} from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function ChattingScreen({navigation}) {
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
                <Text style={styles.text_Name}>Nguyễn Thái Nguyên</Text>
                <Text style={styles.active}>Đang hoạt động</Text>
            </View>
            <TouchableOpacity>
                <Ionicons
                    name='call-outline'
                    size={25}
                    color='#fff'/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons
                    name='videocam-outline'
                    size={25}
                    color='#fff'/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons
                    name='list-outline'
                    size={25}
                    color='#fff'/>
            </TouchableOpacity>
        </View>
        <View style={styles.input}>
            <TouchableOpacity>
                <Ionicons
                    name='happy-outline'
                    size={25}/>
            </TouchableOpacity>
            <TextInput style={styles.input_text}
                placeholder='Nhập tin nhắn'/>
            <TouchableOpacity>
                <Ionicons
                    name='attach'
                    size={25}/>
            </TouchableOpacity>
            <TouchableOpacity>
                <Ionicons
                    name='images-outline'
                    size={25}/>
            </TouchableOpacity>
        </View>
    </SafeAreaView>

  )
}

const styles = StyleSheet.create({
    Header:{
        display:'flex',
        flexDirection:'row',
        justifyContent: 'space-between',
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
        width:200,
    },
    input:{
        display:'flex',
        flexDirection:'row',
        backgroundColor:"#fff",
        padding:10,
        justifyContent:'space-between',
        alignItems:'center',
        height:50,
    },
    input_text:{
        width:'70%',
        height:50,
        maxHeight:100,
    }
})