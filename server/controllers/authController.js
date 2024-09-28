const Auth = require("../models/authModel");
const bcrypt = require("bcrypt");
const generateToken = require("../authToken/token");

const signup = async (req, res) => {
  try {
    const { user, email, password } = req.body;
    const emailCheck = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailCheck.test(email)) {
      return res.status(400).json({ error: "email format is not valid" });
    }
    const existingEmail = await Auth.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "email already exists" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "password must be atleast 6 characters long" });
    }

    //salt the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new Auth({
      user,
      email,
      password: hash,
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(200).json({
        _id: newUser._id,
        user: newUser.user,
        email: newUser.email,
      });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "server error" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const emailCheck = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailCheck.test(email)) {
      return res.status(400).json({ error: "email format is not valid" });
    }
    const existEmail = await Auth.findOne({ email });
    const checkPassword = await bcrypt.compare(
      password,
      existEmail?.password || ""
    );
    if (!existEmail || !checkPassword) {
      return res.status(400).json({ error: "invalid email or password" });
    }
    generateToken(existEmail._id, res);
    res.status(200).json({
      _id: existEmail._id,
      user: existEmail.user,
      email: existEmail.email,
    });
  } catch (error) {
    console.log("error in login", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "internal server error" });
  }
};

const verifyme = async (req, res) => {
  try {
    const { id } = req.params; // ID from local storage
    const { _id } = req.user; // ID from JWT
    const userId = _id.toString();

    if (id !== userId) {
      return res.status(400).json({ error: "User mismatch" });
    }

    const user = await Auth.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      user: user.user,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { signup, login, logout, verifyme };
