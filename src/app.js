const express = require("express");

const app = express();

app.use("/home",(req,res) => {
    res.send("Welcome to the Home ");
})

app.use("/contact",(req,res)=> {
    res.send("Welcome to the conctact page");
})

app.use("/",(req,res) =>{
    res.send("Welcome to the server");
})

app.listen(5000, ()=>{
    console.log("server will be listen at port 5000...");
})