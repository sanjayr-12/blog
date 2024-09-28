const mongoose = require("mongoose")

const authModel = mongoose.Schema({
    user: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        minLength:6
    }
})

const Auth = mongoose.model("Auth", authModel)

module.exports = Auth