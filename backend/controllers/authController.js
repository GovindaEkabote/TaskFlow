import { asyncHandler } from "../middlewares/asyncHandler";
import { errorHandler } from "../middlewares/error";

//Register
export const registerUser = asyncHandler(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) {
    return next(new errorHandler("Please provide all required fields", 400));
  }
  let user = await User
});
