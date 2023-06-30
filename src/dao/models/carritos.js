import mongoose from "mongoose";

const carritoCollection = "carrito"

const carritoSchema = new mongoose.Schema({
    productos: {
        type:[{
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            }
        }]
    }
})

export const carritoModel = mongoose.model(carritoCollection, carritoSchema)