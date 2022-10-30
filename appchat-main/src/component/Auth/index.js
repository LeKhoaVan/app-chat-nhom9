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
    console.log(authLoading)
    if (authLoading)
		body = (
			<div className="on-loader">
                <div className="loader loader-2">
                <svg className="loader-star" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1">
                        <polygon points="29.8 0.3 22.8 21.8 0 21.8 18.5 35.2 11.5 56.7 29.8 43.4 48.2 56.7 41.2 35.1 59.6 21.8 36.8 21.8 " fill="#18ffff" />
                    </svg>
                <div className="loader-circles"></div>
                </div>
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