import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import { useNavigation } from "@react-navigation/native";
import axios from 'axios';
import { Url } from '../contexts/constants';

export default function FriendReceive({ item }) {
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
                padding: 10,
                borderBottomColor:'#E1E1E1',
                borderBottomWidth:1,
                borderStyle:'dashed'
            }}>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    
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
                        marginLeft: 20,
                    }}>
                    {user.username}</Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    marginTop: 10,
                }}>
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
                        }}>Từ chối</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#41AFA5',
                        padding: 10,
                        width: 100,
                        borderRadius: 10,
                    }}>
                    <Text
                        style={{
                            fontSize: 15,
                            textAlign: 'center',
                            fontWeight: '500',
                        }}>Chấp nhận</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({})