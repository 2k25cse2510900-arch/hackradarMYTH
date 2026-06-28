const userService = require("../services/user.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getProfile = asyncHandler(async (req, res) => {
  const profile = await userService.getProfile(req.user);
  res.status(200).json(new ApiResponse(200, { profile }, "Profile fetched"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await userService.updateProfile(req.user, req.body);
  res.status(200).json(new ApiResponse(200, { profile }, "Profile updated"));
});

module.exports = {
  getProfile,
  updateProfile,
};
