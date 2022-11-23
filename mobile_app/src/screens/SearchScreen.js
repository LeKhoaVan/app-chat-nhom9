import { FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { AuthContext } from '../contexts/AuthContext';
import { Url } from '../contexts/constants';
import axios from 'axios';
import UserSearch from '../components/UserSearch';
import GroupSearch from '../components/GroupSearch';
export default function SearchScreen({ navigation }) {
    const { userInfo, currentChat, conversations } = useContext(AuthContext);
    const [textSearch, setTextSeach] = useState("")
    const [listSearchGroup, setListSearchGroup] = useState([])
    const [listSearchUser, setListSearchUser] = useState([])
    const [listuser, setListUser] = useState([])
    const [userSearchCon, setUserSearchCon] = useState(null);

    const convert = (string) => {
        if (string != null)
            return string.toString().toLowerCase()
        else return ""
    }
    useEffect(() => {
        const getAllUser = async () => {
            try {
                const res = await axios.get(`${Url}/api/users/getAll`);
                setListUser(res.data)
            } catch (err) {
                setListUser(null)
            }
        }
        getAllUser();
    }, [])
    useEffect(() => {
        const handleTextSearchUser = async () => {
            if (textSearch.trim() != "") {
                try {
                    const res = await axios.get(`${Url}/api/users/userByMailOrName?email=` + textSearch);
                    setUserSearchCon(res.data)
                } catch (err) {
                    setUserSearchCon(null)
                }
                let listG = []
                conversations.forEach((c) => {
                    if (convert(c.name).includes(textSearch.toLocaleLowerCase()) && c.name != null) {
                        listG.push(c)
                    }
                });
                setListSearchGroup(listG)
                let list = []
                listuser.forEach((u) => {
                    if (convert(u.username).includes(textSearch.toLocaleLowerCase())) {
                        if (userInfo._id != u._id)
                            list.push(u)

                    }
                });
                setListSearchUser(list)
            }
        }
        if (textSearch.trim() == "") {
            setListSearchUser([]);
            setListSearchGroup([]);
        }
        handleTextSearchUser();
    }, [textSearch])
    return (
        <View
            style={{
                flex: 1,
            }}>
            <View style={styles.search_nav}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}>
                    <Ionicons
                        name='arrow-back'
                        size={25}
                        color={'#fff'} />
                </TouchableOpacity>
                <View
                    style={{
                        backgroundColor: '#fff',
                        height: 40,
                        borderRadius: 10,
                        width: '85%',
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 10,
                    }}>
                    <Ionicons
                        name='search-outline'
                        size={20}
                        color={'#7E7E7E'}
                        style={{ width: '10%' }} />
                    <TextInput
                        style={{
                            fontSize: 16,
                            width: '80%',
                            height: 40,
                        }}
                        autoFocus={true}
                        value={textSearch}
                        onChangeText={(e) => {
                            // setListSearchUser([]);
                            // setListSearchGroup([]);
                            setTextSeach(e)
                        }}
                        placeholder='Tìm kiếm'
                        placeholderTextColor='#7E7E7E'
                    />
                    {textSearch ?
                        <TouchableOpacity
                            style={{
                                backgroundColor: '#C1C1C1',
                                borderRadius: 100,
                                width: 25,
                                height: 25,
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginLeft: 5,
                            }}
                            onPress={() => {
                                // setListSearchUser([]);
                                // setListSearchGroup([]);
                                setTextSeach("")
                            }}>
                            <Ionicons
                                name='close-outline'
                                size={20}
                                color={'#fff'} />
                        </TouchableOpacity> : <></>}
                </View>

            </View>
            <ScrollView
                style={{
                    padding: 10,
                }}>
                {listSearchGroup.length == 0 && listSearchUser.length == 0 && !userSearchCon ?
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 18,
                            color: '#7E7E7E',
                            marginTop: 100,
                        }}>Không tìm thấy kết quả</Text> : <></>}
                {listSearchUser.length > 0 || userSearchCon ?
                    <Text
                        style={{
                            fontSize: 18,
                        }}>
                        Liên hệ</Text>
                    : <></>}
                {userSearchCon ?
                    <UserSearch item={userSearchCon} /> : <></>}
                {listSearchUser.map((u) => (
                    <UserSearch key={u._id} item={u} />
                ))}
                {listSearchGroup.length > 0 ?
                    <Text
                        style={{
                            fontSize: 18,
                            marginTop: 10,
                        }}>
                        Nhóm</Text>
                    : <></>}
                {listSearchGroup.map((g) => (
                    <GroupSearch key={g._id} item={g} />
                ))}
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    search_nav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#056282',
        padding: 5,

    },
})