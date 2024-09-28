const Post = require("../models/postModel");
const Auth = require("../models/authModel");
const checkImageURL = require("../utils/imageUrlVerify");
const slugify = require("slugify")

const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    if (posts.length === 0) {
      return res.status(200).json([]);
    }
    res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const slug = req.params.slug;
    const post = await Post.find({ slug });
  
    if (post.length===0) {
      return res.status(400).json({ error: "no article found" });
    }
    res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const { imgUrl, title, content } = req.body;
    const userid = req.user._id;
    const user = await Auth.findById(userid);

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    if (!imgUrl || !title || !content) {
      return res.status(400).json({ error: "fields should not be empty" });
    }
     const response = checkImageURL(imgUrl);

      if (!response) {
        return res.status(400).json({ error: "image is not valid" });
      }

    const slug = slugify(title)

    const newPost = new Post({
      user: userid,
      imgUrl,
      title,
      content,
      slug
    });
    await newPost.save();
    res.status(200).json({message:"posted successfully"});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editPost = async (req, res) => {
  try {
    const { imgUrl, title, content } = req.body;
    const postId = req.params.id;
    const userid = req.user._id;
    const user = await Auth.findById(userid);
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({ error: "post not found" });
    }
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    if (post.user.toString() !== userid.toString()) {
      return res
        .status(400)
        .json({ error: "you are not authorized to edit this article" });
    }
    const updateOne = await Post.findOneAndUpdate(
      { _id: postId },
      { imgUrl, title, content },
      { new: true }
    );
    res.status(200).json(updateOne);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deletePost = async (req, res) => {
    try {
         const userid = req.user._id;
         const postId = req.params.id;
         const user = await Auth.findById(userid);
         const post = await Post.findById(postId);
         if (!post) {
           return res.status(400).json({ error: "post not found" });
         }
         if (!user) {
           return res.status(400).json({ error: "user not found" });
         }
         if (post.user.toString() !== userid.toString()) {
           return res
             .status(400)
             .json({ error: "you are not authorized to delete this article" });
         }

        const deleteOne = await Post.findByIdAndDelete(postId);
        res.status(200).json(deleteOne)
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
   
    
};

module.exports = { getAll, getOne, createPost, editPost,deletePost };
