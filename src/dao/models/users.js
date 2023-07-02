import mongoose from "mongoose";

const userCollection = "Users"

const userSchema = new mongoose.Schema({
    first_name: String, 
    last_name: String, 
    email: String,
    password: String
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel;