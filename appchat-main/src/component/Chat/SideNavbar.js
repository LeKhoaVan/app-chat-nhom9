import Avatar from "@mui/material/Avatar";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { useSelector } from "react-redux";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AccountCircle from '@mui/icons-material/AccountCircle'
import styled from "@emotion/styled";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import React,{ Component } from "react";
import avatar from '../../assets/avatar.jpg'; 
import { width } from "@mui/system";

import { useContext } from 'react'
import {AuthContext} from "../../contexts/AuthContext"


export default function SideNavbar(){
  
  const {
    authState:{user:{avt,username}},
    logoutUser
  } = useContext(AuthContext)

  const logout = () => logoutUser()

        return(
        <div className="side-nav">
          <div className="side-avt">
           <Avatar  
              className="avatar"
              alt="avatar" 
              src={avt}
              sx={{width:46,height:46}}/>
            <div className="side-avt-model">
            
              <p className="side-avt-model-item name">User: {username}</p>
              <p className="side-avt-model-item">Xem thông tin tài khoản</p>
              <button className="side-avt-model-item logout" onClick={logout}>Đăng xuất</button>
            </div>
          </div>
          <div className="icon">
            <Tooltip placement="bottom-end" title="Chats">
              <ChatOutlinedIcon />
            </Tooltip>
            <Tooltip placement="bottom-end" title="Contacts">
              <PermContactCalendarIcon />
            </Tooltip>
            <Tooltip placement="bottom-end" title="Settings">
              <SettingsOutlinedIcon />
            </Tooltip>
          </div>
        </div>
        );
}
