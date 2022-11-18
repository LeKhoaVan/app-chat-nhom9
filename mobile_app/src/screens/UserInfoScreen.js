import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal, TouchableWithoutFeedback } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import React, { useContext, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AuthContext } from '../contexts/AuthContext'
import axios from 'axios'
import { Url } from '../contexts/constants'
export default function UserInfoScreen({ route, navigation }) {
  const Cdate = (date) => {
    let tempDate = new Date(date);
    let fDate = tempDate.getDate() + "/" + (tempDate.getMonth() * 1 + 1) + "/" + tempDate.getFullYear();
    return fDate;
  };
  const [modalVisible, setModalVisible] = useState(false);
  const { userInfo,conversations,setCurrentChat,setAuthorize} = useContext(AuthContext);
  async function handleChatOne(senderId, receiverId) {
    let conv
    let checkCon = false
    conversations.forEach((c) => {
      if (c.members.length == 2 && c.authorization.length == 0) {
        if (c.members.some((member) => (member == senderId))) {
          if (c.members.some((member) => (member == receiverId))) {
            checkCon = true
            conv = c
          }
        }

      }
    })
    if (checkCon) {
      setCurrentChat(conv);
      setAuthorize(conv.authorization)
      navigation.navigate('ChattingScreen')
    }
    else {
      const args = { senderId, receiverId }
      try {
        const res = await axios.post(`${Url}/api/conversations`, args);

        //const con = await axios.get("http://localhost:8800/api/conversations/" + _id);
        //setConversation(con.data);
        setCurrentChat(res.data);
        setAuthorize(res.data.authorization)
        navigation.navigate('ChattingScreen')
      } catch (err) {
        console.log(err)
      }

    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.Header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}>
          <Ionicons
            name='arrow-back'
            size={25}
            color='#fff'
          />
        </TouchableOpacity>
        <View style={styles.Name}>
          <Text style={styles.text_Name}>{route.params.user.username}</Text>
        </View>
        <TouchableOpacity
          style={{ marginLeft: 'auto' }}
          onPress={()=>setModalVisible(true)}>
          <Ionicons name='ellipsis-horizontal' size={20} color={'#fff'}  />
        </TouchableOpacity>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={{ uri: route.params.user.avt }}
          style={{
            width: 150,
            height: 150,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: '#fff',
            marginTop: 120,
          }} />
        <Text style={styles.text}>{route.params.user.username}</Text>
        <View>
          <Text style={styles.text}>Email: {route.params.user.email}</Text>
          <Text style={styles.text}>Ngày sinh: {Cdate(route.params.user.birthday)}</Text>
          <Text style={styles.text}>Giới tính: {route.params.user.gender}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 20,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#DFDFDF',
              padding: 10,
              borderRadius: 5,
            }}
            onPress={()=>handleChatOne(userInfo._id,route.params.user._id)}>
            <Ionicons name='chatbubble-ellipses-outline' size={26} color={'#056282'}
              style={{}} />
            <Text
              style={{
                fontSize: 16,
                color: '#056282',
                marginLeft: 10,
              }}>Nhắn tin</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: '#DFDFDF',
              marginLeft: 30,
              padding: 10,
              borderRadius: 10,
              flexDirection: 'row',
            }}>
            <Ionicons name='person-add-outline' size={26} color={'#056282'} style={{ marginLeft: 'auto' }} />
            <Text
              style={{
                fontSize: 16,
                color: '#056282',
                marginLeft: 10,
              }}>Kết bạn</Text>
          </TouchableOpacity>
          <Modal
            visible={modalVisible}
            transparent={true}
            onRequestClose={() => setModalVisible(false)}
            animationType='fade'
            hardwareAccelerated>
            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
              <View style={styles.centered_view} >
                <View style={styles.modal_cont}>
                  <View style={styles.modal_body}>
                    <TouchableOpacity
                      onPress={() => {setModalVisible(false)}}
                      style={styles.choose}>
                      <Text style={styles.text_choose}>Chặn tin nhắn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {setModalVisible(false)}}
                      style={styles.choose}>
                      <Text style={{
                        fontSize:16,
                        color:'#EE4545'
                      }}>Xóa bạn</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    marginTop: 20,
    fontSize: 20,
  },
  Header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#056282',
    padding: 10,
    width: '100%'
  },
  text_Name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  active: {
    color: "#fff",
    fontSize: 12,
    fontWeight: '300'
  },
  Name: {
    marginLeft: 10,
  },
  centered_view: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    margin:10,
    // backgroundColor: '#00000099',
  },
  modal_cont: {
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  modal_body: {
    padding: 10,
  },
  choose: {
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text_choose: {
    fontSize: 16,
  }
})