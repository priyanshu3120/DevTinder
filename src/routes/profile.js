const express = require("express");
const profileRouter = express.Router();
const bcrypt =require("bcrypt");
const User = require("../models/user");

const {userAuth} = require("../middleware/auth");
const {validateEditProfileData} = require("../utils/validation");

profileRouter.get("/profile/view", userAuth ,async(req,res)=>{
    try{
        const user =req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req,res)=>{
    try{
         if(!validateEditProfileData(req)){
            throw new Error("Invalid Edit Request");
         }
         const loggedInUser = req.user;

         Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key] ));
         
         await loggedInUser.save();

         res.json(
            {message: `${loggedInUser.firstName} your profile updated successfully!!`,
            data: loggedInUser,
    });
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
});

profileRouter.patch("/forget-password", async(req,res)=>{
    try{
        const {emailId , password} = req.body;

        if(!emailId || !password){
            throw new Error("Email and password is required");
        }
        const user = await User.findOne({emailId});
        if(!user){
            throw new Error("User not found");
        }

        const hashPassword = await bcrypt.hash(password,10);
        user.password = hashPassword;
        await user.save();

        res.json({message: "password updated successfully!!"});
    }
    catch(err){
        res.status(404).send("ERROR : " +err.message);
    }
})


module.exports = profileRouter;