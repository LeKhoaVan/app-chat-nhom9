const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

var cors = require('cors');
router.use(cors());

//update user
router.put("/:id", async (req, res) => {
  if (req.body.usersId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can update only your account!");
  }
});



//update profile
router.put('/updateProfile/:id', async (req, res) => {
  try {
     const userupdate =await User.findByIdAndUpdate(req.params.id, req.body)
     .exec().then(()=>{
    res.status(200).json({
      success: true,
      message: 'User is updated',
      updateUser: req.body,
    });
  })
    
    

  } catch(err) {
      console.error(err.message);
      res.send(400).send('Server Error');
  }
});



//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("You can delete only your account!");
  }
});

//get a user
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username, status: 0 });
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//getAllUser
router.get("/getAll", async (req, res) => {
  try {
    const user = await User.find({});
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a user
router.get("/userByMailOrName", async (req, res) => {
  const email = req.query.email;
  const username = req.query.username;
  try {
    const user = email
      ? await User.findOne({ email: email, status: 0 })
      : await User.findOne({ username: username, status: 0 });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get name a user
router.get("/name", async (req, res) => {
  const userId = req.query.userId;
  try {
    const user = await User.findById(userId);

    const { password, following, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get friends
router.get("/friends/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user.friends)
  } catch (err) {
    res.status(500).json(err);
  }
});
//get receiveFrs
router.get("/receiveFrs/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user.receiveFrs)
  } catch (err) {
    res.status(500).json(err);
  }
});
//get sendFrs
router.get("/sendFrs/:userId", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    res.status(200).json(user.sendFrs)
  } catch (err) {
    res.status(500).json(err);
  }
});


//follow a user

router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { followings: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you allready follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
});

//unfollow a user

router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { followings: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
});


router.put('/update', async (req, res) => {

  // const {  _id , email  , username , birthday , gender , avt} = req.body
  // try{


  //   const user = await User.findOne({ email })
  //   if(user){
  //       return res.status(400).json({ success: false, message: 'Email đã tồn tại' });
  //   }
  //   const userName = await User.findOne({ username })
  //   if(userName){
  //       return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
  //   }

  // 	const postUpdateCondition = {_id}

  // 	const userUpdate = await User.findOneAndUpdate(postUpdateCondition, { 
  // 		$set:{"username": username , "email":email,"avt":avt , "birthday":birthday , "gender": gender}
  // 	}
  // 	, { new: true })

  // 	res.json({success: true, message: 'Thành công'})
  // }
  // catch (error) {
  // 	console.log(error)
  // 	res.status(500).json({ success: false, message: 'Internal server error' })
  // }
})

//Accept Add Friend
router.put("/:id/acceptFriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.friends.includes(req.body.userId)) {
        await user.updateOne({ $push: { friends: req.body.userId } });
        await user.updateOne({ $pull: { receiveFrs: req.body.userId } });
        await currentUser.updateOne({ $push: { friends: req.params.id } });
        await currentUser.updateOne({ $pull: { sendFrs: req.params.id } });
        res.status(200).json("user has been accept friend");
      } else {
        res.status(403).json("you allready accept this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant accept yourself");
  }
});
//cancel Add Friend
router.put("/:id/cancelAddFriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      await user.updateOne({ $pull: { receiveFrs: req.body.userId } });
      await currentUser.updateOne({ $pull: { sendFrs: req.params.id } });
      res.status(200).json("user has been recall friend");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant recall yourself");
  }
});
//remove Friend
router.put("/:id/removeFriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (user.friends.includes(req.body.userId)) {
        await user.updateOne({ $pull: { friends: req.body.userId } });
        await currentUser.updateOne({ $pull: { friends: req.params.id } });
        res.status(200).json("user has been remove friend");
      } else {
        res.status(403).json("not friend");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant remove friend yourself");
  }
});

//Send Add Friend
router.put("/:id/SendAddFriend", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!user.sendFrs.includes(req.body.userId)) {
        await user.updateOne({ $push: { sendFrs : req.body.userId } }); 
        await currentUser.updateOne({ $push: { receiveFrs : req.params.id } });
        res.status(200).json("user has been send add friend");
      } else {
        res.status(403).json("you allready send add friend this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant accept yourself");
  }
});

module.exports = router;
