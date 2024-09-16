import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//Get all the registered users
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password");
    if (!users || users.length === 0) {
      throw new ApiError(404, "NO Users found");
    }
  
    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users data fetched successfully"));
  });

//Get the user by id to update
const getUserToUpdate = asyncHandler(async(req, res)=>{
    const id = req.params.id;
  
    const user = await User.findOne({_id:id}).select('-password')
  
    if(!user){
      throw new ApiError(404, "NO Userfound");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, user, "User Updated successfully"));
  })

//Update the user by id
const updateUser = asyncHandler ( async (req, res) =>{
    const id = req.params.id;
  
    const updatedUserData = req.body;
    
    const user = await User.updateOne({_id : id}, {
      $set: updatedUserData
    })
    return res
    .status(200)
    .json(new ApiResponse(200, user, "User Updated successfully"));
  
  })

//Delete the user by id
const deleteUser = asyncHandler(async (req, res) =>{

    const id = req.params.id;
    
    const user = await User.deleteOne({_id: id});
  
    if(!user){
      throw new ApiError(404, "NO User found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, user, "User Deleted successfully"));
  })


export {getAllUsers, getUserToUpdate, updateUser, deleteUser}