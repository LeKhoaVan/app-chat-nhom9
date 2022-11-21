import { Dimensions, Image, Modal, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { Url } from '../contexts/constants';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../contexts/AuthContext';
import { Audio, Video } from 'expo-av';
import  moment from 'moment';
import 'moment/locale/vi';
// import { downloadToFolder } from "expo-file-dl";

const Messager = ({ message, own, onClickDeleteMgsUser, onClickDeleteMgsFri, onClickDelete }) => {
  // const [user, setUser] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { userInfo } = useContext(AuthContext);

  // const downloadFile= async(url)=>{
  //   await downloadToFolder(
  //     url,
  //     'd.jpg',
  //     'Download',
  //     channelId,{}
  //     );
  // }

  // useEffect(() => {
  //   const getUser = async () => {
  //     try {
  //       const res = await axios(`${Url}/api/users/name?userId=${message.sender}`); 
  //       setUser(res.data);
  //     } catch (err) {
  //       console.log(err); 
  //     }
  //   };
  //   getUser();
  // }, [message]);
  const handleDeleteMessage = async () => {
    try {
      const res = await axios.put(`${Url}/api/messages/recall`, { "id": message._id });
      console.log(res.data);
      message.text = "tin nhắn đã được thu hồi"
      message.reCall = true
      message.type = 0
      onClickDelete(message._id);
      (message._id);
    } catch (err) {
      console.log(err);
    };
  };

  const handleDeleteMgsUser = async () => {
    try {
      const data = {
        id: message._id,
        delUser: userInfo._id,
      };

      const res = await axios.put(`${Url}/api/messages/del`, data);
      console.log(res.data);
      onClickDeleteMgsUser(message._id);
    } catch (err) {
      console.log(err);
    };
  };

  const handleDeleteMgsFri = async () => {
    try {
      const data = {
        id: message._id,
        delUser: userInfo._id,
      };

      await axios.put(`${Url}/api/messages/del`, data);
      message.delUser = "OneNexius209"
      onClickDeleteMgsFri("OneNexius209");
      console.log(message._id)
    } catch (err) {
      console.log(err);
    };
  };

  return (

    <View style={[{
      display: 'flex',
      flexDirection: 'row',
      marginHorizontal: 10,
      marginVertical: 5,
      justifyContent: 'flex-start',
      alignItems: 'flex-start'
    }, own ? styles.me_c : styles.notMe_co]}>
      {!own ?
        <Image
          source={{ uri: message?.avt }}
          style={{
            width: 40,
            height: 40,
            marginRight: 5,
            borderRadius: 100,
          }} /> : <></>}
      <TouchableOpacity style={[
        styles.container, own ? styles.me_container : styles.notMe_container]}
        onLongPress={() => setModalVisible(true)}>
        {message.type == 0 ?
          <Text style={[styles.text, { color: own ? '#fff' : '#000' }]}>{message.text}</Text> : <></>}
        {message.type == 1 ?
          <Image source={{ uri: message.text }}
            style={{ width: 200, height: 300 }}
            resizeMode={'contain'} /> : <></>}
        {message.type == 2 ?
          <Video
            source={{ uri: message.text }}
            style={{ width: 200, height: 300 }}
            resizeMode={'contain'}
            isLooping
            useNativeControls />
          : <></>}
        <Text style={{ color: '#939393', fontSize: 13 }}>{moment(message.createdAt).fromNow()}</Text>
      </TouchableOpacity>
      <Modal
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
        animationType='fade'
        hardwareAccelerated>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={[styles.centered_view, { alignItems: !own ? 'flex-start' : 'flex-end' }]} >
            <View style={styles.modal_cont_mess}>
              <View style={[{
                display: 'flex',
                flexDirection: 'row',
                marginVertical: 5,
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
              }, own ? styles.me_c : styles.notMe_co]}>
                {!own ?
                  <Image
                    source={{ uri: message?.avt }}
                    style={{
                      width: 40,
                      height: 40,
                      marginRight: 5,
                      borderRadius: 100,
                    }} /> : <></>}
                <TouchableOpacity style={[
                  styles.container, own ? styles.me_container : styles.notMe_container]}
                  onLongPress={() => setModalVisible(true)}>
                  {message.type == 0 ?
                    <Text style={[styles.text, { color: own ? '#fff' : '#000' }]}>{message.text}</Text> : <></>}
                  {message.type == 1 ?
                    <Image source={{ uri: message.text }}
                      style={{ width: 200, height: 300 }}
                      resizeMode={'contain'} /> : <></>}
                  {message.type == 2 ?
                    <Video
                      source={{ uri: message.text }}
                      style={{ width: 200, height: 300 }}
                      resizeMode={'contain'}
                      isLooping
                      useNativeControls />
                    : <></>}
                  <Text style={{ color: '#939393', fontSize: 13 }}>{moment(message.createdAt).fromNow()}</Text>
                </TouchableOpacity>
              </View>

            </View>
            <View style={styles.modal_cont_cs}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity>
                  <Text style={{ fontSize: 30 }}>❤️</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={{ fontSize: 30 }}>👍</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={{ fontSize: 30 }}>😆</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={{ fontSize: 30 }}>😮</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={{ fontSize: 30 }}>😢</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={{ fontSize: 30 }}>😠</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.modal_cont}>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => setModalVisible(false)}>
                <Ionicons name='arrow-undo-outline' size={30} color={'#C954EE'} />
                <Text>Trả lời</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ alignItems: 'center' }}
                onPress={() => {
                  setModalVisible(false)
                  { own ? handleDeleteMgsUser() : handleDeleteMgsFri() }
                }}>
                <Ionicons name='trash-outline' size={30} color={'#FE5755'} />
                <Text>Xóa</Text>
              </TouchableOpacity>
              {own ? message.reCall === false ?
                <TouchableOpacity
                  style={{ alignItems: 'center' }}
                  onPress={() => {
                    setModalVisible(false)
                    handleDeleteMessage()
                  }}>
                  <Ionicons name='refresh' size={30} color={'#FD9B73'} />
                  <Text>Thu hồi</Text>
                </TouchableOpacity> : <></> : <></>}
              {message.type != 0 ?
                <TouchableOpacity
                  style={{ alignItems: 'center' }}
                  onPress={() => {
                    setModalVisible(false)
                    // downloadFile(message.text)
                  }}>
                  <Ionicons name='download-outline' size={30} color={'#3FE293'} />
                  <Text>Tải xuống</Text>
                </TouchableOpacity> : <></>}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>


  )
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  me_container: {
    backgroundColor: '#056282',

  },
  me_c: {
    marginLeft: 'auto',
  },
  notMe_container: {
    backgroundColor: '#A5EBFF',

  },
  notMe_co: {
    marginRight: 'auto',
  },
  text: {
    fontSize: 16,
  },
  //Modal
  centered_view: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
    backgroundColor: '#00000099',
  },
  modal_cont: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  modal_cont_mess: {
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  modal_cont_cs: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
  },
  modal_title: {
    borderBottomWidth: 1,
    borderBottomColor: '#D0D4D3',
    padding: 10,
    fontSize: 20,
    fontWeight: '500',
  },
  modal_body: {
    padding: 20,
  },
  choose: {
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text_choose: {
    marginLeft: 15,
    fontSize: 16,
  }
})
export default Messager;