const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect(
      "mongodb+srv://Priyanshu:R5!7McbLVjPapEP@cluster0.qb8vf2r.mongodb.net/devTinder"
    );
}; 

module.exports = connectDB;
