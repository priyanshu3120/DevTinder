const express = require("express");

const app = express();

app.get("/user",(req,res)=>{
    res.send({name:"priyanshu",age:23,course:"btech"});
})

app.post("/user",(req,res)=>{
    res.send("your data will be saved in database");
})

app.delete("/user",(req,res)=>{
    res.send("your data deleted sucessfully");
})

app.use("/",(req,res) =>{
    res.send("Welcome to the server");
})

app.listen(5000, ()=>{
    console.log("server will be listen at port 5000...");
})