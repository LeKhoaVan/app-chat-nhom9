import { ActivityIndicator, Alert, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Url } from '../contexts/constants';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import storage from '../firebase/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function MoreInfo({ navigation }) {
  const { userInfo, currentChat, authorize, setRender,
    setAuthorize, setListUserGroupNew, setListUserGroupAddNew } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImgVisible, setModalImgVisible] = useState(false);
  const [avt, setAvt] = useState(null);
  const [user, SetUser] = useState({});
  const [nameGroup, setNameGroup] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getUser = async () => {
    const friendId = currentChat.members.find((m) => m !== userInfo._id);
    try {
      const res = await axios.get(`${Url}/api/users/name?userId=${friendId}`);
      { res.data.avt === "" ? setAvt("null") : setAvt(res.data.avt) }
      SetUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!currentChat.name)
      getUser();
    else
      setAvt(currentChat.img);
  }, [])
  const handleUpdateName = async () => {
    try {
      const data = {
        id: currentChat._id,
        name: nameGroup
      };
      const res = await axios.put(`${Url}/api/conversations/updateName`, data);
    } catch (err) {
      console.log(err);
    };
  };
  const handleUpdateAvt = async (avt) => {
    try {
      const data = {
        id: currentChat._id,
        img: avt
      };
      const res = await axios.put(`${Url}/api/conversations/updateAvt`, data);
    } catch (err) {
      console.log(err);
    };
  };
  const handleOpenSettings = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
};
  const showImagePicker = async () => {
    // Ask the user for the permission to access the media library 
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
        Alert.alert(
            "Cấp quyền truy cập",
            "Bạn cần cấp quyền cho phép ứng dụng này truy cập vào ảnh của bạn \n\nBấm mở cài đặt, chọn Quyền và bật ON các quyền tương thích",
            [
                {
                    text: 'Hủy',
                },
                {
                    text: 'Mở cài đặt',
                    onPress: () => handleOpenSettings(),
                },
            ], {
            cancelable: true,
        });
        return;
    }
    setModalImgVisible(false);
    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    }
    );

    // Explore the result 
    if (!result.cancelled) {
        // setImage(result.uri);
        // console.log(result.uri);
        handleImageChange(result)

    }
}
const openCamera = async () => {
    // Ask the user for the permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (permissionResult.granted === false) {
        Alert.alert(
            "Cấp quyền truy cập",
            "Bạn cần cấp quyền cho phép ứng dụng này truy cập vào máy ảnh của bạn \n\nBấm mở cài đặt, chọn Quyền và bật ON các quyền tương thích",
            [
                {
                    text: 'Hủy',
                }, {
                    text: 'Mở cài đặt',
                    onPress: () => handleOpenSettings(),
                },
            ], {
            cancelable: true,
        });
        return;
    }
    setModalImgVisible(false);
    const result = await ImagePicker.launchCameraAsync(
        {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,

        }
    );

    // Explore the result
    if (!result.cancelled) {
        // setImage(result.uri);
        // console.log(result.uri);
        handleImageChange(result);

    }
}
//send image
const handleImageChange = async (image) => {
    
    const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            resolve(xhr.response);
        };
        xhr.onerror = function (e) {
            console.log(e);
            reject(new TypeError("Network request failed"));
        };
        xhr.responseType = "blob";
        xhr.open("GET", image.uri, true);
        xhr.send(null);
    });
    setIsLoading(true);
    const fileName = image.uri.slice(image.uri.lastIndexOf('/') + 1, image.uri.lastIndexOf('.')) + "-" + Date.now();
    const imageRef = ref(storage, `/image/${fileName}`);
    uploadBytes(imageRef, blob)
        .then(() => {
            getDownloadURL(imageRef)
                .then(async (url) => {
                    handleUpdateAvt(url)
                    setAvt(url)
                    currentChat.img = url
                    setRender(Math.random())
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error.message, "error getting the image url");
                });
        })
        .catch((error) => {
            console.log(error.message);
        });

};
  return (
    <View style={styles.container}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
          width: '100%',
          paddingHorizontal: 10,
          paddingVertical: 30,

        }}>
        <View>
          {isLoading == true? 
           <View
            style={{
              width: 100,
              height: 100,
              borderRadius:100,
              borderWidth:1,
              borderColor:'#C1C1C1',
              alignItems:'center',
              justifyContent:'center',
            }}>
             <ActivityIndicator size={'small'}/> 
           </View>:
          <Image
            source={{ uri: avt }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
            }} /> }
          {currentChat.name ?
            <TouchableOpacity
              onPress={()=>setModalImgVisible(true)}
              style={{
                position: 'absolute',
                marginTop: 80,
                marginLeft: 80,
                backgroundColor: '#D0D4D3',
                borderRadius: 100,
                padding: 5,
              }}>
              <Ionicons name='camera-outline' size={20} />
            </TouchableOpacity> : <></>}
          <Modal
            visible={modalImgVisible}
            transparent={true}
            onRequestClose={() => setModalImgVisible(false)}
            animationType='fade'
            hardwareAccelerated>
            <TouchableWithoutFeedback onPress={() => setModalImgVisible(false)}>
              <View style={styles.centered_view1} >
                <View style={styles.modal_cont1}>
                  <Text style={styles.modal_title1}>Cập nhật hình đại diện</Text>
                  <View style={styles.modal_body1}>
                    <TouchableOpacity
                      onPress={() =>{
                         openCamera()
                         setModalImgVisible(false)}}
                      style={styles.choose1}>
                      <Ionicons name='camera-outline' size={26} color={'#056282'} />
                      <Text style={styles.text_choose1}>Chụp ảnh mới</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        showImagePicker()
                        setModalImgVisible(false)}}
                      style={styles.choose1}>
                      <Ionicons name='images-outline' size={26} color={'#056282'} />
                      <Text style={styles.text_choose1}>Chọn ảnh từ thiết bị</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 20 }}>
          <Text style={{ fontSize: 23, fontWeight: '500' }}>{currentChat.name ? currentChat.name : user.username}</Text>
          {currentChat.name ?
            <TouchableOpacity
              onPress={() => {
                setModalVisible(true)
                setNameGroup(currentChat.name)
              }}>
              <Ionicons
                name='pencil-sharp' size={16} style={{ backgroundColor: '#DEDEDE', padding: 6, borderRadius: 100, marginLeft: 10 }} />
            </TouchableOpacity> : <></>}
        </View>
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
          animationType='fade'
          hardwareAccelerated>
            <View style={styles.centered_view} >
              <View style={styles.modal_cont}>
                <Text style={styles.modal_title}>Đặt tên nhóm</Text>
                <View style={styles.modal_body}>
                  <TextInput
                    style={{
                      fontSize: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#056282',
                      width: '80%',
                      height: 40,
                    }}
                    onChangeText={(e) => setNameGroup(e)}
                    placeholder='Tên nhóm'
                    value={nameGroup} />
                </View>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-end',
                  padding: 20,

                }}>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}>
                    <Text
                      style={{
                        fontSize: 16
                      }}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      handleUpdateName()
                      setModalVisible(false)
                      currentChat.name = nameGroup
                      setRender(Math.random())
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: '#056282',
                        marginHorizontal: 20,
                      }}>Lưu</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
        </Modal>
        <View style={{ flexDirection: 'row',alignItems:'flex-start',justifyContent:'center' }}>
          <TouchableOpacity
            style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }} >
            <Ionicons
              name='search' size={20} style={{ backgroundColor: '#DEDEDE', padding: 10, borderRadius: 100, width: 40,height:40 }} />
            <Text style={{ fontSize: 14, width: 90, textAlign: 'center' }}>Tìm kiếm tin nhắn</Text>
          </TouchableOpacity>
          {currentChat.name ?
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AddUserScreen')
                setListUserGroupAddNew([])
              }}
              style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }} >
              <Ionicons
                name='person-add-outline' size={20} style={{ backgroundColor: '#DEDEDE', padding: 10, borderRadius: 100, width: 40,height:40 }} />
              <Text style={{ fontSize: 14, width: 90, textAlign: 'center' }}>Thêm thành viên</Text>
            </TouchableOpacity> : <></>}
            {!currentChat.name ?
            <TouchableOpacity
              onPress={() => {
                navigation.navigate({ name: 'UserInfoScreen', params: { user } })
              }}
              style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 }} >
              <Ionicons
                name='person-outline' size={20} style={{ backgroundColor: '#DEDEDE', padding: 10, borderRadius: 100, width: 40,height:40 }} />
              <Text style={{ fontSize: 14, width: 90, textAlign: 'center' }}>Trang cá nhân</Text>
            </TouchableOpacity> : <></>}
          
        </View>

      </View>
      <View
        style={{
          justifyContent: 'flex-start',
          backgroundColor: '#fff',
          width: '100%',
          padding: 15,
          marginTop: 10,
        }} >
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
          <Ionicons
            name='images-outline' size={23} color={'#7E7E7E'} style={{ marginLeft: 10, paddingBottom: 15 }} />
          <Text style={{ fontSize: 16, marginLeft: 15, borderBottomWidth: 1, borderBottomColor: '#DEDEDE', width: '100%', paddingBottom: 15 }}>
            Ảnh, file đã gửi</Text>
        </TouchableOpacity>
        {currentChat.name ?
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}
            onPress={() => navigation.navigate('ManageMember')}>
            <Ionicons
              name='people-outline' size={23} color={'#7E7E7E'} style={{ marginLeft: 10, paddingBottom: 15 }} />
            <Text style={{ fontSize: 16, marginLeft: 15, borderBottomWidth: 1, borderBottomColor: '#DEDEDE', width: '100%', paddingBottom: 15 }}>
              Xem thành viên</Text>
          </TouchableOpacity> : <></>}
        {!currentChat.name ?
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}
            onPress={() => {
              setListUserGroupNew([])
              navigation.navigate('CreateGroup')
              setListUserGroupNew([user])
            }}>
            <AntDesign
              name='addusergroup' size={23} color={'#7E7E7E'} style={{ marginLeft: 10, paddingBottom: 15 }} />
            <Text style={{ fontSize: 16, marginLeft: 15, borderBottomWidth: 1, borderBottomColor: '#DEDEDE', width: '100%', paddingBottom: 15 }}>
              Tạo nhóm với {user.username}</Text>
          </TouchableOpacity> : <></>}
        {!currentChat.name ?
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
            <Ionicons
              name='person-add-outline' size={23} color={'#7E7E7E'} style={{ marginLeft: 10, paddingBottom: 15 }} />
            <Text style={{ fontSize: 16, marginLeft: 15, borderBottomWidth: 1, borderBottomColor: '#DEDEDE', width: '100%', paddingBottom: 15 }}>
              Thêm {user.username} vào nhóm</Text>
          </TouchableOpacity> : <></>}
        {!currentChat.name ?
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
            <Entypo
              name='block' size={23} color={'#7E7E7E'} style={{ marginLeft: 10, paddingBottom: 15 }} />
            <Text style={{ fontSize: 16, marginLeft: 15, borderBottomWidth: 1, borderBottomColor: '#DEDEDE', width: '100%', paddingBottom: 15 }}>
              Chặn tin nhắn</Text>
          </TouchableOpacity> : <></>}
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, }}>
          <Ionicons
            name='trash-outline' size={23} color={'#FD2828'} style={{ marginLeft: 10 }} />
          <Text style={{ fontSize: 16, marginLeft: 15, width: '100%', color: '#FD2828' }}>
            Xóa lịch sử trò chuyện</Text>
        </TouchableOpacity>
        {currentChat.name ?
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, }}
            onPress={() =>
              Alert.alert("Rời nhóm", "Bạn có chắc chắn muốn rời nhóm?",
                [{
                  text: "Không",
                },
                {
                  text: "Rời nhóm",
                  onPress: () => {
                    if (authorize.length == 1 && authorize[0] === userInfo._id) {
                      Alert.alert("Thông báo", "Cần chỉ định thêm quản trị viên trước khi rời nhóm");
                    }
                    else {
                      const article = {
                        conId: currentChat._id,
                        userId: userInfo._id
                      };
                      const con = axios.put(`${Url}/api/conversations/removeMember`, article)
                      setAuthorize([])
                      navigation.navigate('HomeNavigator')
                    }
                  }
                }
                ])}>
            <Ionicons
              name='exit-outline' size={23} color={'#FD2828'} style={{ marginLeft: 10, paddingTop: 15 }} />
            <Text style={{ fontSize: 16, marginLeft: 15, width: '100%', borderTopWidth: 1, borderTopColor: '#DEDEDE', color: '#FD2828', paddingTop: 15 }}>
              Rời nhóm</Text>
          </TouchableOpacity> : <></>}
        {currentChat.name ? authorize.map((auth) => (auth === userInfo._id ?
          <TouchableOpacity key={userInfo._id} style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 10, }}
            onPress={() =>
              Alert.alert("Giải tán nhóm", "Bạn có chắc chắn muốn giải tán nhóm?",
                [{
                  text: "Không",
                },
                {
                  text: "Giải tán nhóm",
                  onPress: () => {
                    const con = axios.delete(`${Url}/api/conversations/deleteCon`, {
                      data: { convId: currentChat._id }
                    })
                    setAuthorize([])
                    navigation.navigate('HomeNavigator')

                  }
                }])
            }>
            <Ionicons
              name='backspace-outline' size={23} color={'#FD2828'} style={{ marginLeft: 10, paddingTop: 15 }} />
            <Text style={{ fontSize: 16, marginLeft: 15, width: '100%', borderTopWidth: 1, borderTopColor: '#DEDEDE', color: '#FD2828', paddingTop: 15 }}>
              Giải tán nhóm</Text>
          </TouchableOpacity> : <View key={Math.random()}></View>))
          : <></>}

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DEDEDE',
  },
  centered_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modal_cont: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  modal_title: {
    borderBottomWidth: 1,
    borderBottomColor: '#D0D4D3',
    padding: 10,
    fontSize: 20,
    fontWeight: '500',
  },
  modal_body: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  },

  //modalImage
  centered_view1: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modal_cont1: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  modal_title1: {
    borderBottomWidth: 1,
    borderBottomColor: '#D0D4D3',
    padding: 10,
    fontSize: 20,
    fontWeight: '500',
  },
  modal_body1: {
    padding: 20,
  },
  choose1: {
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text_choose1: {
    marginLeft: 15,
    fontSize: 16,
  }
})