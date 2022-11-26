import "../../PopupQuestion/PopupQuestion.css"
import Moment from "moment";
import { Avatar } from "@mui/material";
import { useState, useContext } from "react";
import { AuthContext } from "../../../contexts/AuthContext"

//Update profile

import ModalProfile from "./ModalProfile";

function ModalInfo({ title, username, email, gender, birthday, avt, onDialog, _id, updateProfile }) {

  const [modalPassWord, setModalPassWord] = useState(false);
  const toggleModal = () => {
    setModalPassWord(!modalPassWord)
  }

  const { changePassUser } = useContext(AuthContext)

  const [changePassW, setChangePassW] = useState({
    emailChange: email,
    passwordOld: '',
    passwordNew: '',
    cfpassword: '',
  })
  const { passwordOld, passwordNew, cfpassword } = changePassW

  const onChangePassForm = event =>
    setChangePassW({ ...changePassW, [event.target.name]: event.target.value })

  const changePs = async event => {
    event.preventDefault()

    try {
      const changPassData = await changePassUser(changePassW)
      if (!changPassData.success) {
        alert(changPassData.message)
      } else {
        toggleModal()
        onDialog(false)
        alert('Đổi mật khẩu thành công')
      }
    } catch (error) {
      console.log(error.message)
    }

  }

  const handleClear = () => {
    setChangePassW({
      emailChange: email,
      passwordOld: '',
      passwordNew: '',
      cfpassword: ''
    });
  }

  //hffhfhfh
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
    <div className='popup-question'>
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
            <button className="btn-info"
              onClick={toggleModal}
            >Đổi mật khẩu</button>
            {modalPassWord && (
              <div className="modalPassWord">
                <div className="overlay"></div>
                <div className="modal-content">
                  <form className="form" onSubmit={changePs}>
                    <br></br>
                    <input placeholder="Nhập mật khẩu hiện tại" className="passCss-ip changePass" type="password"
                      name="passwordOld" value={passwordOld} onChange={onChangePassForm}></input>
                    <br></br>
                    <input placeholder="Nhập mật khẩu mới" className="passCss-ip changePass" type="password"
                      name="passwordNew" value={passwordNew} onChange={onChangePassForm}></input>
                    <br></br>
                    <input placeholder="Nhập lại mật khẩu mới" className="passCss-ip changePass" type="password"
                      name="cfpassword" value={cfpassword} onChange={onChangePassForm}></input>
                    <br></br>
                    <input type="submit" value="Cập nhật" className='btn-info passCss-btn updatePassBtn' />
                    <input type="button" value="Nhập lại" className='btn-info passCss-btn clearPassBtn' onClick={handleClear} />
                  </form>
                </div>
              </div>
            )}


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