import { Button, Image, KeyboardAvoidingView, PermissionsAndroid, Platform, 
    StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Linking, Modal, 
    TouchableWithoutFeedback} from 'react-native'
import React, { useState } from 'react'
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from 'react-native-vector-icons/Ionicons'
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';

const radioButtonsData = [{
    id: '1',
    label: 'Nam',
    value: 'Nam'
}, {
    id: '2',
    label: 'Nữ',
    value: 'Nữ'
}]
export default function RegisterScreen() {
    const [avatarSource,setAvatarSource] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [radioButtons, setRadioButtons] = useState(radioButtonsData)
    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);
    }
    const [textdate,setTextDate] = useState("Chọn ngày sinh")

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
    const handleConfirm = (date) => {
        let tempDate = new Date(date);
        let fDate =tempDate.getDate()+"/"+tempDate.getMonth()+"/"+tempDate.getFullYear();
        setTextDate(fDate);
        setDatePickerVisibility(false);
    };
    
    const handleOpenSettings = () => {
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
    };
    const [image, setImage] = useState('https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=170667a&w=0&h=kEAA35Eaz8k8A3qAGkuY8OZxpfvn9653gDjQwDHZGPE=');

    const showImagePicker = async () => {
        // Ask the user for the permission to access the media library 
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
        if (permissionResult.granted === false) {
          Alert.alert(
            "Cấp quyền truy cập",
            "Bạn cần cấp quyền cho phép ứng dụng này truy cập vào ảnh của bạn \n\nBấm mở cài đặt, chọn Quyền và bật ON các quyền tương thích",
            [
                {
                    text:'Hủy',
                },
                {
                    text:'Mở cài đặt',
                    onPress:()=>handleOpenSettings(),
                },
            ],{
                cancelable:true,
            });
          return;
        }
        setModalVisible(false);
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
          }
        );
        
        // Explore the result 
        if (!result.cancelled) {
          setImage(result.uri);
          console.log(result.uri);
          
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
                    text:'Hủy',
                },{
                    text:'Mở cài đặt',
                    onPress:()=>handleOpenSettings(),
                },
            ],{
                cancelable:true,
            });
          return;
        }
        setModalVisible(false);
        const result = await ImagePicker.launchCameraAsync(
            {
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
                
              }
        );
    
        // Explore the result
        if (!result.cancelled) {
          setImage(result.uri);
          console.log(result.uri);
          
        }
    }

  return (
    <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <View style={{width:'100%',alignItems:'center'}}>
                <Image 
                    style={styles.avatar}
                    // source={require('../image/avatar.png')}
                    source ={{uri:image}}
                />
                <TouchableOpacity 
                    style={styles.btnChooseImage}
                    onPress={()=>setModalVisible(true)}>
                    <Text style={styles.textChooseImage}>Chọn ảnh đại diện</Text>
                </TouchableOpacity>
                <Modal
                    visible={modalVisible}
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                    animationType='slide'
                    hardwareAccelerated
                >
                    <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                        <View style={styles.centered_view} >
                            <View style={styles.modal_cont}>
                                <Text style={styles.modal_title}>Tải lên hình ảnh</Text>
                                <View style={styles.modal_body}>
                                    <TouchableOpacity
                                        onPress={() => openCamera()}
                                        style={styles.choose}>
                                        <Ionicons name='camera-outline' size={26} color={'#056282'}/>
                                        <Text style={styles.text_choose}>Chụp ảnh mới</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => showImagePicker()}
                                        style={styles.choose}>
                                        <Ionicons name='images-outline' size={26} color={'#056282'}/>
                                        <Text style={styles.text_choose}>Chọn ảnh từ thiết bị</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => setModalVisible(false)}
                                        style={styles.choose}>
                                        <Ionicons name='close-circle-outline' size={26} color={'#056282'}/>
                                        <Text style={styles.text_choose}>Hủy</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
                <View style={styles.input_cont}>
                    <Ionicons name='mail-outline' size={25} style={styles.icon}/>
                    <TextInput
                        style={styles.input}
                        placeholder='Email'/>
                </View>
                <View style={styles.input_cont}>
                    <Ionicons name='lock-closed-outline' size={25} style={styles.icon}/>
                    <TextInput
                        style={styles.input}
                        placeholder='Mật khẩu'/>
                </View>
                <View style={styles.input_cont}>
                    <Ionicons name='lock-closed-outline' size={25} style={styles.icon}/>
                    <TextInput
                        style={styles.input}
                        placeholder='Nhập lại mật khẩu'/>
                </View>
                <View style={styles.input_cont}>
                    <Ionicons name='person-outline' size={25} style={styles.icon}/>
                    <TextInput
                        style={styles.input}
                        placeholder='User name'/>
                </View>
                
                <TouchableOpacity
                    style={styles.input_cont}
                    onPress={()=>setDatePickerVisibility(true)}>
                    <Ionicons name='calendar-outline' size={25} style={styles.icon}/>
                    <Text style={{fontSize:16}}>{textdate}</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    onCancel={()=>setDatePickerVisibility(false)}
                />
                <View style={styles.GT}>
                    <Text style={{fontSize:16,marginRight:50}}>Giới tính:</Text>
                    <RadioGroup
                        layout='row'
                        radioButtons={radioButtons}
                        onPress={onPressRadioButton}
                    />
                </View>
                <TouchableOpacity 
                    style={styles.btnRegister}>
                    <Text style={{fontSize:16,color:'#fff'}}>Đăng ký</Text>
                </TouchableOpacity>

            </View>
        </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:'center',
    },
    avatar:{
        marginTop:-35,
        width:150,
        height:150,
        borderRadius:100,
    },
    btnChooseImage:{
        borderWidth:1,
        borderColor:'#D0D4D3',
        borderRadius:100,
        padding:10,
        marginTop:10,
        marginBottom:30,
    },
    textChooseImage:{
        fontSize:16,
    },
    input_cont:{
        width:'90%',
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'#D0D4D3',
        paddingVertical:10,
    },
    input:{
        fontSize:16,
        width:'90%',
    },
    GT:{
        flexDirection:'row',
        justifyContent:'flex-start',
        alignItems:'center',
        width:'90%',
        marginTop:10,
    },
    btnRegister:{
        width:'90%',
        backgroundColor:'#056282',
        alignItems:'center',
        justifyContent:'center',
        height:50,
        borderRadius:20,
        marginTop:20,
    },
    icon:{
        marginRight:10,
    },
    centered_view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#00000099',
      },
      modal_cont: {
        width: 300,
        backgroundColor: '#ffffff',
        borderRadius: 5,
      },
      modal_title: {
        borderBottomWidth:1,
        borderBottomColor:'#D0D4D3',
        padding:10,
        fontSize:20,
        fontWeight:'500',
      },
      modal_body:{
        padding:20,
      },
      choose:{
        height:50,
        justifyContent:'flex-start',
        alignItems:'center',
        flexDirection:'row',
      },
      text_choose:{
            marginLeft:15,
            fontSize:16,
      }
      
})