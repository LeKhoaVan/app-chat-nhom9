import { StyleSheet, Text, View, Image} from 'react-native'
import React from 'react'

export default function Conversation({item}) {
  return (
    <View style={styles.container}>
      <Image 
          source={{uri : item.user_avt}}
          style={{
              width:60,
              height:60,
              borderRadius:100,
              backgroundColor:'#008FF3',
          }}/>
      <View style={styles.center}>
        <Text style={styles.name_user}>{item.user_name}</Text>
        <Text style={styles.last_chat}>{item.last_chat}</Text>
      </View>
      <Text>{item.time_last_chat}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    padding:15,
    borderBottomWidth:1,
    borderBottomColor:'#ECE9E9',
  },
  center:{
    marginRight:'auto',
    marginLeft:20,
  },
  name_user:{
    fontWeight:'400',
    fontSize:16,
  },
  last_chat:{
    marginTop:3,
    color:'#72808E'

  }
})