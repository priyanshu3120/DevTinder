const express = require("express");
const requestRouter = express.Router();

const {userAuth} = require("../middleware/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth , async(req,res)=>{
    try{
         const fromUserId = req.user._id;
         const toUserId = req.params.toUserId;
         const status =req.params.status;

         const allowedStatus = ["ignored","interested"];
         if(!allowedStatus.includes(status)){
            res.status(404).json({message: " Invalid Status Type"+" " + status});
         }
         
         const toUser = await User.findById(toUserId);
         if(!toUser){
            return res.status(404).send({message: "User Not Found!!"});
         }
         const exitingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                {fromUserId, toUserId},
                {fromUserId: toUserId, toUserId: fromUserId},
            ],
         });
         if(exitingConnectionRequest){
                return res.status(404).send({message: "Connection Request Already Exit!!"});
            }

         const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status,
         });
         const data = await connectionRequest.save(); 

         res.json({messsage: " Connection Request Send Successfully!!",data});
    }
    catch(err){
        res.status(404).send("ERROR : " +err.message);
    }
})


module.exports = requestRouter;