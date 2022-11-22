import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';
import UserInCreateGroup from '../components/UserInCreateGroup';
import axios from 'axios';
import { Url } from '../contexts/constants';
import storage from '../firebase/Firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function CreateGroup({ navigation }) {
    const { userInfo, listUserGroupNew, setListUserGroupNew, setCurrentChat, setAuthorize } = useContext(AuthContext);
    const [image, setImage] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [textSearch, setTextSearch] = useState("");
    const [name, setName] = useState("");
    const [userSearchCon, setUserSearchCon] = useState(null);
    const Add = () => {
        setListUserGroupNew([...listUserGroupNew, userSearchCon])
        setUserSearchCon(null)
        setTextSearch("")
    }
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
    const handleOpenSettings = () => {
        if (Platform.OS === 'ios') {
          Linking.openURL('app-settings:');
        } else {
          Linking.openSettings();
        }
    };
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
            handleImageChange(result);

        }
    }
    useEffect(() => {
        const handleTextSearchUser = async () => {
            try {
                const res = await axios.get(`${Url}/api/users/userByMailOrName?email=` + textSearch);
                setUserSearchCon(res.data)
            } catch (err) {
                setUserSearchCon(null)
            }
        }
        handleTextSearchUser();
    }, [textSearch])
    const createNewConvGroup = async () => {

        let listMemberId =
            listUserGroupNew.map((userGr) => {
                return userGr._id
            })
        const conv = ({
            members: [
                userInfo._id, ...listMemberId
            ],
            name: name,
            authorization: userInfo._id,
            img: image == "" ? 'https://cdn-icons-png.flaticon.com/512/1057/1057089.png?w=360' : image
        })
        try {
            const res = await axios.post(`${Url}/api/conversations/newConvGroup`, conv);
            setCurrentChat(res.data);
            setAuthorize(res.data.authorization)
            navigation.navigate('ChattingScreen')
        } catch (err) {
            console.log(err.message);
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
        const fileName = image.uri.slice(image.uri.lastIndexOf('/') + 1, image.uri.lastIndexOf('.')) + "-" + Date.now();
        const imageRef = ref(storage, `/image/${fileName}`);
        uploadBytes(imageRef, blob)
            .then(() => {
                getDownloadURL(imageRef)
                    .then(async (url) => {
                        setImage(url)
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
        <SafeAreaView
            style={{
                flex: 1,
            }}>
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
                    <Text style={styles.text_Name}>Tạo nhóm mới</Text>
                    <Text style={styles.active}>Đã chọn:{listUserGroupNew.length}</Text>
                </View>
            </View>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <View
                    style={{
                        flexDirection: 'row',
                        padding: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>

                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                            width: '20%',
                            height: 70,
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                        {image == "" ?
                            <Ionicons name='camera-outline' size={30} /> :
                            <Image
                                source={{ uri: image }}
                                style={{ width: 60, height: 60, borderRadius: 100 }} />}
                    </TouchableOpacity>

                    <TextInput
                        placeholder='Đặt tên nhóm'
                        value={name}
                        onChangeText={(e) => setName(e)}
                        style={{
                            fontSize: 16,
                            borderBottomWidth: 1,
                            borderBottomColor: '#7E7E7E',
                            width: '75%',
                            height: 50,
                            marginLeft: 10,
                        }} />
                    <Modal
                        visible={modalVisible}
                        transparent={true}
                        onRequestClose={() => setModalVisible(false)}
                        animationType='fade'
                        hardwareAccelerated>
                        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                            <View style={styles.centered_view} >
                                <View style={styles.modal_cont}>
                                    <Text style={styles.modal_title}>Cập nhật hình đại diện</Text>
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
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        backgroundColor: '#C2E1E8',
                        padding: 10,
                        width: '90%',
                        borderRadius: 5,
                    }}>
                    <Ionicons
                        name='search-outline'
                        size={25}
                        color={'#7E7E7E'}
                        style={{ width: '10%' }} />
                    <TextInput
                        placeholder='Tìm kiếm theo email'
                        value={textSearch}
                        onChangeText={(e) => setTextSearch(e)}
                        style={{ fontSize: 16, width: '80%' }} />
                    {textSearch ?
                        <TouchableOpacity
                            style={{ width: '10%' }}
                            onPress={() => setTextSearch("")}>
                            <Ionicons
                                name='close-outline'
                                size={25}
                                color={'#7E7E7E'} />
                        </TouchableOpacity> : <></>}
                </View>
            </View>
            <View
                style={{ flex: 1, padding: 10, }}>
                {userSearchCon ?
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                        <View>
                            <Image
                                source={{ uri: userSearchCon.avt }}
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 100,
                                }} />
                            {userSearchCon.isActive ?
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
                        <Text
                            style={{
                                fontSize: 16,
                                marginRight: 'auto',
                                marginLeft: 10,
                            }}>
                            {userSearchCon._id == userInfo._id ? "Bạn" :
                                userSearchCon.username}</Text>
                        {userSearchCon._id != userInfo._id ?
                            <TouchableOpacity
                                onPress={() => {
                                    {
                                        listUserGroupNew.some((userN) => userN._id == userSearchCon._id) ?
                                            setTextSearch("") : Add()
                                    }

                                }}
                                style={{
                                    backgroundColor: '#056282',
                                    padding: 10,
                                    borderRadius: 5,
                                    width: 80,
                                    alignItems: 'center',
                                }}>
                                <Text
                                    style={{
                                        color: '#fff',
                                    }}>
                                    {listUserGroupNew.some((userN) => userN._id == userSearchCon._id) ? 'Đã thêm' : 'Thêm'}
                                </Text>
                            </TouchableOpacity> :
                            <></>}
                    </View> :
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 16,
                        }}
                    >Không tìm thấy user</Text>}
            </View>
            {listUserGroupNew.length > 0 ?
                <View
                    style={{
                        flexDirection: 'row',
                        borderTopWidth: 2,
                        borderTopColor: '#E0DFDF',
                        padding: 10,
                    }}>
                    <FlatList
                        style={{
                            // backgroundColor:'pink',
                        }}
                        horizontal
                        data={listUserGroupNew}
                        renderItem={({ item }) =>
                            <UserInCreateGroup item={item} />} />
                    <TouchableOpacity
                        onPress={() => listUserGroupNew.length >= 2 && name != "" ? createNewConvGroup() :
                            Alert.alert("Thông báo", "Nhóm phải từ 2 thành viên trở lên \nPhải có tên nhóm")}
                        style={{
                            width: 60,
                            height: 60,
                            backgroundColor: listUserGroupNew.length >= 2 && name != "" ? '#056282' : '#7E7E7E',
                            borderRadius: 100,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginLeft: 10,
                        }}>
                        <Ionicons
                            name='arrow-forward'
                            size={25}
                            color={'#fff'}
                        />
                    </TouchableOpacity>
                </View> :
                <></>}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    Header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#056282',
        padding: 10,
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
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#00000099',
    },
    modal_cont: {
        width: '100%',
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