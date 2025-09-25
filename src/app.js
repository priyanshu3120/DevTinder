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

