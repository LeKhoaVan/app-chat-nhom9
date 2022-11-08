import Avatar from "@mui/material/Avatar";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSelector } from "react-redux";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AccountCircle from '@mui/icons-material/AccountCircle'
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import React,{ Component } from "react";
import avatar from '../../assets/avatar.jpg'; 
import { width } from "@mui/system";

import { useContext , useState } from 'react'
import {AuthContext} from "../../contexts/AuthContext"


export default function SideNavbar(){
  const [isActive, setIsActive] = useState(false);
  const {
    authState:{user:{avt,username}},
    logoutUser
  } = useContext(AuthContext)

  const logout = () => logoutUser()

  function handleToggle(){
    setIsActive(!isActive);
  };
  

        return(
          <div className="nav__tabs">
            <div className="nav__tabs__avt">
              <div className="nav__tabs__avt--img">
                <Avatar  
                  className="avatar"
                  alt="avatar" 
                  src={avt}
                  sx={{width:48,height:48}}/>
                  
                  <div className="side-avt-model">
                    <p className="side-avt-model-item name">{username}</p>
                  </div>
              </div>
              
            </div>
            <div className="nav__tabs__top">
              <ul className="nav__tabs--list">
                <li className="nav__tabs--item active">
                <Tooltip placement="bottom" title="Tin nhắn"  enterDelay={1000} leaveDelay={100}>
                  <ChatOutlinedIcon />
                </Tooltip>
                </li>
                <li className="nav__tabs--item">
                <Tooltip placement="bottom" title="Thông tin cá nhân"  enterDelay={1000} leaveDelay={100}>
                  <AccountBoxIcon />
                </Tooltip>
                </li>
                <li onClick={logout} className="nav__tabs--item">
                  <Tooltip placement="bottom" title="Đăng xuất"  enterDelay={1000} leaveDelay={100}>
                    <LogoutIcon />
                  </Tooltip>    
                </li>
              </ul>    
           </div>
           <div className="nav__tabs__bottom">
              <ul className="nav__tabs--list">
                <li className="nav__tabs--item">
                <Tooltip placement="top" title="Cài đặt" enterDelay={1000} leaveDelay={100}>
                  <SettingsOutlinedIcon />
                </Tooltip>  
                 
                </li>
                <li onClick={handleToggle} className={isActive ? "nav__tabs--item dark-theme dark" : "nav__tabs--item dark-theme"}>
                  <div className="dark-mode">
                    <div className="item dark-item"><DarkModeIcon/></div>
                    <div className="item light-item"><LightModeIcon/></div>
                  </div>
                 
                </li>
              </ul>    
           </div>
           <div class="clear"></div>
          </div>
        );
}
