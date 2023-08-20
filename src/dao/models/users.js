import mongoose from "mongoose";

const userCollection = "Users"

const Documents = new mongoose.Schema({
    name: String,
    reference: String,
  });

const userSchema = new mongoose.Schema({
    first_name: String, 
    last_name: String,
    carrito: {type: mongoose.Schema.Types.ObjectId, ref:"carrito"}, 
    email: String,
    password: String,
    rol:{type: String, default:"user"},
    documents: [Documents]
})

const userModel = mongoose.model(userCollection, userSchema)

export default userModel;