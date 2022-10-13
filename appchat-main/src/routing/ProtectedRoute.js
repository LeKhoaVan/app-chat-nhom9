import { Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexts/AuthContext'
import Spinner from 'react-bootstrap/Spinner'

const ProtectedRoute = ({ children}) => {
	const {
		authState: { authLoading, isAuthenticated }
	} = useContext(AuthContext)

	if (authLoading)
		return (
			<div className='spinner-container'>
				<Spinner animation='border' variant='info' />
			</div>
		)

	return (
		
			
				isAuthenticated ? (
					children
				) : (
					<Navigate replace to='/login' />
				)
		
		
	)
}

export default ProtectedRoute