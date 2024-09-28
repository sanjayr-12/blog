const express = require("express");
const { signup, login, logout, verifyme } = require("../controllers/authController");
const protectRoute = require("../protect/protectRoute");



const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/verifyme/:id",protectRoute, verifyme)

module.exports = router;
