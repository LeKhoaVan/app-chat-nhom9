import { Component, useEffect, useState } from "react";
import "./Login.css"

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
      </>
    );
}