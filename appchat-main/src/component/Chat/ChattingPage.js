import React, { Component, useEffect, useState } from "react";
import { Button } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import SearchIcon from '@mui/icons-material/Search';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import InputEmoji from "react-input-emoji";
import Tooltip from "@mui/material/Tooltip";
import SendIcon from '@mui/icons-material/Send';
import Message from '../../component_detal/message/Message';
import "../../component_detal/message/message.css";
import axios from "axios";


export default function ChattingPage() {

    // return (
    //     <div className="chattingpage">
    //         {
    //                 currentChat  ?
    //             <>    
    //         <div className="top-header">
    //             <div className="user-header">
    //                 <Avatar>TN</Avatar>
    //                 <p className="user-name">Nguyễn Thái Nguyên</p>
    //             </div>
    //             <div>
    //                 <div className="user-fet">
    //                     <Tooltip
    //                         title="Tìm kiếm tin nhắn"
    //                         placement="bottom-end">
    //                         <SearchIcon />
    //                     </Tooltip>
    //                     <Tooltip
    //                         title="Cuộc gọi thoại"
    //                         placement="bottom-end">
    //                         <CallIcon />
    //                     </Tooltip>
    //                     <Tooltip
    //                         title="Cuộc gọi video"
    //                         placement="bottom-end">
    //                         <VideoCallIcon />
    //                     </Tooltip>
    //                     <Tooltip
    //                         title="Thông tin"
    //                         placement="bottom-end">
    //                         <MoreHorizIcon />
    //                     </Tooltip>
    //                 </div>
    //             </div>
    //         </div>
    //         <div className="live-chat">
                
    //             <div>
    //                 <Message />
    //                 <Message own={true} />
    //                 <Message />
    //             </div>
                
    //         </div>

    //         <div className="sender-cont">
    //             <div className="send-message">
    //                 <InputEmoji
    //                     value=""
    //                     cleanOnEnter
    //                     placeholder="Nhập tin nhắn"
    //                 />
    //             </div>
    //             <Button
    //                 variant="contained"
    //                 className="sendbutton"
    //                 endIcon={<SendIcon />}>
    //             </Button>
    //         </div>
    //         </> : <span className="noChat">Chưa có tin nhắn</span>
    //             }  
    //     </div>
    // );

}