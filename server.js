import express from "express";
import productManager from "./index.js";


const app = express();


const product = new productManager("productos.json");


app.get("/usuarios", async (req, res) => {
    const usuarios = await product.getProducts();
    let limit = parseInt(req.query.limit) ;
    if (!limit) return res.send( await usuarios)
    let productLimit = usuarios.slice(0, limit)
  res.send(productLimit);
});

app.get("/usuarios/:id", async (req, res) =>{
    const usuario = await product.getProductByID(parseInt(req.params.id))
    res.send(usuario)
})

app.post("/usuarios", async(req, res)=>{
  const nuevoUsuario = req.body;
  const usuario = await product.addProduct(nuevoUsuario)
  res.send(usuario)
})

app.listen(8080, () => {
  console.log("¡El servidor está en funcionamiento en el puerto 8080!");
});









