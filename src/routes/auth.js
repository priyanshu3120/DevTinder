const express = require("express");
const authRouter = express.Router();

const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async(req,res)=>{
    
    try{
        // validation of data
        validateSignUpData(req);
        // Encrypt the password
        const {firstName,lastName,emailId,password} = req.body;
        
        const passwordHash = await bcrypt.hash(password,10); // Encrypt the password at 10 times
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("Data added sucessfully");
    }
    catch(err){
        res.status(404).send("Error :" +err.message);
    }
});

authRouter.post("/login",async(req,res)=>{
    try{
      const {emailId,password} = req.body;
      const user = await User.findOne({emailId: emailId});
      if(!user){
        throw new Error("Invalid credentials");
      }
      const isPasswordValid = await user.validatePassword(password);
      if(isPasswordValid){
        const token = await user.getJWT();
       
        res.cookie("token",token,{
            expires: new Date(Date.now() + 8 * 3600000),
        });
        res.send("login Successfully!!!");
      }
      else{
        throw new Error("Invalid credentials");
      }
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
});

authRouter.post("/logout", async(req,res)=>{
  res.cookie("token",null, {
    expires: new Date(Date.now()),
  });
  res.send("Logout successful!!");
});


module.exports = authRouter;