import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [15, "Password cannot exceed 15 characters"]
    },
    refreshToken: {
        type: String 
    },
},{timestamps: true})

userSchema.pre("save", async function (next){
    if (!this.isModified("password")) return
    this.password = await bcrypt.hash(this.password, 10)
})
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.genrateAccessToken = function(){
    return jwt.sign(
        {
        _id: this._id,
        userName: this.userName,
        fullName: this.fullName,
        email: this.email
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
      }
    )
}

userSchema.methods.genrateRefreshToken = function(){
    return jwt.sign(
        {
        _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
      }
    )
}

export const User = mongoose.model("User", userSchema)