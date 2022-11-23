import { Button, Image, KeyboardAvoidingView, PermissionsAndroid, Platform, 
    StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Linking, Modal, 
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    ActivityIndicator} from 'react-native'
import React, { useContext, useState } from 'react'
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
    const radioButtonsData = [{
        id: '1',
        label: 'Nam',
        value: 'Nam',
        selected:false,
    }, {
        id: '2',
        label: 'Nữ',
        value: 'Nữ',
        selected:false,
    }]

    const [show,setShow] = useState(false)
    const [visible,setVisible] = useState(true)
    const [avatarSource,setAvatarSource] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [radioButtons, setRadioButtons] = useState(radioButtonsData)
    const [alert, setAlert] = useState('');
    const {register,loadUser_Register,setUserToken} = useContext(AuthContext)
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [cfpassword,SetCfpassword] = useState('');
    const [username,setUsername] = useState('');
    const [birthday,setBirthday] = useState('');
    const [gender,setGender] = useState('');
    const [isRegisterSuccess,setIsRegisterSuccess] = useState(false);

    // const ref_inputEmail = useRef();
    // const ref_inputPassword = useRef();
    // const ref_inputcfPassword = useRef();
    // const ref_inputUsername = useRef();
    // const ref_inputBirthday = useRef();
    // const ref_btnRegister = useRef();
    

    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);
        const result =radioButtons.filter((obj)=>{return obj.selected===true});
        const gender_Result = result[0];
        setGender(gender_Result.value)
    }
    const [textdate,setTextDate] = useState("Chọn ngày sinh")

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  
    const handleConfirm = (date) => {
        let tempDate = new Date(date);
        let fDate =tempDate.getDate()+"/"+(tempDate.getMonth()*1+1)+"/"+tempDate.getFullYear();
        setTextDate(fDate);
        setBirthday(tempDate);
        setDatePickerVisibility(false);
    };
    
    const handleOpenSettings = () => {
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
    };
    const [image, setImage] = useState('https://firebasestorage.googleapis.com/v0/b/chatapp-group9.appspot.com/o/avatar.png?alt=media&token=f69725be-13aa-4746-9d6c-39fa0f7d2910');

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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    const register_onpress = async () => {
        if(password === cfpassword){
            try {
                const registerData = await register({emailRe:email,passwordRe:password,cfpassword:cfpassword,username:username,birthday:birthday,gender:gender})
                console.log(registerData);
                if (!registerData.success) {
                    setAlert(registerData.message )
                    setTimeout(() => setAlert(null), 5000)
                }else{
                    
                    setAlert( "Thành công đăng ký tài khoản" )
                    setIsRegisterSuccess(true);
                    setTimeout(()=>{
                        setUserToken(registerData.accessToken);
                        AsyncStorage.setItem('userToken',registerData.accessToken);
                        loadUser_Register() ;
                        setAlert(null)
                        setIsRegisterSuccess(false)

                    },2000)
                }
            } catch (error) {
                console.log(error)
            }
        }
        else{
            setAlert("Mật khẩu không khớp")
            setTimeout(() => setAlert(null), 5000)
        }    
    }

  return (
    <View style={styles.container}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>   
        <ScrollView>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{width:'100%',alignItems:'center',}}>
                    <Image 
                        style={styles.avatar}
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
                        animationType='fade'
                        hardwareAccelerated>
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
                        <Ionicons name='mail-outline' size={25} color={'#056282'} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            onChangeText={(value)=>setEmail(value)}/>
                    </View>
                    <View style={styles.input_cont}>
                        <Ionicons name='lock-closed-outline' size={25} color={'#056282'} style={styles.icon}/>
                        <TextInput
                            style={styles.input_pass}
                            placeholder='Mật khẩu'
                            secureTextEntry={visible}
                            onChangeText={(value)=>setPassword(value)}/>
                        <TouchableOpacity
                            style={{width:'10%'}}
                            onPress={()=>{
                            setShow(!show);
                            setVisible(!visible);
                            }}>
                            <Ionicons
                                name={show === false ? 'eye-outline':'eye-off-outline'}
                                size={26}
                                />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.input_cont}>
                        <Ionicons name='lock-closed-outline' size={25} color={'#056282'} style={styles.icon}/>
                        <TextInput
                            style={styles.input_pass}
                            placeholder='Nhập lại mật khẩu'
                            secureTextEntry={visible}
                            onChangeText={(value)=>SetCfpassword(value)}/>
                        <TouchableOpacity
                            style={{width:'10%'}}
                            onPress={()=>{
                            setShow(!show);
                            setVisible(!visible);
                            }}>
                            <Ionicons
                                name={show === false ? 'eye-outline':'eye-off-outline'}
                                size={26}
                                />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.input_cont}>
                        <Ionicons name='person-outline' size={25}  color={'#056282'} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder='User name'
                            onChangeText={(value)=>setUsername(value)}/>
                    </View>
                    <TouchableOpacity
                        style={styles.input_cont}
                        onPress={()=>setDatePickerVisibility(true)}>
                        <Ionicons name='calendar-outline' size={25} color={'#056282'} style={styles.icon}/>
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
                    <Text style={{color:'#F15151',fontSize:16, marginTop:10,}}>{alert}</Text>
                    <TouchableOpacity 
                        style={styles.btnRegister}
                        onPress={()=>{
                            console.log(email,password,cfpassword,username,birthday,gender);
                            register_onpress();
                        }}>
                        {isRegisterSuccess ?(
                            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                                <Text style={{fontSize:16,color:'#fff'}}>Đăng nhập..</Text>
                                <ActivityIndicator  size={'large'}/>
                            </View>
                        ):(
                        
                            <Text style={{fontSize:16,color:'#fff'}}>Đăng ký</Text>
                        )}
                        
                        
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </ScrollView>
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
        marginTop:20,
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
        marginBottom:20,
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
    input_pass:{
        fontSize:16,
        width:'80%',
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
        marginTop:10,
        marginBottom:20,
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