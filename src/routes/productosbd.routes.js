import { Router } from "express";
import ProductoBd from "../dao/dbManagers/productos.js";


const productManager = new ProductoBd()
const routerProductBd = Router()


routerProductBd.get("/", async (req, res) =>{
    let productos = await productManager.getAll()
    res.json({status: "success", payload : productos})
})
routerProductBd.post("/", async(req,res)=>{
    const {title, description,code,price,status,stock,category} = req.body
    let nuevoProducto = await productManager.createProduct({
       title,
       description,
       code,
       price,
       status,
       stock,
       category
    })
    res.json({status:"success", payload: nuevoProducto})
}) 

routerProductBd.get("/:id", async (req, res) =>{
    let id =req.params.id
    let producto = await productManager.getProductById(id)
    res.json({status:"success",payload: producto})
})

routerProductBd.delete("/:id", async (req, res) =>{
    let id =req.params.id
    let producto = await productManager.deleteProductById(id)
    res.json({status:"success",payload: producto})
})


export default routerProductBd