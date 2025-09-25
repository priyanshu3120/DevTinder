const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const app = express();

app.use(express.json());

app.post("/signup", async(req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("Data added sucessfully");
    }
    catch(err){
        res.status(404).send("error will occured");
    }
})

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
})

app.get("/feed",async(req,res)=>{
    try{
        const users = await User.find({}); // print the all users
        res.send(users);
    }
    catch(err){
        res.status(404).send("Something went wrong");
    }
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

