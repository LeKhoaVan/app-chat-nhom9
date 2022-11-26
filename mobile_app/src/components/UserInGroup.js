import { Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { Url } from '../contexts/constants';
import axios from 'axios';
import { useNavigation } from "@react-navigation/native";

export default function UserInGroup({ user }) {
  const { userInfo, currentChat, authorize, setAuthorize, 
    setUserCons, conversations, setCurrentChat, setRender,setListSend } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const nav = useNavigation();
  function RemoveAuth(conId, userId) {
    const article = { conId, userId };
    const con = axios.put(`${Url}/api/conversations/removeAuthorize`, article)
    con.then(value => {
      setAuthorize(value.data)
    })
  }
  const handlesendAddFriend = async () => {
    try {
      const data = {
        userId: user._id,
      };
      const res = await axios.put(`${Url}/api/users/${userInfo._id}/SendAddFriend`, data);
    } catch (err) {
      console.log(err);
    };
    try {
      const res = await axios.get(`${Url}/api/users/sendFrs/${userInfo._id}`);
      userInfo.sendFrs=res.data
      setListSend(res.data)
    } catch (err) {
      console.log(err);
    }

  }
  function SetAuth(conId, userId) {

    const article = { conId, userId };
    const con = axios.put(`${Url}/api/conversations/setAuthorize`, article)
    con.then(value => {
      setAuthorize(value.data)
    })

  }
  function RemoveUserCon(conId, userId) {

    const article = { conId, userId };
    const con = axios.put(`${Url}/api/conversations/removeMember`, article)

    con.then(async value => {
      let list = [];
      let listmember = [];
      for (let index = 0; index < value.data.length; index++) {
        const res = await axios.get(`${Url}/api/users?userId=` + value.data[index]);
        list.push(res.data)
        listmember.push(res.data._id);
      }
      setUserCons(list);
      currentChat.members = listmember;
      setRender(Math.random());
    })
  }
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
      nav.navigate('ChattingScreen')
    }
    else {
      const args = { senderId, receiverId }
      try {
        const res = await axios.post(`${Url}/api/conversations`, args);

        //const con = await axios.get("http://localhost:8800/api/conversations/" + _id);
        //setConversation(con.data);
        setCurrentChat(res.data);
        setAuthorize(res.data.authorization)
        nav.navigate('ChattingScreen')
      } catch (err) {
        console.log(err)
      }

    }
  }
  return (
    <View
      style={{ flexDirection: 'row', justifyContent:'space-between',alignItems:'center', paddingHorizontal: 20, paddingVertical: 10 }}>
      <TouchableOpacity
        style={{flexDirection:'row',alignItems:'center',width:'80%'}}
        onLongPress={() => setModalVisible(user._id == userInfo._id ? false : true)}>
        <View>
          <Image source={{ uri: user.avt }}
            style={{ width: 60, height: 60, borderRadius: 100, marginRight: 20 }} />
          {user.isActive ?
            <View
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#46AB5E',
                borderRadius: 100,
                position: 'absolute',
                marginTop: 45,
                marginLeft: 45,
              }}>
            </View> : <></>}
        </View>
        <View>
          <Text style={{ fontSize: 17 }}>{user.username == userInfo.username ? "Bạn" : user.username}</Text>
          <Text>{authorize.map((auth) => (
            auth === user._id ? "Quản trị viên" : ""
          ))}</Text>
        </View>
      </TouchableOpacity>
      {
        user._id != userInfo._id && !userInfo.friends.some((u) => u == user._id) &&
          !userInfo.receiveFrs.some((u) => u == user._id) &&
          !userInfo.sendFrs.some((u) => u == user._id) ?
          <TouchableOpacity
            onPress={()=>handlesendAddFriend()}>
            <Ionicons name='person-add-outline' size={20} color={'#056282'}   />
          </TouchableOpacity>
          : <View key={Math.random()}></View>
      }
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType='slide'
        hardwareAccelerated>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.centered_view} >
            <View style={styles.modal_cont}>
              <View
                style={styles.modal_title}>
                <Text style={{ fontSize: 18, fontWeight: '400', textAlign: 'center' }}>Thông tin thành viên</Text>
                <Ionicons name='close-outline' size={26} />
              </View>
              <View
                style={styles.info}>
                <View>
                  <Image source={{ uri: user.avt }}
                    style={{ width: 60, height: 60, borderRadius: 100, marginRight: 20 }} />
                  {user.isActive ?
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: '#46AB5E',
                        borderRadius: 100,
                        position: 'absolute',
                        marginTop: 45,
                        marginLeft: 45,
                      }}>
                    </View> : <></>}
                </View>
                <Text style={{ fontSize: 17, fontWeight: '500', marginRight: 'auto' }}>{user.username == userInfo.username ? "Bạn" : user.username}</Text>
                <TouchableOpacity
                  onPress={() => handleChatOne(userInfo._id, user._id)}>
                  <Ionicons name='chatbubble-ellipses-outline' size={26} color={'#056282'}
                    style={{ marginLeft: 'auto', }} />
                </TouchableOpacity>
              </View>
              <View
                style={styles.modal_body}>
                <TouchableOpacity
                  onPress={() => nav.navigate({ name: 'UserInfoScreen', params: { user } })}
                  style={styles.choose}>
                  <Text style={styles.text_choose}>Xem trang cá nhân</Text>
                </TouchableOpacity>
                {authorize.map((auth) => (
                  auth != userInfo._id || user._id == userInfo._id ?
                    <View key={Math.random()}></View> :
                    <View key={Math.random()}>
                      {authorize.some((auth1) => (
                        auth1 === user._id)) ?
                        <View key={Math.random()}></View> :
                        <TouchableOpacity
                          key={user._id}
                          style={styles.choose}
                          onPress={() => {
                            SetAuth(currentChat._id, user._id)
                            setModalVisible(false)
                          }}>
                          <Text style={styles.text_choose}>Chỉ định quản trị viên</Text>
                        </TouchableOpacity>
                      }

                      {authorize.map((auth1) => (
                        auth1 === user._id ?
                          <TouchableOpacity
                            key={user._id}
                            style={styles.choose}
                            onPress={() => {
                              RemoveAuth(currentChat._id, user._id)
                              setModalVisible(false)
                            }}>
                            <Text style={styles.text_choose}>Gỡ quyền quản trị viên</Text>
                          </TouchableOpacity> : <View key={Math.random()}></View>
                      ))}

                      <TouchableOpacity
                        style={styles.choose}
                        onPress={() => {
                          RemoveUserCon(currentChat._id, user._id)
                          setModalVisible(false)
                        }}>
                        <Text style={[styles.text_choose, { color: '#FD2828' }]}>Xóa khỏi nhóm</Text>
                      </TouchableOpacity>
                    </View>
                ))}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  centered_view: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: '#00000099',
  },
  modal_cont: {
    width: "100%",
    backgroundColor: '#ffffff',
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  modal_title: {
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  info: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
    padding: 10,
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