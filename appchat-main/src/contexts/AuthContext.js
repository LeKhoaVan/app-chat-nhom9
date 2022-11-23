import { createContext, useReducer, useEffect, useRef } from 'react'
import { authReducer } from '../reducers/authReducer'
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME } from './constants'
import axios from 'axios'
import setAuthToken from '../utils/setAuthToken'


export const AuthContext = createContext()

const AuthContextProvider = ({ children }) => {
	const [authState, dispatch] = useReducer(authReducer, {
		authLoading: true,
		isAuthenticated: false,
		user: null
	})
	const socket = useRef();

    //authenticate user
    const loadUser = async () => {
		if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
			setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME])
		}

		try {
			const response = await axios.get(`${apiUrl}`)
			if (response.data.success) {
				dispatch({
					type: 'SET_AUTH',
					payload: { isAuthenticated: true, user: response.data.user }
				})
			}
		} catch (error) {
			localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
			setAuthToken(null)
			dispatch({
				type: 'SET_AUTH',
				payload: { isAuthenticated: false, user: null }
			})
		}
	}

	//useEffect(() => loadUser(), [])
	useEffect(() => {
		loadUser();
	  }, []); 

	//register
	const registerUser = async userForm => {
		try {
			const response = await axios.post(`${apiUrl}/register`, userForm)

			// if (response.data.success)
			// 	localStorage.setItem(
			// 		LOCAL_STORAGE_TOKEN_NAME,
			// 		response.data.accessToken
			// 	)

			//await loadUser()

			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}

	const checkOTP = async userForm =>{
		try {
			const response = await axios.put(`${apiUrl}/verifyOtp`, userForm)

			if (response.data.success)
				localStorage.setItem(
					LOCAL_STORAGE_TOKEN_NAME,
					response.data.accessToken
				)

			await loadUser()

			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}

	 // Login
	const loginUser = async userForm => {
		try {
			const response = await axios.post(`${apiUrl}/login`, userForm)
			if (response.data.success)
				localStorage.setItem(
					LOCAL_STORAGE_TOKEN_NAME,
					response.data.accessToken
				)

				await loadUser()

			return response.data
		} catch (error) {
			if (error.response.data) return error.response.data
			else return { success: false, message: error.message }
		}
	}


	const logoutUser = () => {
		localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME)
		dispatch({
			type: 'SET_AUTH',
			payload: { isAuthenticated: false, user: null }
		})
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

    const authContextData = {loginUser , authState , logoutUser, registerUser, changePassUser, checkOTP , socket}
	// Return provider
	return (
		<AuthContext.Provider value={authContextData}>
			{children}
		</AuthContext.Provider>
	)
}

export default AuthContextProvider