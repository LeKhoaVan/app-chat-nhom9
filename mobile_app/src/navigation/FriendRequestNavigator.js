import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import SendFR from '../screens/SendFR';
import ReceiveFR from '../screens/ReceiveFR';

export default function FriendRequestNavigator() {
  return (
    <Tab.Navigator>
        <Tab.Screen 
            name='ReceiveFR' 
            component={ReceiveFR}
            options={()=>({
                tabBarLabel:'Đã nhận',
            })}/>
        <Tab.Screen  
            name='SendFR' 
            component={SendFR}
            options={()=>({
                tabBarLabel:'Đã gửi',
            })}/>
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})