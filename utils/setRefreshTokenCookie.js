const setRefreshTokenCookie = (res, refresh_token) => {
  res.cookie("refresh_token", refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensures HTTPS in production,
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7days in milliseconds
  });
};

export default setRefreshTokenCookie;
