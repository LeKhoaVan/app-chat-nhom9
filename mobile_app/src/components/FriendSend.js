import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { Url } from '../contexts/constants';

export default function FriendSend({ item }) {
    // console.log({item});
    const { userInfo, setAuthorize, setCurrentChat, conversations } = useContext(AuthContext);
    const [user, setUser] = useState({});
    const nav = useNavigation();

    useEffect(() => {
        const getUser = async () => {
            try {
                const res = await axios(`${Url}/api/users?userId=${item}`);
                setUser(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getUser();

    }, [item]);
    return (

        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                padding: 10,

            }}>
            <View>
                <Image
                    source={{ uri: user.avt }}
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 100,
                    }} />
                {user.isActive ?
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
                {user.username}</Text>
            <TouchableOpacity
                style={{
                    backgroundColor: '#E1E1E1',
                    padding: 10,
                    width: 100,
                    borderRadius: 10,
                }}>
                <Text
                    style={{
                        fontSize: 15,
                        textAlign: 'center',
                        fontWeight: '500',
                    }}>Thu hồi</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})