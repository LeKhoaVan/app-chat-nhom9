import { Alert, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../contexts/AuthContext';
import UserInAdd from '../components/UserInAdd';
import axios from 'axios';
import { Url } from '../contexts/constants';


export default function AddUserScreen({ navigation }) {
    const { userInfo, listUserGroupAddNew, setListUserGroupAddNew, setUserCons,currentChat,setRender} = useContext(AuthContext);
    const [textSearch, setTextSearch] = useState("");
    const [userSearchCon, setUserSearchCon] = useState(null);
    const Add = () => {
        setListUserGroupAddNew([...listUserGroupAddNew, userSearchCon])
        setUserSearchCon(null)
        setTextSearch("")
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
    function AddUserCon(conId) {
        let userId =
          listUserGroupAddNew.map((userGr) => {
            return userGr._id
          })
    
        const article = { conId, userId };
    
        const con = axios.put(`${Url}/api/conversations/addMember`, article)
    
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
        })
      }
    
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
                    <Text style={styles.text_Name}>Thêm vào nhóm</Text>
                    <Text style={styles.active}>Đã chọn:{listUserGroupAddNew.length}</Text>
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
                                userSearchCon.username}
                        </Text>
                        {userSearchCon._id != userInfo._id ?
                            currentChat.members.some((user)=>user == userSearchCon._id)? 
                                <Text>Đã tham gia</Text>:
                                <TouchableOpacity
                                    onPress={() => {
                                        {
                                            listUserGroupAddNew.some((userN) => userN._id == userSearchCon._id) ?
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
                                        {listUserGroupAddNew.some((userN) => userN._id == userSearchCon._id) ? 'Đã thêm' : 'Thêm'}
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
            {listUserGroupAddNew.length > 0 ?
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
                        data={listUserGroupAddNew}
                        renderItem={({ item }) =>
                            <UserInAdd item={item} />} />
                    <TouchableOpacity
                        onPress={() =>{ AddUserCon(currentChat._id) 
                            navigation.navigate('ChattingScreen')
                            setRender(Math.random())
                            }}
                        style={{
                            width: 60,
                            height: 60,
                            backgroundColor: '#056282',
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