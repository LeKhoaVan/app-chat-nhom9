import { Alert, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useRef, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { AuthContext } from '../contexts/AuthContext'

export default function SettingScreen() {
    const { logout, socket, changePassUser,userInfo } = useContext(AuthContext)
    const [modalVisible, setModalVisible] = useState(false);
    const [visible, setVisible] = useState(true)
    const ref_inputPassword = useRef();
    const ref_inputNewPassword = useRef();
    const ref_inputCfNewPassword = useRef();
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [cfNewPassword, setCfNewPassword] = useState('');
    const [alertt, setAlertt] = useState('');
    const handleUpdatePassword = async () => {
        let changePassW = {
            emailChange: userInfo.email,
            passwordOld: password,
            passwordNew: newPassword,
            cfpassword: cfNewPassword,
        }
        try {
            const changPassData = await changePassUser(changePassW)
            if (!changPassData.success) {
                setAlertt(changPassData.message)
            } else {
                setAlertt('Đổi mật khẩu thành công')
                setTimeout(() => setModalVisible(false), 500)
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <View>
            <TouchableOpacity style={styles.button}
                onPress={() => {
                    setModalVisible(true)
                    setPassword("")
                    setNewPassword("")
                    setCfNewPassword("")
                    setVisible(true)
                    setAlertt("")
                }}>
                <Ionicons
                    name='key-outline'
                    size={25}
                    color='#17D8B7' />
                <Text style={styles.text}>Đổi mật khẩu</Text>
                <Ionicons
                    name='chevron-forward'
                    size={25} />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
                animationType='fade'
                hardwareAccelerated>
                <View style={styles.centered_view} >
                    <View style={styles.modal_cont}>
                        <Text style={styles.modal_title}>Đổi mật khẩu</Text>
                        <View style={styles.modal_body}>

                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '90%',
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5,
                                    borderColor: '#C1C1C1'
                                }}>
                                <TextInput
                                    ref={ref_inputPassword}
                                    style={{
                                        fontSize: 16,

                                    }}
                                    placeholder='Mật khẩu'
                                    value={password}
                                    onChangeText={(value) => setPassword(value)}
                                    secureTextEntry={visible}
                                    onEndEditing={() => ref_inputNewPassword.current.focus()}
                                    onPressIn={() =>
                                        setAlertt('')}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '90%',
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5,
                                    borderColor: '#C1C1C1',
                                    marginTop: 10,
                                }}>
                                <TextInput
                                    ref={ref_inputNewPassword}
                                    style={{
                                        fontSize: 16,
                                        width: '85%'
                                    }}
                                    placeholder='Mật khẩu mới'
                                    value={newPassword}
                                    onChangeText={(value) => setNewPassword(value)}
                                    secureTextEntry={visible}
                                    onSubmitEditing={() => ref_inputNewPassword.current.focus()}
                                    onPressIn={() =>
                                        setAlertt('')}
                                />
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    width: '90%',
                                    borderWidth: 1,
                                    padding: 10,
                                    borderRadius: 5,
                                    borderColor: '#C1C1C1',
                                    marginTop: 10,
                                }}>
                                <TextInput
                                    ref={ref_inputCfNewPassword}
                                    style={{
                                        fontSize: 16,
                                        width: '85%'
                                    }}
                                    placeholder='Nhập lại mật khẩu mới'
                                    value={cfNewPassword}
                                    onChangeText={(value) => setCfNewPassword(value)}
                                    secureTextEntry={visible}
                                    onPressIn={() =>
                                        setAlertt('')}

                                />
                            </View>
                            <Text
                                style={{
                                    fontSize: 17,
                                    marginTop: 10,
                                    color: '#E33333',
                                }}>{alertt}</Text>

                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                            padding: 20,

                        }}>
                            <TouchableOpacity
                                style={{ marginRight: 20, }}
                                onPress={() => {
                                    setVisible(!visible);
                                }}>
                                <Ionicons
                                    name={visible === false ? 'eye-outline' : 'eye-off-outline'}
                                    size={26}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}>
                                <Text
                                    style={{
                                        fontSize: 16
                                    }}>Hủy</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    handleUpdatePassword()
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
            <TouchableOpacity style={styles.button}>
                <MaterialCommunityIcons
                    name='block-helper'
                    size={25}
                    color='#FA1010' />
                <Text style={styles.text}>Danh sách chặn</Text>
                <Ionicons
                    name='chevron-forward'
                    size={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
                <Ionicons
                    name='language'
                    size={25}
                    color='#E572F6' />
                <Text style={styles.text}>Ngôn ngữ</Text>
                <Ionicons
                    name='chevron-forward'
                    size={25} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() =>
                Alert.alert("Thông báo", "Bạn có chắc chắn đăng xuất", [
                    {
                        text: 'Hủy',
                        style: 'cancel',
                    },
                    {
                        text: 'Đăng xuất',
                        onPress: () => {
                            logout()
                            socket.current.emit('onDisconnect')
                        }

                    }
                ])
            }>
                <Ionicons
                    name='md-log-out-outline'
                    size={25}
                    color='#CDCBCD' />
                <Text style={styles.text}>Đăng xuất</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    button: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ECE9E9',
    },
    text: {
        marginRight: 'auto',
        marginLeft: 20,
        fontSize: 17,
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
})