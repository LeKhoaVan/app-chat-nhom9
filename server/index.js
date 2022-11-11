
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const multer = require("multer");
const http = require('http');
const socketio = require('socket.io');

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
// const io = require("socket.io")(8900, {
//   cors: {
//     origin: "http://localhost:9000",
//   },
// });
const server = http.createServer(app);
const io = socketio(server,{
  cors: {
    origin: ["http://localhost:9000","exp://192.168.74.90:19000"],
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
  socket.on("sendMessage", function({ senderId, receiverIds, text,type, conversationId,delUser,date,username }) {

      // const ds = []
      
      // receiverIds.forEach(function(receiverId){
      //   ds.push(getUser(receiverId).socketId)
      // })
      // ds.push(receiverId)
      receiverIds.forEach(function(room){
        if( getUser(room) == undefined){
          console.log("user offline,users online:",users);
        }
        else {
          io.to(getUser(room).socketId).emit("getMessage", {
            senderId,
            text,
            type,
            conversationId,
            delUser,
            date,
            username,
          });
          console.log('Sento:',getUser(room).userId,'conten:',text);
        }
      });
    
  });

  //update status
  socket.on("sendStatus", function({senderId,username,receiverIds,type,text,conversationId,delUser,date}) {

    // const ds = []
    
    // receiverIds.forEach(function(receiverId){
    //   ds.push(getUser(receiverId).socketId)
    // })
    // ds.push(receiverId)
    receiverIds.forEach(function(room){
      if( getUser(room) == undefined){
        console.log("user offline");
      }
      else {
        io.to(getUser(room).socketId).emit("getStatus", {
          senderId,
          text,
          type,
          conversationId,
          delUser,
          date,
          username,
        });
      }
    });
  
});



  //delete message
  socket.on("deleteMessage", function({messagesCurrent, messageId, senderId, receiverIds, text }) {

    receiverIds.forEach(function(room){
      if( getUser(room) == undefined){
        console.log("user offline,users online:",users);
      }
      else {
        io.to(getUser(room).socketId).emit("delMgs", {
          messagesCurrent,
          messageId,
          senderId,
          text,
        });
      }
    });
  
  });

  socket.on("recallMessageStatus", function({senderId,username,receiverIds,type,text,conversationId,delUser,date}) {

    receiverIds.forEach(function(room){
      if( getUser(room) == undefined){
        console.log("user offline");
      }
      else {
        io.to(getUser(room).socketId).emit("recallMgsStatus", {
          senderId,
          text,
          type,
          conversationId,
          delUser,
          date,
          username,
        });
      }
    });
  
  });

  // socket.on("authorize", function(data) {
   
  //       io.emit("getAu", data );
  // });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
server.listen(8800, () => {
  console.log("Backend server is running!");
});