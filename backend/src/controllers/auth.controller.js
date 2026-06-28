const passport = require("passport");

const authService = require("../services/auth.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const env = require("../config/env");

const register = asyncHandler(async (req, res) => {
  const data = await authService.register(req.body);
  res.status(201).json(new ApiResponse(201, data, "Registration successful"));
});

const login = asyncHandler(async (req, res) => {
  const data = await authService.login(req.body);
  res.status(200).json(new ApiResponse(200, data, "Login successful"));
});

const googleLogin = (req, res, next) => {
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
};

const googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (error, user) => {
    if (error || !user) {
      return next(error || new ApiError(401, "Google authentication failed"));
    }

    const data = authService.buildAuthPayload(user);
    const redirectUrl = new URL(env.frontendUrl);
    redirectUrl.searchParams.set("token", data.token);
    return res.redirect(redirectUrl.toString());
  })(req, res, next);
};

const logout = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, null, "Logout successful"));
});

const me = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, { user: req.user }, "Current user fetched"));
});

module.exports = {
  register,
  login,
  googleLogin,
  googleCallback,
  logout,
  me,
};
