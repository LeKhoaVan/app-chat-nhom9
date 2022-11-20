import { Component, useEffect, useState , useContext} from "react";
import { useNavigate  } from 'react-router-dom'
import {AuthContext}    from "../../contexts/AuthContext"
import Spinner from 'react-bootstrap/Spinner'
import "./Login.css"
import AlertMessage from '../AlertMessage'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import CakeIcon from '@mui/icons-material/Cake';
import PopupVertìyOTP from "../PopupQuestion/PopupVertifyOTP";


function OnclickTitle(){
    const $ = document.querySelector.bind(document);
    const $$ = document.querySelectorAll.bind(document);

    const tabs = $$(".tabs__title-item");
    const panes = $$(".tabs__content-item");


    const tabActive = $(".tabs__title-item.active");
    const line = $(".tabs__title .line");

    requestIdleCallback(function () {
    line.style.left = tabActive.offsetLeft + "px";
    line.style.width = tabActive.offsetWidth + "px";
    });

    tabs.forEach((tab, index) => {
    const pane = panes[index];

    tab.onclick = function () {
        $(".tabs__title-item.active").classList.remove("active");
        $(".tabs__content-item.active").classList.remove("active");

        line.style.left = this.offsetLeft + "px";
        line.style.width = this.offsetWidth + "px";

        this.classList.add("active");
        pane.classList.add("active");
    };
    });


}
function OneClickLogin(){
    const login = document.querySelector(".tabs__title-item.login");
    login.click()
}

function OneClickRegister(){
    const register = document.querySelector(".tabs__title-item.register");
    register.click()
}


export default function Login() {
    const [popupOTP, setPopupOTP] = useState({
        title: 'Nhập mã xác thực',
        gmail: '',
        isLoading: false
      })


     function handleOTP(choose){
        if(choose){
            setPopupOTP({
                title: '',
                gmail: '',
                isLoading: false
              });
        }
     }

   
    //Login
    const {loginUser} = useContext(AuthContext)

    const [loginForm , setLoginForm] = useState({
        email:'',
        password:'',
    })
    const {email, password} = loginForm

    const [alert, setAlert] = useState(null)

    const onChangeLoginForm = event =>
        setLoginForm({ ...loginForm, [event.target.name]: event.target.value })

    const login = async event => {
        event.preventDefault()

        try {
            const loginData = await loginUser(loginForm)
            if (!loginData.success) {
                setAlert({ type: 'danger', message: loginData.message })
                setTimeout(() => setAlert(null), 5000)
            }
        } catch (error) {
            console.log(error)
        }
    }


  
    //register
    const {registerUser} = useContext(AuthContext)

    const [registerForm , setRegisterForm] = useState({
        emailRe:'',
        passwordRe:'',
        cfpassword:'',
        username:'',
        birthday:'',
        gender:'',
        avt:'data:image/png;base64,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'
    })
    const {emailRe  ,passwordRe ,cfpassword , username , birthday , gender} = registerForm

    const [alertRe, setAlertRe] = useState(null)

    const onChangeRegisterForm = event =>
        setRegisterForm({ ...registerForm, [event.target.name]: event.target.value })

    const register = async event => {
        event.preventDefault()

        if(passwordRe === cfpassword){
            try {
                const registerData = await registerUser(registerForm)
                if (!registerData.success) {
                    setAlertRe({ type: 'danger', message: registerData.message })
                    setTimeout(() => setAlertRe(null), 5000)
                }else{
                    setAlertRe({ type: 'danger', message: "Xác thực tài khoản" })
                    setTimeout(() => setAlertRe(null), 10000)

                    setPopupOTP({
                        title: 'Nhập mã xác thực',
                        gmail: emailRe,
                        isLoading: true
                      });

                }
            } catch (error) {
                console.log(error)
            }
        }
        else{
            setAlertRe({ type: 'danger', message: "Mật khẩu không khớp" })
            setTimeout(() => setAlertRe(null), 5000)
        }

        
    }


   


    return ( 
       <>
       
        <div className='container'>
            
            <div className='modal'>
                <div className='text-effect'>
                    <div className="header-name" >
                        CYNO CHAT
                    </div>
                </div>
            
                <div className='tabs__title'>
                    <div ref={OneClickLogin} onClick={OnclickTitle} className='tabs__title-item active login'>Đăng nhập</div>
                    <div onClick={OnclickTitle} className='tabs__title-item register'>Đăng ký</div>
                    <div className='line'></div>
                    
                </div>
                
                <div className='tabs__content'>
                    <div className='tabs__content-item active login'>
                        <form className='form' onSubmit={login} >
                           
                            <div className='form-control'>
                                <input placeholder="Email" className='form-input' type="email" name="email"
                                    value={email}
                                    onChange={onChangeLoginForm}
                                />

                                <i className='icon'><AlternateEmailIcon sx={{ fontSize: 16 }}/></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Mật khẩu" type="password" className='form-input' name="password"
                                     value={password}
                                     onChange={onChangeLoginForm}
                                />
                                <i className='icon'><LockIcon sx={{ fontSize: 16 }}/></i>
                            </div>
                            <div className="err">
                                <AlertMessage info={alert} />
                            </div>
                            <input type="submit" value="Đăng nhập" className='button' />
                            <p className="form-link" onClick={OneClickRegister}>Đăng ký tài khoản ngay!</p>
                        </form>
                    
                    </div>
                    <div className='tabs__content-item register'>
                        <form className="form" onSubmit={register}>
                            <div className='form-control'>
                                <input placeholder="Email" className='form-input' type="email" name="emailRe"
                                value={emailRe}
                                onChange={onChangeRegisterForm}
                                />
                                <i className='icon'><AlternateEmailIcon sx={{ fontSize: 16 }}/></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Mật khẩu" className='form-input' type="password" name="passwordRe"
                                value={passwordRe} 
                                onChange={onChangeRegisterForm}/>
                                <i className='icon'><LockIcon sx={{ fontSize: 16 }}/></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Nhập lại mật khẩu" className='form-input' type="password" name="cfpassword"
                                value={cfpassword} 
                                onChange={onChangeRegisterForm}/>
                                <i className='icon'><LockIcon sx={{ fontSize: 16 }}/></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="User name" className='form-input' type="text" name="username"
                                value={username}
                                onChange={onChangeRegisterForm}/> 
                                <i className='icon'><PersonIcon sx={{ fontSize: 16 }}/></i>
                            </div>
                            <div className='form-control'>
                                <input type="date"  className='form-input date' name="birthday"
                                value={birthday} 
                                onChange={onChangeRegisterForm}/>
                                <i className='icon'><CakeIcon sx={{ fontSize: 16 }}/></i>
                            </div>
                            <div className='form-control radio'>
                                Giới tính:
                                <input type="radio" value="Nam" name="gender" 
                                onChange={onChangeRegisterForm} /> Nam
                                <input type="radio" value="Nữ" name="gender" 
                                onChange={onChangeRegisterForm} /> Nữ
                            </div>
                            <div className="err">
                                <AlertMessage info={alertRe} />
                            </div>
                            <input type="submit" value="Đăng ký" className='button'/>
                            <p className="form-link" onClick={OneClickLogin}>Đăng nhập ngay!</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        {popupOTP.isLoading && <PopupVertìyOTP onDialog={handleOTP} title={popupOTP.title} gmail={popupOTP.gmail} />}
      </>
    );
}