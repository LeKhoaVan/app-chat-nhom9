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
    }).sort({updatedAt:-1}) ;
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update time conv 
router.put("/updateAt", async (req, res) => {
 
  try{
    const result = await Conversation.findByIdAndUpdate(
      req.body.convId, 
      {"updatedAt": Date.now()})

    res.status(200).json(req.body.id);
  }catch (err) {
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

//update name
router.put("/updateName", async (req, res) => {
  try{
    const result = await Conversation.findByIdAndUpdate(
      req.body.id, 
      {"name": req.body.name})
    res.status(200).json(req.body.id);
  }catch (err) {
    res.status(500).json(err);
  }
});
//update Avt 
router.put("/updateAvt", async (req, res) => {
  try{
    const result = await Conversation.findByIdAndUpdate(
      req.body.id, 
      {"img": req.body.img})
    res.status(200).json(req.body.id);
  }catch (err) {
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
    res.status(500).json(err.message);
  }
});

router.get("/findMesLatest/", async(req, res) =>{
  
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
      { $pull: { "members": req.body.userId ,"authorization": req.body.userId},
      }
      , { new: true })

    res.status(200).json(conversation.members)
  }
  catch(err){
    res.status(500).json({message: result});
  }
})


router.put('/addMember', async (req, res) => {
  try{
    
		const postUpdateCondition = { _id: req.body.conId }

    const conversation = await Conversation.findOneAndUpdate(postUpdateCondition,
      { $push: { "members": {$each: req.body.userId }} }
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
    res.status(500).json(err.message);
  }
});

//new conv_group
router.post("/newConvGroup", async (req, res) => {

  const {  members  ,
      name  ,
      authorization,img } = req.body
  
  //const newConvGroup = new ConversationGroup(req.body)


   const newConversationGroup = new Conversation({members,name,authorization,img})

  try {
    const savedConversationGroup = await newConversationGroup.save();
    res.status(200).json(savedConversationGroup);

  //   const savedConvGr = await newConvGroup.save();
  // res.status(200).json(savedConvGr);

  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/deleteCon", async (req, res) => {
  try {
    const condition = { _id: req.body.convId}
    const conversation = await Conversation.findOneAndDelete(condition);
    res.status(200).json(conversation);
  }
  catch(err){
    res.status(500).json(err.message);
  }
})




router.get("/findConvByUserID/:converID/:userIdFind", async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.converID,
      members: req.params.userIdFind,
    });
    if(conversation){
      //return res.status(400).json({ success: false, message: 'Thành viên đã có trong nhóm' });
      res.status(200).json(conversation);
    }else{
      res.status(200).json('false');
    }
    
  } catch (err) {
    res.status(500).json(err.message);
  }
});



module.exports = router;
