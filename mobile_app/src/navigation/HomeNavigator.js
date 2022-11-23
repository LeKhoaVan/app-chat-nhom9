import React, { useContext, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, Modal, TouchableWithoutFeedback } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import ContactsScreen from '../screens/ContactsScreen';
import MessagesScreen from '../screens/MessagesScreen';
import MeScreen from '../screens/MeScreen';
import { AuthContext } from '../contexts/AuthContext';

const Tab = createBottomTabNavigator();
export default function HomeScreen({ navigation }) {
    const [modalVisible, setModalVisible] = useState(false);
    const { setListUserGroupNew } = useContext(AuthContext);
    return (
        <Tab.Navigator
            initialRouteName={"Messages"}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, size, color }) => {
                    let iconName;
                    if (route.name === "Messages") {
                        iconName = focused ? require('../image/chat.png') : require('../image/chat_outline.png');
                    } else if (route.name === "Contacts") {
                        iconName = focused ? require('../image/contact.png') : require('../image/contact_outline.png');
                    } else
                        if (route.name === "Me") {
                            iconName = focused ? require('../image/user.png') : require('../image/user_outline.png');
                        }
                    size = focused ? size + 5 : size + 2;
                    // return <MaterialCommunityIcons name={iconName} size={size} color={color}/>
                    return <Image source={iconName} style={{ width: 30, height: 30 }} />
                },
                tabBarStyle: { padding: 10, height: 60, },
                tabBarLabelStyle: { fontSize: 15 },
                tabBarActiveTintColor: '#056282',
                headerShown: true,
                headerTitle: () => {
                    let iconHeader;
                    let navName;
                    if (route.name === "Messages") {
                        iconHeader = 'add';
                        navName = 'add';
                    }
                    else if (route.name === "Contacts") {
                        iconHeader = 'person-add';
                        navName = 'AddFriendScreen';
                    } else
                        if (route.name === "Me") {
                            iconHeader = 'settings';
                            navName = 'SettingScreen';
                        }
                    return <View style={styles.search_nav}>
                        <TouchableOpacity
                            onPress={()=>navigation.navigate('SearchScreen')}
                            style={styles.search_con}>
                            <Ionicons
                                name='search-outline'
                                size={25}
                                color={'#fff'} />
                            <Text style={styles.search_text}>Tìm kiếm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                navName != 'add' ?
                                navigation.navigate(navName) :
                                setModalVisible(true)
                            }}>
                            <MaterialIcons
                                name={iconHeader}
                                size={25}
                                color={'#fff'} />
                        </TouchableOpacity>
                        <Modal
                            visible={modalVisible}
                            transparent={true}
                            onRequestClose={() => setModalVisible(false)}
                            animationType='fade'
                            hardwareAccelerated>
                            <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                                <View style={styles.centered_view} >
                                    <View style={styles.modal_cont}>
                                        <View style={styles.modal_body}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('AddFriendScreen')
                                                    setModalVisible(false)
                                                }}
                                                style={styles.choose}>
                                                <Ionicons name='person-add-outline' size={23} color={'#7E7E7E'} />
                                                <Text style={styles.text_choose}>Thêm bạn</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    navigation.navigate('CreateGroup')
                                                    setModalVisible(false)
                                                    setListUserGroupNew([]);
                                                }}
                                                style={styles.choose}>
                                                <AntDesign name='addusergroup' size={23} color={'#7E7E7E'} />
                                                <Text style={styles.text_choose}>Tạo nhóm</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </Modal>
                    </View>
                },
                headerStyle: {
                    backgroundColor: '#056282',
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
    search_nav: {
        display: 'flex',
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    search_con: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    search_text: {
        color: '#fff',
        width: 300,
        padding: 10,
    },
    centered_view: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        margin: 10,
        // backgroundColor: '#00000099',
    },
    modal_cont: {
        width: 200,
        backgroundColor: '#ffffff',
        borderRadius: 5,
    },
    modal_body: {
        padding: 10,
    },
    choose: {
        height: 50,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row',
    },
    text_choose: {
        marginLeft: 15,
        fontSize: 16,
    }
});
