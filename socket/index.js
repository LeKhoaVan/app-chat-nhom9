const io = require("socket.io")(8900, {
  cors: {
    origin: "http://localhost:3000",
  },
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
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
  socket.on("sendMessage", function({ senderId, receiverId, text }) {
    
    const user43 = getUser(receiverId); // gán cho 1 giá trị như vậy sẽ bị lỗi, nên dùng cả hàm || trừ khi có đăng nhập 
    //console.log(user)
    if(user43 == undefined){
      console.log("user offline");
    }
    else {
      io.to(getUser(receiverId).socketId).emit("getMessage", {
        senderId,
        text,
      });
    }
    
  });

  //when disconnect
  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});
