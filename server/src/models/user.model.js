import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        password:{
            type:String,
            required: true,
        },
        isAdmin:{
            type: Boolean,
            default: false,
        }

    },
    {timestamps: true}
)

//bcrypt and compare password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next();

    this.password= await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}


// jWT token
userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            username: this.username,
            email: this.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}






export const User = mongoose.model("User", userSchema)