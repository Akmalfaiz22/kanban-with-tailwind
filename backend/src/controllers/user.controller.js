import { asyncHandler } from "../utils/asynHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apierror.js";
import { ApiResponse } from "../utils/apiresponse.js";
import  jwt  from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessAndRefreshTokens = async(userId)=>
{
    try {
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave:false })
        return { accessToken, refreshToken }

    } catch (error) {
         console.log("TOKEN ERROR =>", error);
        throw new ApiError(500, 
        "Something went wrong while generating referesh and access token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
     
    // 1.get user detail from frontend.
    const {userName, email, fullName, password } = req.body 
// 2.validation not empty.

    // if (fullName === "") {
    //     throw new apierror(400, "fullname is required")
    // }else if (email === "") {
    //     throw new apierror(400, "email is required")
    // }else if (userName === "") {
    //     throw new apierror(400, "username is required")
    // }else if (password === "") {
    //     throw new apierror(400, "password is required")
    // }

    if (
        [fullName, email, userName, password].some((field) =>
        field?.trim() === "")
    ) {
            throw new ApiError(400, "All fields are required")
    }
    // uper if else and this method work same 
    
// 3.check if user already exists: check username and email.

    const existUser = await User.findOne({
        $or : [{userName},{email}]
    })
    if (existUser) {
        throw new ApiError(409, "user exist already")
    }

// 4.create user object cteate entry in  bd.

const user = await User.create({
    fullName,
    email,
    password,
    userName: userName.toLowerCase()
 })

 // 5.remove password and refresh token filed frono tesponse.

 const createUser = await User.findById(user._id).select(
    "-password -refreshToken"
 )

 // 6.check for user creation
 if (!createUser) {
    throw new ApiError(500, "Somthisng went wrong")
 }

 // 7.return response.

 return res.status(201).json(
    new ApiResponse(200, createUser, "user register successfully")
 )

})

const loginUser = asyncHandler(async (req, res) =>{

// 1.req body => data  
    const {userName, email, password} = req.body

// 2. Username or Email      
    if (!(userName || email)) {
        throw new ApiError(400, "username or email is required")
    }

// 3.Find user    
   const user = await User.findOne({
        $or: [{userName}, {email}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    
// 4.Password check    
    const isPasswordValid = await user.isPasswordCorrect(password)
     if (!isPasswordValid) {
        throw new ApiError(401, "Password incorrect")
    }

// 5.Access and Refresh token    
    const {accessToken, refreshToken} = await 
    generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id)
    .select("-password -refreshToken")
     
// 6.Send cookie    
    const options = {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
        //   sameSite: "lax",
        //   path: "/"
    }

    return res.status(200)
    .cookie("accessToken", accessToken ,options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200,
        {
            user:loggedInUser,accessToken,refreshToken
        },
        "User login successfully"
    ))
})   

const logoutUser = asyncHandler(async(req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    {
        $unset:{
            refreshToken: 1
        }
    },
    {
        new: true
    }
  )

  const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
    }
    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
}) 

const refreshAccessToken = asyncHandler(async(req, res) => {
   const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken

   if(!incomingRefreshToken){
      throw new ApiError(401, "unauthorized request")
   }
   
   try {
        const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
       )

      const user = await User.findById(decodedToken?._id)

       if(!user){
         throw new ApiError(401, "Invalid refresh token")
       }

       if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401, "Refresh token is expired or used")
       }

       const options = {
           httpOnly: true,
           secure: process.env.NODE_ENV === "production",
       }

       const {accessToken, refreshToken} = 
        await generateAccessAndRefreshTokens(user._id);

       return res.status(200)
       .cookie("accessToken", accessToken, options)
       .cookie("refreshToken", refreshToken, options)
       .json(
           new ApiResponse(
               200,
               {accessToken, refreshToken},
               "Access token refresh"
           )
       )
   } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
   }
})

const changeCurrentPassword = asyncHandler(async(req, res) =>{
  const {oldPassword, newPassword} = req.body

  if(newPassword.length < 8 || newPassword.length > 15 ){
    throw new ApiError(400, "Password must be between 8 and 15 characters")
  }

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.
    isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
      throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword
    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password change successfully"))
 
})

const getCurrentUser = asyncHandler(async(req, res) =>{
    return res.status(200)
    .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

const updateAccountDetails = asyncHandler(async(req, res) => {
    const {fullName, email} = req.body

    if (!fullName || !email) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
           $set: {
              fullName: fullName,
              email: email
           }
        },{new: true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"))
})
export {
    registerUser,loginUser,
    logoutUser, refreshAccessToken,
    changeCurrentPassword, getCurrentUser,
    updateAccountDetails,
 }