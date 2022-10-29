const router = require("express").Router();
const Message = require("../models/Message");

var cors = require('cors');
router.use(cors());
//add

router.post("/", async (req, res) => {
  const newMessage = new Message(req.body);

  try {
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/del", async (req, res) => {
 
  try{
    const result = await Message.findByIdAndUpdate(
      req.body.id, 
      {"delUser": req.body.delUser})

    res.status(200).json(req.body.id);
  }catch (err) {
    res.status(500).json(err);
  }
    
  
}); 

router.delete("/", async (req, res) => {
    //req.body.id
    try {
      await Message.findByIdAndDelete(req.body.id);
      res.status(200).json("delete message successfull");
    } catch (err) {
      return res.status(500).json(err);
    }
  
});




module.exports = router;
