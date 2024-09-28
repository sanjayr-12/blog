const Auth = require("../models/authModel");
const jwt = require("jsonwebtoken");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ error: "Unauthorizedh" });
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    if (!verify) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const user = await Auth.findById(verify.userId).select("-password");
    req.user = user;
      next();
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = protectRoute
