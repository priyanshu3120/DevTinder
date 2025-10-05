const mongoose = require("mongoose");
const validator = require("validator");
const jwt =require("jsonwebtoken");
const bcrypt =require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName: {
        type:String,
        required:true,
        minLength:4,
        maxLength:50,
    },
    lastName: {
        type:String,
        minLength:3,
        maxLength:50,
    },
    emailId: {
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value))
            {
                throw new Error("Invalid Email address: " +value);
            }
        },
    },
     password: {
        type:String,
        required:true,
        minLength:9,
        maxLength:500,
        validate(value){
            if(!validator.isStrongPassword(value))
            {
                throw new Error("Enter Strong Password: " +value);
            }
        }
    },
     gender: {
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    age: {
        type: Number,
        min:18,
    },
    photoUrl: {
        type: String,
        default:"https://static.vecteezy.com/system/resources/previews/014/720/398/non_2x/man-user-icon-avatar-in-clipart-vector.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new ErrorEvent("Invalid photo URL: " +value);
            }
        },
    },
    about: {
        type:String,
        maxLength:100,
        default:"This is default about the user",
    },
    skills: {
        type:[String],
    }
},
   {
    timestamps:true,
   }
);

userSchema.index({firstName: 1 });

userSchema.methods.getJWT = async function(){
    const user = this;

    const token = await jwt.sign({_id: user._id},"DEV@Tinder$#$#8043",
            {expiresIn:"7d"}
        );
    
    return token;        
};

userSchema.methods.validatePassword = async function(passwordInputByUser) {
    const user =this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser,passwordHash);

    return isPasswordValid;
}

module.exports= mongoose.model("User",userSchema);