import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import ContactsScreen from '../screens/ContactsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MeScreen from '../screens/MeScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenStackHeaderSearchBarView } from 'react-native-screens';

const Tab = createBottomTabNavigator();
export default function HomeScreen({navigation}) {
  return (
      <Tab.Navigator
        initialRouteName={"Messages"}
        screenOptions={({ route })=>({
            tabBarIcon:({ focused, size, color }) => {
                let iconName;
                if(route.name ==="Messages"){
                    iconName = focused ? 'message-text' : 'message-text-outline';
                } else if(route.name ==="Contacts"){
                        iconName = focused ? 'contacts' : 'contacts-outline';
                }else
                    if(route.name ==="Me"){
                        iconName = focused ? 'account-wrench' : 'account-wrench-outline';
                }
                size = focused ? size+5 : size+2;
                return <MaterialCommunityIcons name={iconName} size={size} color={color}/>
            },
            tabBarActiveTintColor:'#056282',
            tabBarStyle:{padding:10, height:60},
            headerShown:true,
            headerTitle:()=>{
                let iconHeader ;
                let navName;
                if(route.name ==="Messages"){
                    iconHeader = 'add-outline';
                }
                else if(route.name ==="Contacts"){
                    iconHeader = 'person-add-outline';
                    navName = 'AddFriendScreen';
                }else
                if(route.name ==="Me"){
                    iconHeader = 'ios-pencil';
                    navName = 'SettingScreen';
                }
                return <View style={styles.search_nav}> 
                            <TouchableOpacity 
                                style={styles.search_con}>
                                <Ionicons
                                    name='search-outline'
                                    size={25}
                                    color={'#fff'}/>
                                <Text style={styles.search_text}>Tìm kiếm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={()=>navigation.navigate(navName)}>
                            <Ionicons 
                                name={iconHeader}
                                size={25}
                                color={'#fff'}/>
                            </TouchableOpacity>
                        </View>
            },
            headerStyle:{
                backgroundColor:'#056282',
            }
            })} >
        <Tab.Screen 
            name="Messages" 
            component={MessagesScreen}
        />
        <Tab.Screen 
            name="Contacts" 
            component={ContactsScreen} 
        />
        <Tab.Screen 
            name="Me" 
            component={MeScreen} 
        />
      </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
