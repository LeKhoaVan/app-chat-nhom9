import { Component, useEffect, useState , useContext} from "react";
import { useNavigate  } from 'react-router-dom'
import {AuthContext}    from "../../contexts/AuthContext"
import Spinner from 'react-bootstrap/Spinner'
import "./Login.css"
import AlertMessage from '../AlertMessage'

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
function OneClick(){
    const login = document.querySelector(".tabs__title-item.login");
    login.click()
}


export default function Login() {

   
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
        gender:''

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
                    setAlertRe({ type: 'danger', message: "Thành công đăng ký tài khoản" })
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
                
                <div className='tabs__title'>
                    <div ref={OneClick} onClick={OnclickTitle} className='tabs__title-item active login'>Đăng nhập</div>
                    <div onClick={OnclickTitle} className='tabs__title-item register'>Đăng ký</div>
                    <div className='line'></div>
                    
                </div>
                
                <div className='tabs__content'>
                    <div className='tabs__content-item active login'>
                        <form className='form' onSubmit={login} >
                           
                            <div className='form-control'>
                                <input placeholder="Email" className='form-input' name="email"
                                    value={email}
                                    onChange={onChangeLoginForm}
                                />

                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Mật khẩu" type="password" className='form-input' name="password"
                                     value={password}
                                     onChange={onChangeLoginForm}
                                />
                                <i className='icon'></i>
                            </div>
                            <div className="err">
                                <AlertMessage info={alert} />
                            </div>
                            <input type="submit" value="Đăng nhập" className='button' />
                        </form>
                    
                    </div>
                    <div className='tabs__content-item register'>
                        <form className="form" onSubmit={register}>
                            <div className='form-control'>
                                <input placeholder="Email" className='form-input' name="emailRe"
                                value={emailRe}
                                onChange={onChangeRegisterForm}
                                />
                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Mật khẩu" className='form-input' name="passwordRe"
                                value={passwordRe} 
                                onChange={onChangeRegisterForm}/>
                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Nhập lại mật khẩu" className='form-input' name="cfpassword"
                                value={cfpassword} 
                                onChange={onChangeRegisterForm}/>
                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Username" className='form-input' name="username"
                                value={username} 
                                onChange={onChangeRegisterForm}/>
                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
                                <input type="date" className='form-input' name="birthday"
                                value={birthday} 
                                onChange={onChangeRegisterForm}/>
                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
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
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </>
    );
}