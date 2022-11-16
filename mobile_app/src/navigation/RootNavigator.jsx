import React, { useContext, useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChattingScreen from '../screens/ChattingScreen';
import HomeNavigator from './HomeNavigator';
import SettingScreen from '../screens/SettingScreen.js';
import { StyleSheet} from 'react-native';
import AddFriendScreen from '../screens/AddFriendScreen.js';
import MoreInfo from '../screens/MoreInfo';
import {io} from "socket.io-client";
import {UrlSK } from '../contexts/constants'
import { AuthContext} from '../contexts/AuthContext';
import FriendRequest from '../screens/FriendRequest';
import SendFR from '../screens/SendFR';
import ManageMember from '../screens/ManageMember';

const Stack = createNativeStackNavigator();
const RootNavigator = () => {
	const {socket,userInfo} = useContext(AuthContext)
	useEffect(()=>{
		socket.current = io(`${UrlSK}`);
		socket.current.emit("addUser", userInfo._id);
		socket.current.on("getUsers", (users) => {
		  console.log(users)
    	}) 
	},[userInfo._id])
	
	return (
		<Stack.Navigator 
			initialRouteName="HomeNavigator" 
			screenOptions={()=>({
				headerShown:false,
				statusBarColor:'#056282',
			})}
		>
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
			<Stack.Screen 
				name="MoreInfo" 
				component={MoreInfo}
				options={()=>({
					headerShown:true,
					headerStyle:{
						backgroundColor:'#056282',
					},
					title:'Tùy chọn',
					headerTintColor:'#fff',
					headerTitleStyle:{
						fontSize:17,
					}
				})}
			/>
			<Stack.Screen 
				name="ManageMember" 
				component={ManageMember}
				options={()=>({
					headerShown:true,
					headerStyle:{
						backgroundColor:'#056282',
					},
					title:'Quản lý thành viên',
					headerTintColor:'#fff',
					headerTitleStyle:{
						fontSize:17,
					}
				})}
			/>
			<Stack.Screen 
				name="FriendRequest"
				component={FriendRequest} 
				options={()=>({
					headerShown:true,
					headerStyle:{
						backgroundColor:'#056282',
					},
					title:'Lời mời kết bạn',
					headerTintColor:'#fff',
					headerTitleStyle:{
						fontSize:17,
					}
				})}/>
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