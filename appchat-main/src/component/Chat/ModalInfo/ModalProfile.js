import "../../PopupQuestion/PopupQuestion.css"
import Moment from "moment";
import { Avatar } from "@mui/material";

import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import { IconButton } from "@mui/material";

import DatePicker from 'react-date-picker';

import {  useState} from "react";
import axios from "axios";


import storage from "../Avarta/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";


function ModalInfo({ title, username, email, gender, birthday, avt, onDialogProfile,updateProfile}) {
    const [state, setState] = useState({
        avt: avt,
        username: username,
        email: email,
        gender: gender,
        birthday:birthday,
      
    });

    const [value, onChange] = useState(new Date(birthday));

   
    const handleChange = e => {
        setState({ ...state, username: e.target.value });
    };

   
   //Update Image profile
    const handleImageProFile = (e) => {
        
    
        const imageRef = ref(storage, `/avarta/${e.target.files[0].name + v4()}`);
        uploadBytes(imageRef, e.target.files[0])
          .then(() => {
            getDownloadURL(imageRef)
              .then(async (url) => {


              setState({ ...state, avt: (url) })
               
              })
              .catch((error) => {
                console.log(error.message, "error getting the image url");
              });
    
          })
          .catch((error) => {
            console.log(error.message);
          });
    
      };
    

    return (
        <div className='popup-question'>

            <div onClick={(e) => e.stopPropagation()} className="popup-question-modal if">
                <div className="header">
                    <p>{title}</p>
                    <p className='icon' onClick={() => onDialogProfile(false)}>&times;</p>

                </div>
                <div className="body">
                    <div className="avt">
                        <Avatar
                            src={state.avt}
                            alt="avatar"
                            sx={{ width: 90, height: 90 }}

                        />
                        
                        {/* Choose image avtar */}
                        <label for="myfile"><AddAPhotoIcon /></label>
                        <input type="file" accept="image/png, image/jpeg" id="myfile" name="myfile" style={{ display: 'none' }} onChange={handleImageProFile}/>

                    </div>
                    {/* Update tên hiển thị */}
                    <label for="fname">Tên hiển thị:</label>
                    <input
                        type="text"
                        className="inputTextProfile"
                        name="name"
                        onChange={handleChange}
                        value={state.username}
                    />
                    <br></br>
                    <hr width="100%" align="center" />

                    

                    <p className="title-info">Thông tin cá nhân </p>

                    <div className="title-gr">
                        <p className="title-name">Giới tính</p>


                        <form>
                            <input checked={state.gender==='Nam'} name="gioitinh" type="radio" value="Nam" className="RadioButtonProfile" onChange={e=>setState({ ...state,gender: (e.target.value) })} />Nam
                            <input  checked={state.gender==='Nữ'} name="gioitinh" type="radio" value="Nữ" className="RadioButtonProfile" onChange={e=>setState({ ...state,gender: (e.target.value) })}/>Nữ
                        </form>
                    </div>





                    <div className="title-gr">
                        <p className="title-name">Ngày sinh</p>
                        {/* <input type="date" id="myDate" value={Moment(birthday).format('YYYY-MM-DD')}/> */}
                    <DatePicker  onChange={(date) => {onChange(date);setState({ ...state,birthday: (date) });}} value={value} className="inputTextProfile"/>


                    
                    </div>


                    <div className="btn-gr">
                       
                        <button className="btn-info" onClick={()=>{updateProfile(state);onDialogProfile(false)}}>Cập nhật thông tin</button>
                    </div>
                </div>

            </div>

        </div>);

}

export default ModalInfo;