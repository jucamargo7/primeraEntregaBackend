import mongoose from "mongoose";

const userCollection = "Users"

const Documents = new mongoose.Schema({
    name: String,
    reference: String,
  });

const userSchema = new mongoose.Schema({
    first_name: String, 
    last_name: String, 
    email: String,
    password: String,
    rol:{type: String, default:"user"},
    documents: [Documents]
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel;