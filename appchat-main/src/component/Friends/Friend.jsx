import { Component, useEffect, useState, useRef, useContext } from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import Tooltip from "@mui/material/Tooltip";

import FriendList from '../../component/Friends/FriendList';
import Message from '../../component_detal/message/Message';
import "../../component_detal/message/message.css";
import "../../component/Friends/Friend.css"
import { Alert, Button, IconButton } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InputEmoji, { $$typeof } from "react-input-emoji";
import SendIcon from '@mui/icons-material/Send';
import ImageIcon from '@mui/icons-material/Image';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import axios from "axios";
import Edit from "@mui/icons-material/Edit";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {io} from "socket.io-client";
import {AuthContext} from "../../contexts/AuthContext";



export default function MyChat() {
  const {authState:{user:{avt, _id, }}} = useContext(AuthContext)

  const [conversations, setConversation] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  

  return (
    <div className="fullSc">
      <div className="mychat-cont">
        <div className="search-c">
          <div className="search-cont">
            <SearchIcon />
            <input type="text"placeholder="Tìm kiếm"/>
          </div>
          <Tooltip placement="bottom-end"  title="Thêm bạn"> 
          <PersonAddAlt1Icon />
          </Tooltip>
          <Tooltip  placement="bottom-end" title="Tạo nhóm chat">
            <GroupAddIcon />
          </Tooltip>
        </div>
        <div className="recent-chat">
        <div className="dskb">
            <img src="https://chat.zalo.me/assets/NewFr@2x.820483766abed8ab03205b8e4a8b105b.png" alt="wibu"
                    height="35" width="35" />
            <h3 className="goLeftPlease1">Danh sách kết bạn</h3>     
        </div>
        <div className="dskb">
            <img src="https://chat.zalo.me/assets/group@2x.2d184edd797db8782baa0d5c7a786ba0.png" alt="wibu"
                    height="35" width="35" />
            <h3 className="goLeftPlease2">Danh sách nhóm</h3>     
        </div>

          <p id="banBe"><b>Bạn bè</b></p>
          <div className="recent-user">
        
          <div>
                <FriendList/>
                <FriendList/>
                <FriendList/>
              </div>
            
          </div>
        </div>
        
      </div>
      <div className="fr-title">
            <img src="https://chat.zalo.me/assets/NewFr@2x.820483766abed8ab03205b8e4a8b105b.png" alt="wibu" 
            height="41" width="41" />
            <div id="h3DSKB">
                <h3>Danh sách kết bạn</h3>
            </div>
        </div>
      <div className="fr">
            <div className="fr-top">
                <p><b>Lời mời kết bạn</b></p>
            </div>
            <img src="" alt="wibu" height="100" width="100" />
            <p className="info"><b>Makima</b><br /><span>Từ email</span></p>
            <div id="button-block">
                <div id="delete">Bỏ qua</div>
                <div id="confirm">Đồng ý</div>
            </div>
        </div>
        <div className="fr">
            <div className="fr-top">
                <p><b>Lời mời kết bạn</b></p>
            </div>
            <img src="" alt="wibu" height="100" width="100" />
            <p className="info"><b>Makima</b><br /><span>Từ email</span></p>
            <div id="button-block">
                <div id="delete">Bỏ qua</div>
                <div id="confirm">Đồng ý</div>
            </div>
        </div>
        <div className="fr">
            <div className="fr-top">
                <p><b>Lời mời kết bạn</b></p>
            </div>
            <img src="" alt="wibu" height="100" width="100" />
            <p className="info"><b>Makima</b><br /><span>Từ email</span></p>
            <div id="button-block">
                <div id="delete">Bỏ qua</div>
                <div id="confirm">Đồng ý</div>
            </div>
        </div>
        <div className="fr">
            <div className="fr-top">
                <p><b>Lời mời kết bạn</b></p>
            </div>
            <img src="" alt="wibu" height="100" width="100" />
            <p className="info"><b>Makima</b><br /><span>Từ email</span></p>
            <div id="button-block">
                <div id="delete">Bỏ qua</div>
                <div id="confirm">Đồng ý</div>
            </div>
        </div>

    </div>
  );
}


