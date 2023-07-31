import asyncHandler from "express-async-handler";
import User from "../models/userModels.js";
import generateToken from "../utils/generateToken.js";

// auth user
// POST api/users/auth
//access public
const authUser = asyncHandler(async (req, res) => {
  console.log("auth body", req.body);
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(200).json({
      success: true,
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// Register user
//POST api/users
//access public
const registerUser = asyncHandler(async (req, res) => {
  console.log("body: ", req.body);
  const { name, email, password, confirmPassword } = req.body;
  if(!email){
    res.status(400);
    throw new Error("Please enter Email");
  }
  if(!name){
    res.status(400);
    throw new Error("Please enter Name");
  }
  if(!password){
    res.status(400);
    throw new Error("Please enter Password");
  }
  if(password !== confirmPassword){
    res.status(400);
    throw new Error("Passwords do not match");
  }
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  const user = await User.create({ name, email, password, confirmPassword });

  if (user) {
    res.status(201).json({
      success: true,
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Logout user
// POST api/users/logout
//access public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie('jwt', '', {
    httpOnly: true,
    expires: new Date(),
  });
  res.status(200).json({
    success: true,
    message: 'User Logged out'
  })
});

// Get User Profile
//GET api/users/profile
//access private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    success: true,
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  }
  res.status(200).json(user);
});

// Update User Profile
//PUT api/users/profile
//access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if(user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if(req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
    })
  }
  else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
};
