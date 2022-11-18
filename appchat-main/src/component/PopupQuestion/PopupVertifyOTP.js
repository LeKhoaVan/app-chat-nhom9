import './PopupQuestion.css'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import { Component, useEffect, useState , useContext} from "react";
import {AuthContext}    from "../../contexts/AuthContext"
import AlertMessage from '../AlertMessage'
import OtpInput from 'react-otp-input';

function PopupVertifyOTP({title, gmail,onDialog}) {

    const {checkOTP} = useContext(AuthContext)
   
    const [alert, setAlert] = useState(null)
    const [OTPInput, setOTPInput] = useState("")



    function handleChange(otp){
        setOTPInput(otp)
    }


    const otp = async event => {
        event.preventDefault()

        try {
           
           
            const otpData = await checkOTP({
                email: gmail,
                otp: OTPInput
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
                            {/* <input  className='' id="otp1" name="otp1"
                            />
                             <input  className='' id="otp2" name="otp2"
                            />
                             <input  className='' id="otp3" name="otp3"
                            />
                             <input  className='' id="otp4" name="otp4"
                            /> */}
                            <OtpInput
                              value={OTPInput}
                              onChange={handleChange}
                                
                                numInputs={4}
                                separator={<span>-</span>}
                            />
                        </div>
                        <div className="err">
                                <AlertMessage info={alert} />
                        </div>
                        <div className='btn-group'>
                            <input type="submit" value="Xác thực" className='btn acc'/>
                        </div>
                    </form>      
                
                    <div className='clear'></div>
                </div>
            </div>
        </div>
    );
}

export default PopupVertifyOTP;