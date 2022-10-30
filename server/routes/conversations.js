const router = require("express").Router();
const Conversation = require("../models/Conversation");
var ObjectId = require('mongodb').ObjectId; 
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


router.put('/updateImg/:id', function(req,res){
  var conditions={_id:req.params.id};
  Conversation.update(conditions,req.body)
  .then(doc =>{
      if(!doc){return res.status(404).end();}
      return res.status(200).json(doc);
  })
  .catch(err=>next(err));
})


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
router.put('/setAuthorize', async (req, res) => {
  try{
    
		const postUpdateCondition = { _id: req.body.conId }

    const conversation = await Conversation.findOneAndUpdate(postUpdateCondition,
      { $push: { "authorization": req.body.userId } }
      , { new: true })

    res.status(200).json(conversation.authorization)
  }
  catch(err){
    res.status(500).json({message: "false"});
  }
})

router.put('/removeAuthorize', async (req, res) => {
  try{
    
		const postUpdateCondition = { _id: req.body.conId }

    const conversation = await Conversation.findOneAndUpdate(postUpdateCondition,
      { $pull: { "authorization": req.body.userId } }
      , { new: true })

    res.status(200).json(conversation.authorization)
  }
  catch(err){
    res.status(500).json({message: result});
  }
})

router.put('/removeMember', async (req, res) => {
  try{
    
		const postUpdateCondition = { _id: req.body.conId }

    const conversation = await Conversation.findOneAndUpdate(postUpdateCondition,
      { $pull: { "members": req.body.userId } }
      , { new: true })

    res.status(200).json(conversation.members)
  }
  catch(err){
    res.status(500).json({message: result});
  }
})

router.get("/", async (req, res) => {
  const conId = req.query.conId;
  try {
    const conversation = await Conversation.findById(conId);
    res.status(200).json(conversation.authorization);
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;
