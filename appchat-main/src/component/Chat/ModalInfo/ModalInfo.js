import "../../PopupQuestion/PopupQuestion.css"
import Moment from "moment";
import { Avatar } from "@mui/material";


//Update profile
import { useContext, useState } from 'react'
import ModalProfile from "./ModalProfile";







function ModalInfo({ title, username, email, gender, birthday, avt, onDialog, _id,updateProfile}) {
  const [openPopup, setOpenPopup] = useState(false);



  const [popupInfo, setPopupInfo] = useState({
    username: '',
    message: '',
    isLoading: false
  })


  function openPopupInfoProflie() {
    setPopupInfo({
      title: 'Cập nhật thông tin',
      username: username,
      avt: avt,
      birthday: birthday,
      gender: gender,
      email: email,
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
        isLoading: false,

      });
      onDialog(false)
    }
  }

  

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
          <div className="btn-gr">
            <button className="btn-info" >Đổi mật khẩu</button>
            <button className="btn-info" onClick={() => { openPopupInfoProflie() }}>Cập nhật thông tin</button>
          </div>
        </div>


        {popupInfo.isLoading && <ModalProfile onDialogProfile={handlePopupInfo}

          avt={popupInfo.avt}
          gender={popupInfo.gender}
          birthday={popupInfo.birthday}
          email={popupInfo.email}
          title={popupInfo.title}
          username={popupInfo.username}
          updateProfile={updateProfile}
        />}

      </div>


    </div>);
}

export default ModalInfo;