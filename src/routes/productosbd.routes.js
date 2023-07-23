import { Router } from "express";
import ProductoBd from "../dao/dbManagers/productos.js";
import { chequeoUsuario } from "../config/passport.config.js";


const productManager = new ProductoBd()
const routerProductBd = Router()


routerProductBd.get("/", async (req, res) =>{
    let productos = await productManager.getAll()
    res.json({status: "success", payload : productos})
})
routerProductBd.post("/",chequeoUsuario ("admin"), async(req,res)=>{
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

routerProductBd.delete("/:id", chequeoUsuario ("admin"), async (req, res) =>{
    let id =req.params.id
    let producto = await productManager.deleteProductById(id)
    res.json({status:"success",payload: producto})
})
routerProductBd.get("/productos", async (req, res) => {
    try {
      const { limit, page, sort, query } = req.query;
      const result = await productoManager.getProducts(limit, page, sort, query);
      res.json(result);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
      res.status(500).json({ error: "Error al obtener los productos" });
    }
});


export default routerProductBd