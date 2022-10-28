const router = require("express").Router();
const Conversation = require("../models/Conversation");
var cors = require('cors');
router.use(cors());
//new conv

router.post("/", async (req, res) => {
  const newConversation = new Conversation({
    members: [req.body.senderId, req.body.receiverId],
  });

  try {
    const savedConversation = await newConversation.save();
    res.status(200).json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv of a user

router.get("/:userId", async (req, res) => {
  try { 
    const conversation = await Conversation.find({
      members: { $in: [req.params.userId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get conv by id
router.get("/findById/:convId", async (req, res) => {
  try {
    const conversation = await Conversation.findById({
       $in: [req.params.convId],
    });
    res.status(200).json(conversation.members);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get conv includes two userId

router.get("/find/:firstUserId/:secondUserId", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation)
  } catch (err) {
    res.status(500).json(err);
  }
});



//db.conversations.updateOne({"_id":ObjectId("6332d3704789cb1ac02c14d6")},{$push:{"authorization":"dangkhoa"}})
router.put('/:conId', async (req, res) => {

  try{
    await Conversation.updateOne({},{
      $push:{"authorization": req.params.UserId}
    })
    res.status(200).json({message: 'true'})
  }
  catch(err){
    res.status(500).json({message: 'false'});
  }

	//const { title, description, url, status } = req.body

	
	// try {
	// 	let updatedPost = {
	// 		title,
	// 		description: description || '',
	// 		url: (url.startsWith('https://') ? url : `https://${url}`) || '',
	// 		status: status || 'TO LEARN'
	// 	}

	// 	const postUpdateCondition = { _id: req.params.id, user: req.userId }

	// 	updatedPost = await Post.findOneAndUpdate(
	// 		postUpdateCondition,
	// 		updatedPost,
	// 		{ new: true }
	// 	)

		
	// } catch (error) {
	// 	console.log(error)
	// 	res.status(500).json({ success: false, message: 'Internal server error' })
	// }

})


module.exports = router;
