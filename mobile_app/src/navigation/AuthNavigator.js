import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen.js';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VerificationScreen from '../screens/VerificationScreen';


const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
	return (
		<Stack.Navigator 
			initialRouteName="LoginScreen" 
			screenOptions={()=>({
				headerShown:false,
				statusBarColor:'#056282',
			})}
		>
			<Stack.Screen name="LoginScreen" component={LoginScreen} />
			<Stack.Screen 
				name="RegisterScreen" 
				component={RegisterScreen} 
				options={()=>({
					headerShown:true,
					headerStyle:{
						backgroundColor:'#056282',
					},
					title:'Đăng ký',
					headerTintColor:'#fff',
					headerTitleStyle:{
						fontSize:17,
					}
				})}/>
			<Stack.Screen 
				name="VerificationScreen" 
				component={VerificationScreen} 
				options={()=>({
					headerShown:true,
					headerStyle:{
						backgroundColor:'#056282',
					},
					title:'Xác thực tài khoản',
					headerTintColor:'#fff',
					headerTitleStyle:{
						fontSize:17,
					}
				})}/>
		</Stack.Navigator>
	)
}
const styles = StyleSheet.create({
  });

export default AuthNavigator;