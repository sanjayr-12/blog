const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')
const app = express()
const authRoutes = require("./routes/auth.routes")
const postRoutes = require("./routes/post.routes")
const cookieParser = require("cookie-parser")

dotenv.config()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());   
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/post", postRoutes)

//connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("db connected");
    } catch (error) {
        console.log(error.message);
    } 
}

app.listen(process.env.PORT, () => {
    connectDB()
    console.log("server started");
})