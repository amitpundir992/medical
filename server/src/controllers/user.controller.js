import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    return accessToken;
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating  access token"
    );
  }
};

//Register User
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const existedEmail = await User.findOne({ email });
  if (existedEmail) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password");

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

//Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User with email does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials");
  }

  const accessToken = await generateToken(user._id);

  const loggedInUser = await User.findById(user._id).select("-password");

  //By using options only server can modify this cookie front end can only read this but can't modify this
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User logged in Successfully"
      )
    );
});

//Logout User
const logoutUser = asyncHandler(async (req, res) => {
  await User.findById(req.user._id);

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

//Change Current password
const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed Successfully"));
});

//Get the data of current user
const getCurrentUser = asyncHandler(async (req,res)=>{
  return res
  .status(200)
  .json(new ApiResponse(200, req.user, "current user fetched successfully"))
})

//update the data of current user
const updateAccountDetails = asyncHandler(async (req, res)=>{
  const {username, email} = req.body

  if(!username || !email){
      throw new ApiError(400,"All fields are required")
  }

  const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
          $set: {
              username,
              email: email
          }
      },
      {new: true}
  ).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, user, "Account details updated successfully"))
})

export { registerUser, loginUser, logoutUser, changeCurrentPassword, getCurrentUser, updateAccountDetails };
