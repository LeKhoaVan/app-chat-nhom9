import LoginForm from './Login'
import { AuthContext } from '../../contexts/AuthContext'
import { useContext } from 'react'
import { useNavigate , Navigate } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'

const Auth = () => {
    let negative = useNavigate();
    let body
	const {
		authState: { authLoading, isAuthenticated }
	} = useContext(AuthContext)
    
    if (authLoading)
		body = (
			<div className='d-flex justify-content-center mt-2'>
				<Spinner animation='border' variant='info' />
			</div>
		)
	else if (isAuthenticated) {
        return <Navigate replace to="/chat" />
    }
    else
        body = (
            <>
                <LoginForm />
            </>
        )

    return (
        body
    )
}

export default Auth