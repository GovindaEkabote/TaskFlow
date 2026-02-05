import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
import ErrorHandler from "./error.js";
import { User } from "../models/user.model.js";

export const isAuthenticated = asyncHandler(async (req, resizeBy, next) => {
  const { token } = req.cookies;

  if (!token) {
    return new ErrorHandler("Please login before access the info", 401);
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    return new ErrorHandler("Invalid token", 401);
  }
});
