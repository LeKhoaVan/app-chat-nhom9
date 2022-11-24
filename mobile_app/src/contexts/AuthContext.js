import { createContext, useEffect, useRef, useState } from 'react'
import { apiUrl} from './constants'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import setAuthToken from '../utils/setAuthToken'


export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

	const [userToken,setUserToken] = useState(null);
	const [userInfo,setUserInfo] = useState({});
	const [isLoading,setIsLoading] = useState(false);
	const [isRegisterSuccess,setIsRegisterSuccess] = useState(false);
	const [currentChat,setCurrentChat] = useState("");
	const [recallStatus,setRecallStatus] = useState(null)
	const [arrivalMessage, setArrivalMessages] = useState(null);
	const [senderMessage, setSenderMessage] = useState(null);
	const [authorize, setAuthorize] = useState([]);
	const [userCons, setUserCons] = useState([]);
	const [listUserGroupNew, setListUserGroupNew] = useState([]);
	const [listUserGroupAddNew, setListUserGroupAddNew] = useState([]);
	const [conversations, setConversation] = useState([]);
	const [render,setRender]=useState(1);
	const [listFriend, setListFriend] = useState([])
	const [listReceive, setListReceive] = useState([])
	const [listSend, setListSend] = useState([])
	const socket = useRef();
	//Login
	const login = async userForm =>{
		try{
			const response = await axios.post(`${apiUrl}/login`, userForm)
			if (response.data.success){
				setUserToken(response.data.accessToken);
				AsyncStorage.setItem('userToken',response.data.accessToken);
			}
			await loadUser()
			return response.data
		}catch(error){
			if (error.response.data) 
				return error.response.data
					else return { success: false, message: error.message }
		}
		
	}
	//Logout
	const logout=()=>{
		setIsLoading(true);
		
		setTimeout(()=>{
			setUserInfo({});
			setUserToken(null);
			AsyncStorage.removeItem('userToken')
			setIsLoading(false)},1000);
	}
	//LoadUser
	const loadUser = async () =>{
		setIsLoading(true)
		setTimeout(()=>{
			setIsLoading(false)},1000);

		if( await AsyncStorage.getItem('userToken')){
			setAuthToken(await AsyncStorage.getItem('userToken'))
			setUserToken(await AsyncStorage.getItem('userToken') )
			console.log('UserToken:',await AsyncStorage.getItem('userToken'));
		}
		try { 
			const response = await axios.get(`${apiUrl}`)
			if (response.data.success) {
				setUserInfo(response.data.user)
				
			} 

			
		} catch(error) {
			setUserToken(null);
			AsyncStorage.removeItem('userToken');
			setAuthToken(null);
			setUserInfo({});
			console.log('isLogged in error ${e}');

		}
	}
	const loadUser_Register = async () =>{
		if( await AsyncStorage.getItem('userToken')){
			setAuthToken(await AsyncStorage.getItem('userToken'))
			setUserToken(await AsyncStorage.getItem('userToken') )
			console.log('UserToken:',await AsyncStorage.getItem('userToken'));
		}
		try { 
			const response = await axios.get(`${apiUrl}`)
			if (response.data.success) {
				setUserInfo(response.data.user)
			} 
			
		} catch(error) {
			setUserToken(null);
			AsyncStorage.removeItem('userToken');
			setAuthToken(null);
			setUserInfo({});
			console.log('isLogged in error ${e}');

		}
	}
	//useEffect(() => loadUser(), [])
	useEffect(() => {
		loadUser();
	  }, []); 
	//register
	const register = async userForm => {
		try {
			const response = await axios.post(`${apiUrl}/register`, userForm)
			return response.data
		} catch (error) {
			if (error.response.data) {
				console.log(error.response.data);
				return error.response.data
			}
			else{
				console.log(error.message); 
				return { success: false, message: error.message }
			}
		}
	}
	//OTP
	const checkOTP = async userForm =>{
		try {
			const response = await axios.put(`${apiUrl}/verifyOtp`, userForm)
			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}
	//changePassword
	const changePassUser = async userForm => {
		try {
			const response = await axios.put(`${apiUrl}/changePassword`, userForm)
			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}

	// Return provider
	return (
		<AuthContext.Provider value={{userToken,register,login,logout,userInfo,
		isLoading,loadUser_Register,setUserToken,currentChat,setCurrentChat,socket,
		recallStatus,setRecallStatus,senderMessage, setSenderMessage,authorize,setAuthorize,
		userCons, setUserCons,listUserGroupNew, setListUserGroupNew,conversations, setConversation,
		listUserGroupAddNew, setListUserGroupAddNew,render,setRender,listFriend, setListFriend,
		listReceive, setListReceive,listSend, setListSend,checkOTP,changePassUser
		}}>
			{children}
		</AuthContext.Provider>
	)
}
