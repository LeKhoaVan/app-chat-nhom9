import { StyleSheet, Text, View, ScrollView, Keyboard, RefreshControl } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Conversation from '../components/Conversation'
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Url } from '../contexts/constants';

export default function MessagesScreen({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const { userInfo, senderMessage, recallStatus, authorize, conversations, setConversation, render } = useContext(AuthContext)
  const [refreshing, setRefreshing] = useState(false);
  const load = () => {
    const getConversations = async () => {
      try {
        const res = await axios.get(`${Url}/api/conversations/${userInfo._id}`);
        setConversation(res.data);
        setRefreshing(false);
      } catch (err) {
        console.log(err);
      }
    };
    getConversations();
  }
  useEffect(() => {
    load();
  }, [userInfo._id, authorize, render]);
  const onRefresh = () => {
    setRefreshing(true)
    load();
  }
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        {conversations.map((c) => (
          <Conversation
            key={c._id}
            conversation={c}
            myMes={senderMessage}
            recall={recallStatus}
            navigation={navigation} />
        ))}
        {conversations.length ==0?
        <View
        style={{
          marginTop:100,
          alignItems:'center',
        }}>
          <Text
            style={{
              fontSize:17,
            }}>Chưa có tin nhắn</Text>
        </View>:<></>}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})

