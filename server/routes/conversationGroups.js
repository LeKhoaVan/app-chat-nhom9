const router = require("express").Router();
const ConversationGroup = require("../models/ConversationGroup");
var cors = require('cors');
router.use(cors());

//new conv_group
router.post("/newConvGroup", async (req, res) => {

    // const {  members  ,
    //     name  ,
    //     authorization } = req.body
    
    const newConvGroup = new ConversationGroup(req.body)

    // const members = req.body;
    // const name = req.body;
    // const authorization = req.body;
    // const newMemberOfGroup = new NewMemBerOfGroup(members);
    // const newNameOfGroup = new NewNameOfGroup(name);
    // const authorizationGroup = new AuthorizationGroup(authorization);

     //const newConversationGroup = new ConversationGroup({members,name,authorization})
  
    try {
      // const savedConversationGroup = await newConversationGroup.save();
      // res.status(200).json(savedConversationGroup);

      // const savedMem = await newMemberOfGroup.save();
      // res.status(200).json(savedMem);
      // const savedName = await newNameOfGroup.save();
      // res.status(200).json(savedName);
      // const savedAuthorization = await authorizationGroup.save();
      // res.status(200).json(savedAuthorization);

      const savedConvGr = await newConvGroup.save();
    res.status(200).json(savedConvGr);

    } catch (err) {
      res.status(500).json(err);
    }
  });


module.exports = router;