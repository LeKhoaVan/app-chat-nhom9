import { Component, useEffect, useState } from "react";
import "./Login.css"


export default function Login() {
   
    return ( 
       
        <div className='container'>
          
            <div className='modal'>
                <div className='tabs__title'>
                    <div className='tabs__title-item active login'>Đăng nhập</div>
                    <div className='tabs__title-item register'>Đăng ký</div>
                    <div className='line'></div>
                </div>
                <div className='tabs__content'>
                    <div className='tabs__content-item active login'>
                        <form className='form'>
                            <div className='form-control'>
                                <input placeholder="Email" className='form-input'/>
                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Mật khẩu" className='form-input'/>
                                <i className='icon'></i>
                            </div>
                            <input type="submit" value="Đăng nhập" className='button' />
                        </form>
                    
                    </div>
                    <div className='tabs__content-item register'>
                        <form className="form">
                            <div className='form-control'>
                                <input placeholder="Email" className='form-input'/>
                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Mật khẩu" className='form-input'/>
                                <i className='icon'></i>
                            </div>
                            <div className='form-control'>
                                <input placeholder="Nhập lại mật khẩu" className='form-input'/>
                                <i className='icon'></i>
                            </div>
                            <input type="submit" value="Đăng ký" className='button'/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      
    );
}