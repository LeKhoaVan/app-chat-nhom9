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
import React, { Component } from "react";
import avatar from '../../assets/avatar.jpg';
import { width } from "@mui/system";
import ModalInfo from "./ModalInfo/ModalInfo";
import { useContext, useState } from 'react'
import { AuthContext } from "../../contexts/AuthContext"
import axios from "axios";


export default function SideNavbar() {
  const [isActive, setIsActive] = useState(false);
  const [popupInfo, setPopupInfo] = useState({
    username: '',
    message: '',
    isLoading: false,
   
  })

  
  const {
    authState: { user: { _id, avt, username, birthday, gender, email } },
    socket,logoutUser
  } = useContext(AuthContext)


  const [userProfile, setProfile] = useState({
    title: 'Thông tin tài khoản',
    _id: _id,
    username: username,
    avt: avt,
    birthday: birthday,
    gender: gender,
    email: email,
  });


  const logout = () => {
    socket.current.emit('onDisconnect')
    logoutUser()
  }

  function handleToggle() {
    setIsActive(!isActive);
  };

  function openPopupInfo() {
    setPopupInfo({
      isLoading: true
    });
  }

  function handlePopupInfo(choose) {
    if (!choose) {
      setPopupInfo({
        title: '',
        username: "",
        avt: "",
        birthday: '',
        gender: '',
        email: '',
        isLoading: false
      });
    }
  }

  

const updateProfile= async (data) =>{
  try {
    console.log(data)
    console.log(userProfile)
    const url = "http://localhost:8800/api/users/updateProfile/" +_id;
    const res = await axios.put(url, data);
    setProfile({ ...userProfile,username:data.username,avt:data.avt,gender:data.gender,birthday:data.birthday})
  } catch (error) {
    console.log(error)
  }
}

  return (
    <div className="nav__tabs">
      <div className="nav__tabs__avt">

        <div className="nav__tabs__avt--img">
          <Avatar
            className="avatar"
            alt="avatar"
            src={userProfile.avt}
            sx={{ width: 48, height: 48 }} />

          <div className="side-avt-model">
            {/* <p className="side-avt-model-item name">{username}</p> */}
          </div>
        </div>

      </div>
      <div className="nav__tabs__top">
        <ul className="nav__tabs--list">
          <li className="nav__tabs--item active">
            <Tooltip placement="bottom" title="Tin nhắn" enterDelay={1000} leaveDelay={100}>
              <ChatOutlinedIcon />
            </Tooltip>
          </li>
          <li className="nav__tabs--item" onClick={openPopupInfo}>

            <Tooltip placement="bottom" title="Thông tin tài khoản" enterDelay={1000} leaveDelay={100}>
              <AccountBoxIcon />
            </Tooltip>
          </li>
          <li onClick={logout} className="nav__tabs--item">
            <Tooltip placement="bottom" title="Đăng xuất" enterDelay={1000} leaveDelay={100}>
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
          {/* <li onClick={handleToggle} className={isActive ? "nav__tabs--item dark-theme dark" : "nav__tabs--item dark-theme light"}>
            <Tooltip placement="top" title={isActive ? "Light Mode" : "Dark Mode"} enterDelay={1000} leaveDelay={100}>
              <div className="dark-mode">
                <div className="item light-item"><LightModeIcon /></div>
                <div className="item dark-item"><DarkModeIcon /></div>
                <span className="ball"></span>
              </div>
            </Tooltip>
          </li> */}
        </ul>
      </div>
      <div class="clear"></div>


      {popupInfo.isLoading && <ModalInfo onDialog={handlePopupInfo}

        avt={userProfile.avt}
        gender={userProfile.gender}
        birthday={userProfile.birthday}
        email={userProfile.email}
        title={userProfile.title}
        username={userProfile.username}
        _id={userProfile._id} 
        updateProfile={updateProfile}
        />}

    </div>

  );
}
