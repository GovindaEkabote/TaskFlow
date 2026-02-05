import { asyncHandler } from "../middlewares/asyncHandler.js";
import { errorHandler } from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import { generateToken } from "../utils/genarateTokens.js";

//Register
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return next(new errorHandler("Please provide all required fields", 400));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new errorHandler("User Already Exists", 409));
  }
  user = new User({ name, email, password, role });
  await user.save();
  generateToken(user, 201, "User register successfully", res);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new errorHandler("Please provide all required fields", 400));
  }
  let user = await User.findOne({ email, role }).select("+password");
  if (!user) {
    return next(new errorHandler("Invalid email aand password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new errorHandler("Invalid email or password", 401));
  }
  generateToken(user, 200, "Login successful", res);
});

export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.find();
  if (!user) {
    return next(new errorHandler("No data", 404));
  }
  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(0), // immediately expire
      httpOnly: true,
      sameSite: "strict",
    })
    .json({
      success: true,
      message: "Logged out successfully",
    });
});
export const forgotPassword = asyncHandler(async (req, res, next) => {});
export const resetPassword = asyncHandler(async (req, res, next) => {});
