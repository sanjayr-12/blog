const express = require("express");
const protectRoute = require("../protect/protectRoute");
const { getAll, getOne, createPost, editPost, deletePost } = require("../controllers/postController")



const router = express.Router()


router.get("/", getAll);
router.get("/:slug", getOne);
router.post("/create", protectRoute, createPost);
router.patch("/edit/:id", protectRoute, editPost);
router.delete("/delete/:id", protectRoute, deletePost);


module.exports = router