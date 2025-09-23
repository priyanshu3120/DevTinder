const express = require("express");

const app = express();
// Handling the multiple routes
app.use("/user",(req,res,next)=>{
    console.log("print the respond 1st");
    next();
    //res.send("1st Respond!!");
},
(req,res,next)=>{
    console.log("print the respond 2nd");
    //res.send("2nd Respond!!");
    next();
},
(req,res,next)=>{
    console.log("print the respond 3rd");
    res.send("3rd Respond!!");
    //next();
}
)

app.listen(5000, ()=>{
    console.log("server will be listen at port 5000...");
})