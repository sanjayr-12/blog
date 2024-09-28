const mongoose = require("mongoose")

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Auth",
  },
  imgUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  slug: {
    type:String
  }
}, { timestamps: true });

const Post = mongoose.model("Post", postSchema)

module.exports = Post