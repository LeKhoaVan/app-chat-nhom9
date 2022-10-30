import "./message.css";
import moment from "moment";
import axios from "axios";
import { useEffect, useState } from "react";
import {AuthContext} from "../../contexts/AuthContext";




export default function Message({ message, own }) {

  const [user, setUser] = useState([]);
  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios("http://localhost:8800/api/users/name?userId="+message.sender);  
        setUser(res.data.username);
      } catch (err) {
        console.log(err); 
      }
    };
    getUser();
  }, [message]);

  return (
    <div className={own ? "message own" : "message"}>
      <div className="messageTop">
        <img
          className="messageImg"
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
        <div className="messageText">
          <span className="owner">{user}</span>
          <p>{message.text}</p>
        </div>
      </div>
      <div className="messageBottom">{moment(message.createdAt).format("LT")}</div>
    </div>
  );
}
