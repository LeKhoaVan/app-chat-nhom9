import {
    Button, Image, KeyboardAvoidingView, PermissionsAndroid, Platform,
    StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Linking, Modal,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    ActivityIndicator
} from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import RadioGroup from 'react-native-radio-buttons-group';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../firebase/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function RegisterScreen({ navigation }) {
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

    const [visible, setVisible] = useState(true)
    const [avatarSource, setAvatarSource] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [radioButtons, setRadioButtons] = useState(radioButtonsData)
    const [alert, setAlert] = useState('');
    const { register } = useContext(AuthContext)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cfpassword, SetCfpassword] = useState('');
    const [username, setUsername] = useState('');
    const [birthday, setBirthday] = useState('');
    const [gender, setGender] = useState('Nam');
    const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const ref_inputEmail = useRef();
    const ref_inputPassword = useRef();
    const ref_inputcfPassword = useRef();
    const ref_inputUsername = useRef();

    // const ref_inputEmail = useRef();
    // const ref_inputPassword = useRef();
    // const ref_inputcfPassword = useRef();
    // const ref_inputUsername = useRef();
    // const ref_inputBirthday = useRef();
    // const ref_btnRegister = useRef();


    function onPressRadioButton(radioButtonsArray) {
        setRadioButtons(radioButtonsArray);
        const result = radioButtons.filter((obj) => { return obj.selected === true });
        const gender_Result = result[0];
        setGender(gender_Result.value)
    }
    const [textdate, setTextDate] = useState("Chọn ngày sinh")

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    const handleConfirm = (date) => {
        let tempDate = new Date(date);
        let fDate = tempDate.getDate() + "/" + (tempDate.getMonth() * 1 + 1) + "/" + tempDate.getFullYear();
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
    const [image, setImage] = useState('data:image/png;base64,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');

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
            // setImage(result.uri);
            // console.log(result.uri);
            handleImageChange(result)

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
                        setImage(url)
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


    const register_onpress = async () => {
        if (password === cfpassword) {
            try {
                setAlert("Xác thực tài khoản")
                setIsRegisterSuccess(true);
                const registerData = await register({ emailRe: email, passwordRe: password, cfpassword: cfpassword, avt: image, username: username, birthday: birthday, gender: gender })
                if (registerData.success) {
                    setTimeout(() => {
                        setAlert(null)
                        setIsRegisterSuccess(false)
                        navigation.navigate({ name: 'VerificationScreen', params: email })
                    }, 500)
                } else {
                    setAlert(registerData.message)
                    setIsRegisterSuccess(false)
                    setTimeout(() => setAlert(null), 5000)
                }
            } catch (error) {
                console.log(error)
            }
        }
        else {
            setAlert("Mật khẩu không khớp")
            setTimeout(() => setAlert(null), 5000)
        }
    }

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ width: '100%', alignItems: 'center', }}>
                            {isLoading ?
                                <View
                                    style={{
                                        marginTop: 20,
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
                                    style={styles.avatar}
                                    source={{ uri: image }}
                                />}
                            <TouchableOpacity
                                style={styles.btnChooseImage}
                                onPress={() => setModalVisible(true)}>
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
                                                    <Ionicons name='camera-outline' size={26} color={'#056282'} />
                                                    <Text style={styles.text_choose}>Chụp ảnh mới</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => showImagePicker()}
                                                    style={styles.choose}>
                                                    <Ionicons name='images-outline' size={26} color={'#056282'} />
                                                    <Text style={styles.text_choose}>Chọn ảnh từ thiết bị</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => setModalVisible(false)}
                                                    style={styles.choose}>
                                                    <Ionicons name='close-circle-outline' size={26} color={'#056282'} />
                                                    <Text style={styles.text_choose}>Hủy</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </Modal>
                            <Text style={{ color: '#F15151', fontSize: 16, }}>{alert}</Text>
                            <View style={styles.input_cont}>
                                <Ionicons name='mail-outline' size={25} color={'#056282'} style={styles.icon} />
                                <TextInput
                                    ref={ref_inputEmail}
                                    style={styles.input}
                                    placeholder='Email'
                                    keyboardType='email-address'
                                    onChangeText={(value) => setEmail(value)}
                                    onPressIn={() =>
                                        setTimeout(() => setAlert(''), 1000)}
                                    onSubmitEditing={() => ref_inputPassword.current.focus()}
                                    onBlur={() => {
                                        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
                                        if (reg.test(email) === false) {
                                            setAlert("Định dạng email không đúng")
                                            ref_inputEmail.current.focus()
                                            setTimeout(() => setAlert(''), 5000)
                                        }
                                    }} />
                            </View>
                            <View style={styles.input_cont}>
                                <Ionicons name='lock-closed-outline' size={25} color={'#056282'} style={styles.icon} />
                                <TextInput
                                    ref={ref_inputPassword}
                                    style={styles.input_pass}
                                    placeholder='Mật khẩu'
                                    secureTextEntry={visible}
                                    onChangeText={(value) => setPassword(value)} 
                                    onSubmitEditing={() => ref_inputcfPassword.current.focus()}/>
                                <TouchableOpacity
                                    style={{ width: '10%' }}
                                    onPress={() => {
                                        setVisible(!visible);
                                    }}>
                                    <Ionicons
                                        name={visible === false ? 'eye-outline' : 'eye-off-outline'}
                                        size={26}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.input_cont}>
                                <Ionicons name='lock-closed-outline' size={25} color={'#056282'} style={styles.icon} />
                                <TextInput
                                    ref={ref_inputcfPassword}
                                    style={styles.input_pass}
                                    placeholder='Nhập lại mật khẩu'
                                    secureTextEntry={visible}
                                    onChangeText={(value) => SetCfpassword(value)} 
                                    onSubmitEditing={() => ref_inputUsername.current.focus()}/>
                                <TouchableOpacity
                                    style={{ width: '10%' }}
                                    onPress={() => {
                                        setVisible(!visible);
                                    }}>
                                    <Ionicons
                                        name={visible === false ? 'eye-outline' : 'eye-off-outline'}
                                        size={26}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.input_cont}>
                                <Ionicons name='person-outline' size={25} color={'#056282'} style={styles.icon} />
                                <TextInput
                                    ref={ref_inputUsername}
                                    style={styles.input}
                                    placeholder='User name'
                                    onChangeText={(value) => setUsername(value)} />
                            </View>
                            <TouchableOpacity
                                style={styles.input_cont}
                                onPress={() => setDatePickerVisibility(true)}>
                                <Ionicons name='calendar-outline' size={25} color={'#056282'} style={styles.icon} />
                                <Text style={{ fontSize: 16 }}>{textdate}</Text>
                            </TouchableOpacity>
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={handleConfirm}
                                onCancel={() => setDatePickerVisibility(false)}
                            />
                            <View style={styles.GT}>
                                <Text style={{ fontSize: 16, marginRight: 50 }}>Giới tính:</Text>
                                <RadioGroup
                                    layout='row'
                                    radioButtons={radioButtons}
                                    onPress={onPressRadioButton}
                                />
                            </View>
                            <TouchableOpacity
                                style={styles.btnRegister}
                                onPress={() => {
                                    register_onpress();
                                }}>
                                {isRegisterSuccess ?
                                    <ActivityIndicator size={'large'} /> :
                                    <Text style={{ fontSize: 16, color: '#fff' }}>Đăng ký</Text>}
                            </TouchableOpacity>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    avatar: {
        marginTop: 20,
        width: 150,
        height: 150,
        borderRadius: 100,
    },
    btnChooseImage: {
        borderWidth: 1,
        borderColor: '#D0D4D3',
        borderRadius: 100,
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
    },
    textChooseImage: {
        fontSize: 16,
    },
    input_cont: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#D0D4D3',
        paddingVertical: 10,
    },
    input: {
        fontSize: 16,
        width: '90%',
    },
    input_pass: {
        fontSize: 16,
        width: '80%',
    },
    GT: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '90%',
        marginTop: 10,
    },
    btnRegister: {
        width: '90%',
        backgroundColor: '#056282',
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        borderRadius: 20,
        marginTop: 10,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
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