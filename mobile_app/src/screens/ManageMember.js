import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Url } from '../contexts/constants';
import UserInGroup from '../components/UserInGroup';

export default function ManageMember() {
    const {userInfo,currentChat,userCons, setUserCons} = useContext(AuthContext);
    useEffect(() => {
      const getUserCon = async () => {
        let list = [];
        for (let index = 0; index < currentChat?.members.length; index++) {
          try {
            const res = await axios.get(`${Url}/api/users?userId=`+ currentChat?.members[index]); 
            list.push(res.data)
          } catch (err) {
            console.log(err);
          }
          
        }
        setUserCons(list);
      };
      getUserCon();
    },[currentChat]);
  return (
    <View>
       {userCons.map( (user)=>(
        <UserInGroup key={user._id} user={user} />
       ))}
    </View>
  )
}

const styles = StyleSheet.create({})