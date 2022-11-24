import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, ActivityIndicator, Keyboard } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import storage from '../firebase/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { Url } from '../contexts/constants';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RadioGroup from 'react-native-radio-buttons-group';
export default function MeScreen() {
  const radioButtonsData = [{
    id: '1',
    label: 'Nam',
    value: 'Nam',
    selected: true,
  }, {
    id: '2',
    label: 'Nữ',
    value: 'Nữ',
    selected: false,
  }]
  const [radioButtons, setRadioButtons] = useState(radioButtonsData)
  const { userInfo, setRender } = useContext(AuthContext);
  const [modalImgVisible, setModalImgVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalGender, setModalGender] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [gender, setGender] = useState('');

  // console.log('UserInfo:',userInfo);
  const Cdate = (date) => {
    let tempDate = new Date(date);
    let fDate = tempDate.getDate() + "/" + (tempDate.getMonth() * 1 + 1) + "/" + tempDate.getFullYear();
    return fDate;
  };
  const checkgender = () => {
    if (userInfo.gender == "Nam") {
      radioButtonsData[0].selected = true;
      radioButtonsData[1].selected = false;
    }
    else {
      radioButtonsData[1].selected = true;
      radioButtonsData[0].selected = false;
    }
  }
  const onPressRadioButton = (radioButtonsArray) => {
    setRadioButtons(radioButtonsArray);
    const result = radioButtons.filter((obj) => { return obj.selected === true });
    const gender_Result = result[0];
    setGender(gender_Result.value);
  }
  const handleUpdateGender = async (gender) => {
    try {
      const data = {
        usersId: userInfo._id,
        gender: gender,
      };
      const res = await axios.put(`${Url}/api/users/` + userInfo._id, data);
    } catch (err) {
      console.log(err);
    };
  };
  const handleUpdateBirthday = async (date) => {
    try {
      const data = {
        usersId: userInfo._id,
        birthday: new Date(date),
      };
      const res = await axios.put(`${Url}/api/users/` + userInfo._id, data);
    } catch (err) {
      console.log(err);
    };
    userInfo.birthday = new Date(date),
      setDatePickerVisibility(false);
  };
  const handleUpdateName = async () => {
    try {
      const data = {
        usersId: userInfo._id,
        username: userName,
      };
      const res = await axios.put(`${Url}/api/users/` + userInfo._id, data);
    } catch (err) {
      console.log(err);
    };
  };
  const handleUpdateAvt = async (avt) => {
    try {
      const data = {
        usersId: userInfo._id,
        avt: avt,
      };
      const res = await axios.put(`${Url}/api/users/` + userInfo._id, data);
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
            userInfo.avt = url
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
      <View>
        {isLoading == true ?
          <View
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: '#C1C1C1',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <ActivityIndicator size={'large'} />
          </View> :
          <Image
            source={{ uri: userInfo.avt }}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              borderWidth: 1,
              borderColor: '#fff'
            }} />}
        <TouchableOpacity
          onPress={() => setModalImgVisible(true)}
          style={{
            position: 'absolute',
            marginTop: 120,
            marginLeft: 120,
            backgroundColor: '#D0D4D3',
            borderRadius: 100,
            padding: 5,
          }}>
          <Ionicons name='camera-outline' size={20} />
        </TouchableOpacity>
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
                    onPress={() => {
                      openCamera()
                      setModalImgVisible(false)
                    }}
                    style={styles.choose1}>
                    <Ionicons name='camera-outline' size={26} color={'#056282'} />
                    <Text style={styles.text_choose1}>Chụp ảnh mới</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      showImagePicker()
                      setModalImgVisible(false)
                    }}
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
      <Text
        style={{marginTop:10}}>Nhấn vào thông tin để chỉnh sửa</Text>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true)
          setUserName(userInfo.username)
        }}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 30,
        }}>
        <Text style={{
          fontSize: 20,
          fontWeight: '500'
        }}>{userInfo.username}</Text>
        <Modal
          visible={modalVisible}
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
          animationType='fade'
          hardwareAccelerated>
          
            <View style={styles.centered_view} >
              <View style={styles.modal_cont}>
                <Text style={styles.modal_title}>Đổi UserName</Text>
                <View style={styles.modal_body}>
                  <TextInput
                    style={{
                      fontSize: 16,
                      borderBottomWidth: 1,
                      borderBottomColor: '#056282',
                      width: '80%',
                      height: 40,
                    }}
                    onChangeText={(e) => setUserName(e)}
                    placeholder='UserName'
                    value={userName} />
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
                      userInfo.username = userName
                      // setRender(Math.random())
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
      </TouchableOpacity>
      <View>
        <Text style={styles.text}>Email: {userInfo.email}</Text>
        <TouchableOpacity
          onPress={() => {
            setDatePickerVisibility(true)
          }}
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text style={{ fontSize: 20 }}>Ngày sinh: {Cdate(userInfo.birthday)}</Text>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleUpdateBirthday}
            onCancel={() => setDatePickerVisibility(false)}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            checkgender()
            setModalGender(true)
          }}
          style={{
            flexDirection: 'row',
            marginTop: 20,
          }}>
          <Text style={{ fontSize: 20 }}>Giới tính: {userInfo.gender}</Text>
          <Modal
            visible={modalGender}
            transparent={true}
            onRequestClose={() => setModalGender(false)}
            animationType='fade'
            hardwareAccelerated>
              <View style={styles.centered_view2} >
                <View style={styles.modal_cont2}>
                  <Text style={styles.modal_title2}>Đổi giới tính</Text>
                  <View style={styles.modal_body2}>
                    <RadioGroup
                      layout='row'
                      radioButtons={radioButtons}
                      onPress={onPressRadioButton}
                    />
                  </View>
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    padding: 20,

                  }}>
                    <TouchableOpacity
                      onPress={() => setModalGender(false)}>
                      <Text
                        style={{
                          fontSize: 16
                        }}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        handleUpdateGender(gender)
                        userInfo.gender = gender
                        setModalGender(false)
                        // setRender(Math.random())
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
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 50,
  },
  text: {
    marginTop: 20,
    fontSize: 20,
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
  },
  //editname
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
  //editGander
  centered_view2: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000099',
  },
  modal_cont2: {
    width: '90%',
    backgroundColor: '#ffffff',
    borderRadius: 5,
  },
  modal_title2: {
    borderBottomWidth: 1,
    borderBottomColor: '#D0D4D3',
    padding: 10,
    fontSize: 20,
    fontWeight: '500',
  },
  modal_body2: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  choose2: {
    height: 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  text_choose2: {
    marginLeft: 15,
    fontSize: 16,
  },
})