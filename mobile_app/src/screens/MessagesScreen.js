import { StyleSheet, Text, View, TouchableOpacity, FlatList,Image, Modal,TouchableWithoutFeedback, ScrollView} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Navigation} from '@react-navigation/native';
import ChattingScreen from './ChattingScreen';

import Conversation from '../components/Conversation'
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Url } from '../contexts/constants';

export default function MessagesScreen({navigation}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [conversations, setConversation] = useState([]);
  const {userInfo} = useContext(AuthContext)
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
  }, []);
  return (
      <View style={styles.container}>
        <ScrollView>
         {conversations.map((c) => (
                <Conversation key={c._id} conversation={c} currentUser={userInfo._id} navigation={navigation}/>
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

