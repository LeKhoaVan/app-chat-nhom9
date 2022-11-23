import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { Url } from '../contexts/constants';

export default function UserSearch({ item }) {
    // console.log({item});
    const { userInfo, setAuthorize, setCurrentChat, conversations } = useContext(AuthContext);
    const nav = useNavigation();
    async function handleChatOne(senderId, receiverId) {
        let conv
        let checkCon = false
        conversations.forEach((c) => {
            if (c.members.length == 2 && c.authorization.length == 0) {
                if (c.members.some((member) => (member == senderId))) {
                    if (c.members.some((member) => (member == receiverId))) {
                        checkCon = true
                        conv = c
                    }
                }

            }
        })
        if (checkCon) {
            setCurrentChat(conv);
            setAuthorize(conv.authorization)
            nav.navigate('ChattingScreen')
        }
        else {
            const args = { senderId, receiverId }
            try {
                const res = await axios.post(`${Url}/api/conversations`, args);

                //const con = await axios.get("http://localhost:8800/api/conversations/" + _id);
                //setConversation(con.data);
                setCurrentChat(res.data);
                setAuthorize(res.data.authorization)
                nav.navigate('ChattingScreen')
            } catch (err) {
                console.log(err)
            }

        }
    }
    return (
        <TouchableOpacity
            onPress={() => {
                userInfo._id != item._id ?
                    handleChatOne(userInfo._id, item._id) :
                    console.log("Đây là tài email của bạn")
            }}
            style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                padding: 10,
            }}>
            <View>
                <Image
                    source={{ uri: item.avt }}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                    }} />
                {item.isActive ?
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
                    borderBottomWidth: 1,
                    borderBottomColor: '#EBE8E8',
                    width: '100%',
                    padding: 20,
                }}>
                {userInfo._id == item._id ? 'Bạn' : item.username}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({})