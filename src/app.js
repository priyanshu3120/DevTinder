const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

app.post("/signup", async(req,res)=>{
    
    try{
        // validation of data
        validateSignUpData(req);
        // Encrypt the password
        const {firstName,lastName,emailId,password,gender} = req.body;
        
        const passwordHash = await bcrypt.hash(password,10); // Encrypt the password at 10 times
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
            gender,
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
      const isPasswordValid = await bcrypt.compare(password,user.password);
      if(isPasswordValid){
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
// find the user by providing some data
app.get("/user",async(req,res)=>{
    const userEmail = req.body.emailId;
    try{
    const user = await User.find({emailId: userEmail}); //find the specific user
    if(user.length ===0){
        res.status(404).send("user not found");
    }
    else{
        res.send(user);
    }
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
});
// find all the user 
app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({}); // print the all users
        res.send(users);
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
});
// find user by an id
app.get("/id",async(req,res)=>{
    try{
        const id="68d45bd761f04d99bd8960c6"
        const users = await User.findById(id);
        res.send(users);
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
});
// delete user from database
app.delete("/user",async(req,res)=>{
    const userId=req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("Data deleted sucessfully");
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
});
// update the user data by the help of userId
app.patch("/user/:userId",async(req,res)=>{
    const userId = req.body.params?.userId;
    const data = req.body;
    try{
        const Allowed_Updates = [
            "gender","age","photoUrl","skills","about"
        ];
        const isUpdateAllowed = Object.keys(data).every((k)=>
            Allowed_Updates.includes(k)
        );
        if(!isUpdateAllowed)
        {
            throw new Error("Update not allowed");
        }
        if(data?.skills.length > 10)
        {
            throw new Error("skills cannot more than 10");
        }
        const user = await User.findByIdAndUpdate(userId,data,{
        runValidators:true,
        });
        res.send("update data sucessfully");
    }
    catch(err){
        res.status(404).send("Updation Failed: " +err.message);
    }
});
// update the user data by the help of emailId
app.patch("/user1",async(req,res)=>{
    const userEmail = req.body.emailId;
    const data = req.body;
    try{
        await User.findOneAndUpdate({emailId: userEmail},data);
        res.send("update data sucessfully");
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
});

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

