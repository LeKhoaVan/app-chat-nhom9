
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const axios = require('axios');
const http = require('http');
const socketio  = require('socket.io');
const server = http.createServer(app);

const userRoute = require("./routes/user");
const conversationRoute = require("./routes/conversations");
const messageRoute = require("./routes/messages");
const authRoute = require("./routes/auth");
const router = express.Router();
const path = require("path");
 
dotenv.config();

mongoose.connect(
  process.env.MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("Connected to MongoDB");
  }
);
app.use("/images", express.static(path.join(__dirname, "public/images")));

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
var cors = require('cors');
app.use(cors()); 

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json("File uploded successfully");
  } catch (error) {
    console.error(error);
  }
});
 

app.use("/api/users", userRoute);
app.use("/api/conversations", conversationRoute);
app.use("/api/messages", messageRoute);
app.use("/api/auth", authRoute);




//socket
const io = socketio(server,{
  cors: {
    origin: '*'
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId});
};



const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = function(userId) {
  return users.find((user1) => user1.userId === userId);
};

io.on("connection", (socket) => {
  //when ceonnect
  console.log("a user connected.");
  //take userId and socketId from user
  socket.on("addUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  //send and get message
  socket.on("sendMessage", function({ _id,senderId, receiverIds, text,type, conversationId,reCall,delUser,date,username, avt }) {

      // const ds = []
      
      // receiverIds.forEach(function(receiverId){
      //   ds.push(getUser(receiverId).socketId)
      // })
      // ds.push(receiverId)

      // receiverIds.forEach(function(room){
      //   if( getUser(room) == undefined){
      //     console.log("user offline,users online:",users);
      //   }
      //   else {
      //     io.to(getUser(room).socketId).emit("getMessage", {
            io.emit("getMessage", {
            _id,
            senderId,
            text,
            type,
            conversationId,
            reCall,
            delUser,
            date,
            username,
            avt
          });
          console.log('Sent content:',text);
      //   }
      // });
    
  });

  //update status
  socket.on("sendStatus", function({senderId,username,receiverIds,type,text,conversationId,delUser,date}) {

    // const ds = []
    
    // receiverIds.forEach(function(receiverId){
    //   ds.push(getUser(receiverId).socketId)
    // })
    // ds.push(receiverId)
    // receiverIds.forEach(function(room){
    //   if( getUser(room) == undefined){
    //     console.log("user offline");
    //   }
    //   else {
    //     io.to(getUser(room).socketId).emit("getStatus", {
      io.emit("getStatus", {
          senderId,
          text,
          type,
          conversationId,
          delUser,
          date,
          username,
          
        });
    //   }
    // });
  
});



  //delete message
  socket.on("deleteMessage", function({_id,messagesCurrent, messageId, senderId, receiverIds,reCall, text,username, avt }) {

    // receiverIds.forEach(function(room){
    //   if( getUser(room) == undefined){
    //     console.log("user offline,users online:",users);
    //   }
    //   else {
    //     io.to(getUser(room).socketId).emit("delMgs", {
      io.emit("delMgs", {
          _id,
          messagesCurrent,
          messageId,
          senderId,
          text,
          reCall,
          username,
          avt,
        });
    //   }
    // });
  
  });

  socket.on("recallMessageStatus", function({senderId,username,receiverIds,type,text,conversationId,delUser,date}) {

    // receiverIds.forEach(function(room){
    //   if( getUser(room) == undefined){
    //     console.log("user offline");
    //   }
    //   else {
    //     io.to(getUser(room).socketId).emit("recallMgsStatus", {
      io.emit("recallMgsStatus", {
          senderId,
          text,
          type,
          conversationId,
          delUser,
          date,
          username,
        });
    //   }
    // });
  
  });

  // socket.on("authorize", function(data) {
   
  //       io.emit("getAu", data );
  // });

  //when disconnect
  const handleDisconnect=()=>{
    console.log("a user disconnected!");
    let id="";
    if(users.length>0)
      id = users.find(e=>e.socketId=socket.id).userId;
    let data={
      usersId:id,
      isActive:false,
    }
    const activeOn = async () => {
      try {
        const res = await axios.put('http://localhost:8800/api/users/'+id, data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if(id!="")
      activeOn();
    removeUser(socket.id);
    io.emit("getUsers", users);
  }
  socket.on("onDisconnect", () =>{
    handleDisconnect()
  });
  socket.on("disconnect", () => {
    handleDisconnect()
  });
});
server.listen(8800, () => {
  console.log("Backend server is running!");
});