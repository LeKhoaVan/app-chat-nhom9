import { StyleSheet, Text, View, ScrollView, Keyboard} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Url } from '../contexts/constants';

export default function MessagesScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const {userInfo,senderMessage,recallStatus,authorize,conversations, setConversation,render} = useContext(AuthContext)
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${Url}/api/conversations/${userInfo._id}`);
        setConversation(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }, [userInfo._id,authorize,render]);
  return (
      <View style={styles.container}>
        <ScrollView>
         {conversations.map((c) => (

                <Conversation 
                  key={c._id} 
                  conversation={c} 
                  myMes={senderMessage}
                  recall={recallStatus} 
                  navigation={navigation}/>
            ))}
        </ScrollView>
      </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
  },
})

