import { Router } from "express";
import CarritoBd from "../dao/dbManagers/carritos.js";

const carritoManager = new CarritoBd()
const routerCarritoBd = Router()

routerCarritoBd.get("/", async(req,res)=>{
    let carritos = await carritoManager.getAllCarritos()
    res.json({statusL:"success", payload: carritos})
}) 

routerCarritoBd.post("/",async(req,res)=>{
    const {product}=req.body
    let nuevoCarrito = await carritoManager.createCarrito({product})
    res.json({statusL:"success", payload: nuevoCarrito})
 })

routerCarritoBd.post("/carritos/:idc/productos/:idp", async (req, res) => {
    try {
      const { idc, idp } = req.body;
      const carritoActualizado = await carritoManager.ingresarProducto(idc, idp);
      res.json(carritoActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al ingresar el producto" });
    }
  });



export default routerCarritoBd