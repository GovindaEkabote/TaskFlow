import { asyncHandler } from "../middlewares/asyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "../services/emailService.js";
import { generateForgotPasswordTemplate } from "../utils/emailTemplet.js";
import { generateToken } from "../utils/genarateTokens.js";
import crypto from "crypto";

//Register
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }
  let user = await User.findOne({ email });
  if (user) {
    return next(new ErrorHandler("User Already Exists", 409));
  }
  user = new User({ name, email, password, role });
  await user.save();
  generateToken(user, 201, "User register successfully", res);
});

export const login = asyncHandler(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }
  let user = await User.findOne({ email, role }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email aand password", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }
  generateToken(user, 200, "Login successful", res);
});

export const getUser = asyncHandler(async (req, res, next) => {
  const users = await User.find();

  if (users.length === 0) {
    return next(new ErrorHandler("No users found", 404));
  }

  res.status(200).json({
    success: true,
    count: users.length,
    users,
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

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  const message = generateForgotPasswordTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      to: user.email,
      subject: "FYP SYSTEM - Password Reset Request",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message || "Cannot send email", 500));
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Invalid or expired password reset token", 400)
    );
  }

  const { password, confirmPassword } = req.body;

  if (!password || !confirmPassword) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  if (password !== confirmPassword) {
    return next(new ErrorHandler("Passwords do not match", 400));
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  generateToken(user, 200, "Password reset successfully", res);
});
