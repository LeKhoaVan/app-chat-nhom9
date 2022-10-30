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


router.put('/:id', function(req,res){
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

module.exports = router;
