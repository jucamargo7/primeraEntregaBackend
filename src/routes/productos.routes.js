import express from 'express';
const { Router } = express;

import productManager from "../index.js";

const router = Router();

const product = new productManager("productos.json");

router.get("/", async (req, res) => {
    const usuarios = await product.getProducts();
    let limit = parseInt(req.query.limit) ;
    if (!limit) return res.send( await usuarios)
    let productLimit = usuarios.slice(0, limit)
  res.send(productLimit);
});

router.get("/:id", async (req, res) =>{
    const usuario = await product.getProductByID(parseInt(req.params.id))
    res.send(usuario)
})

router.post("/", async(req, res)=>{
  const nuevoUsuario = req.body;
  const usuario = await product.addProduct(nuevoUsuario)
  res.send(usuario)
})

router.delete("/:id", async(req, res)=>{
  const id = parseInt(req.params.id)
  await product.removeProductByID(id)
  res.send("Producto eliminado")
})

router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const newData = req.body;
  await product.updateProductByID(id, newData);
  res.send("Producto actualizado");
})

export default router;