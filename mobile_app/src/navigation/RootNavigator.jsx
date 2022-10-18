import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen.js';
import MessagesScreen from '../screens/MessagesScreen.js';
import ChattingScreen from '../screens/ChattingScreen';
import MeScreen from '../screens/MeScreen.js';
import HomeNavigator from './HomeNavigator';
import SettingScreen from '../screens/SettingScreen.js';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AddFriendScreen from '../screens/AddFriendScreen.js';


const Stack = createNativeStackNavigator();
const RootNavigator = () => {
	return (
		<Stack.Navigator 
			initialRouteName="HomeNavigator" 
			screenOptions={()=>({
				headerShown:false,
				statusBarColor:'#056282',
			})}
		>
			<Stack.Screen name="LoginScreen" component={LoginScreen} />
			<Stack.Screen name="HomeNavigator" component={HomeNavigator} />
			<Stack.Screen name="ChattingScreen" component={ChattingScreen}/>
			<Stack.Screen 
				name="SettingScreen" 
				component={SettingScreen}
				options={()=>({
					headerShown:true,
					headerStyle:{
						backgroundColor:'#056282',
					},
					title:'Cài đặt',
					headerTintColor:'#fff',
					headerTitleStyle:{
						fontSize:17,
					}
				})}
			/>
			<Stack.Screen 
				name="AddFriendScreen" 
				component={AddFriendScreen}
				options={()=>({
					headerShown:true,
					headerStyle:{
						backgroundColor:'#056282',
					},
					title:'Thêm bạn',
					headerTintColor:'#fff',
					headerTitleStyle:{
						fontSize:17,
					}
				})}
			/>
		</Stack.Navigator>
	)
}
const styles = StyleSheet.create({
	search_nav:{
	  display:'flex',
	  flexDirection:'row',
	  padding:10,
	  justifyContent:'space-around',
	  alignItems:'center',
	},
	search_con:{
	  display:'flex',
	  flexDirection:'row',
	  justifyContent:'center',
	  alignItems:'center',
	},
	search_text:{
	  color:'#fff',
	  width:300,
	  padding:10,
	},
  });

export default RootNavigator;