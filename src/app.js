const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middleware/auth");
const app = express();

app.use(express.json()); // middleware
app.use(cookieParser());

app.post("/signup", async(req,res)=>{
    
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

app.post("/login",async(req,res)=>{
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

app.get("/profile", userAuth ,async(req,res)=>{
    try{
        const user =req.user;
        res.send(user);
    }
    catch(err){
        res.status(404).send("ERROR : " + err.message);
    }
});

app.post("/sendConnectionRequest", userAuth , async(req,res)=>{
    const user = req.user;
    res.send(user.firstName +" " +"send the connection request");
})

connectDB()
.then(()=>{
    console.log("Database connection established..");

    app.listen(5000, ()=>{
    console.log("server will be listen at port 5000...");
   })
})
.catch((err) => {
    console.error("Database cannot be connected!!");
})

