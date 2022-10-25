import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function MeScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRqRyIiwYCq4s-fZi1zdmyfSuIPUvg9EyZ_Q&usqp=CAU'}}
        style={{
          width:150,
          height:150,
          borderRadius:100,
        }}/>
      <Text style={styles.text}>Nguyễn Thái Nguyên</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'flex-start',
    alignItems:'center',
    marginTop:50,
  },
  text:{
    marginTop:20,
    fontSize:20,
  },
  })