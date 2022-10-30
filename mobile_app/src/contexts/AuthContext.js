import { createContext, useEffect, useState } from 'react'
import { apiUrl} from './constants'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import setAuthToken from '../utils/setAuthToken'

export const AuthContext = createContext()

export const AuthContextProvider = ({ children }) => {

	const [userToken,setUserToken] = useState(null);
	const [authState,setAuthState] = useState(null);
	const [userInfo,setUserInfo] = useState({});
	const [isLoading,setIsLoading] = useState(false);
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
		setUserToken(null);
		AsyncStorage.removeItem('userToken')
		setUserInfo({});
		setTimeout(()=>setIsLoading(false),1000);
	}
	//LoadUser
	const loadUser = async () =>{
		setIsLoading(true)
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
		setTimeout(()=>setIsLoading(false),0);
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
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}
	// Return provider
	return (
		<AuthContext.Provider value={{userToken,login,logout,userInfo,isLoading,register}}>
			{children}
		</AuthContext.Provider>
	)
}
