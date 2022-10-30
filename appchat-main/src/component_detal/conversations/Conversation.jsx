import axios from "axios";
import { useEffect, useState } from "react";
import "./conversation.css"
import moment from "moment";


import Popup from "./Popup";
import FileInput from "./FileInput";
import styles from "./styles.module.css";


export default function Conversation({ conversation, currentUser}) {
  const [user, setUser] = useState([]);

// poppu onpen form
const [openPopup, setOpenPopup] = useState(false);

 

const [data, setData] = useState({
  name: conversation.name,
  img: conversation.img,
});

const handleChange = ({ currentTarget: input }) => {
  setData({ ...data, [input.name]: input.value });
};

const handleInputState = (name, value) => {
  setData((prev) => ({ ...prev, [name]: value }));
};

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    const url = "http://localhost:8800/api/conversations/"+conversation._id;
    const { data : res } = await axios.put(url,data);
    console.log(res)
    
  } catch (error) {
    console.log(error)
  }
  
};


  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser);
    const getUser = async () => {
      try {
        const res = await axios("http://localhost:8800/api/users?userId="+friendId);  
        setUser(res.data);
        
      } catch (err) {
        console.log(err); 
      }
    };
    getUser();
  }, [currentUser, conversation]);


  return (
    <div className='conversation'>
      <img className='conversationImg' src={conversation.name? conversation.img: user.username  } alt='avarta' onClick={() => { setOpenPopup(true);  }} />
       <span className='conversationName'>{conversation.name? conversation.name : user.username  }</span>
      <span className='time'>09:00</span>


      <Popup
                title="Thông tin nhóm"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}>

              <h1 >{conversation.name? conversation.name : user.username  }</h1>
              
              <div className={styles.container}>
			<form className={styles.form} onSubmit={handleSubmit} >
				
				<input
					type="text"
					className={styles.input}
					placeholder="Ten nhom"
					name="name"
					onChange={handleChange}
					value={data.name}
				/>
				
				<FileInput
					name="img"
					label="Chọn hình ảnh"
					handleInputState={handleInputState}
					type="image"
					value={data.img}
				/>
				
				<button type="submit"  className={styles.submit_btn} onClick={() => { setOpenPopup(false); window.location.reload(false) }}>
					Xác nhận
				</button>
			</form>
		</div>
        </Popup>

    </div>
  )
}
