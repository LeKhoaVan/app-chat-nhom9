import './PopupQuestion.css'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Component, useEffect, useState , useContext} from "react";
import {AuthContext}    from "../../contexts/AuthContext"
import AlertMessage from '../AlertMessage'

function PopupVertifyOTP({title, gmail,onDialog}) {

    const {checkOTP} = useContext(AuthContext)
   
    const [alert, setAlert] = useState(null)

    const otp = async event => {
        event.preventDefault()

        try {
           
           
            const otpData = await checkOTP({
                email: gmail,
                otp: document.querySelector('#otp').value
            })
            if (!otpData.success) {
                setAlert({ type: 'danger', message: otpData.message })
                setTimeout(() => setAlert(null), 5000)
            }
        } catch (error) {
            console.log(error)
        }
    }



    return ( 
        <div className='popup-question'>
            <div className="popup-question-modal">
                <div className="header">
                    <p>{title}</p>
                    <p className='icon' onClick={()=>onDialog(true)}>&times;</p>
                </div>
                <div className="body">
                    <form className='form' onSubmit={otp}>

                        <div className='form-control'>
                            <input placeholder="OTP" className='' id="otp" name="otp"
                            />
                        </div>
                        <div className="err">
                                <AlertMessage info={alert} />
                        </div>
                        <div className='btn-group'>
                            <input type="submit" value="Xác thực" className='btn no'/>
                        </div>
                    </form>      
                
                    <div className='clear'></div>
                </div>
            </div>
        </div>
    );
}

export default PopupVertifyOTP;