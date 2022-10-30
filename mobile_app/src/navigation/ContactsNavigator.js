import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import FriendsScreen from '../screens/FriendsScreen';
import GroupsScreen from '../screens/GroupsScreen';

export default function ContactsNavigator() {
  return (
    <Tab.Navigator>
        <Tab.Screen 
            name='FriendsScreen' 
            component={FriendsScreen}
            options={()=>({
                tabBarLabel:'Bạn bè',
            })}/>
        <Tab.Screen  
            name='GroupsScreen' 
            component={GroupsScreen}
            options={()=>({
                tabBarLabel:'Nhóm',
            })}/>
    </Tab.Navigator>
  )
}

const styles = StyleSheet.create({})