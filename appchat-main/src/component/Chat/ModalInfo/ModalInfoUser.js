import "../../PopupQuestion/PopupQuestion.css"
import Moment from "moment";
import { Avatar } from "@mui/material";
import { useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext"



function ModalInfoUser({ title, username, email, gender, birthday, avt, onDialog}) {


  return (
    <div onClick={() => onDialog(false)} className='popup-question'>
      <div onClick={(e) => e.stopPropagation()} className="popup-question-modal if">
        <div className="header">
          <p>{title}</p>
          <p className='icon' onClick={() => onDialog(false)}>&times;</p>
        </div>
        <div className="body">
          <div className="avt">
            <Avatar
              src={avt}
              alt="avatar"
              sx={{ width: 90, height: 90 }}
            />
          </div>
          <p className="username">{username}</p>
          <p className="title-info">Thông tin cá nhân</p>
          <div className="title-gr">
            <p className="title-name">Email</p>
            <p className="title-value">{email}</p>
          </div>
          <div className="title-gr">
            <p className="title-name">Giới tính</p>
            <p className="title-value">{gender}</p>
          </div>
          <div className="title-gr">
            <p className="title-name">Ngày sinh</p>
            <p className="title-value">{Moment(birthday).format('DD-MM-YYYY')}</p>
          </div>
         
        </div>
      </div>
    </div>);
}

export default ModalInfoUser;