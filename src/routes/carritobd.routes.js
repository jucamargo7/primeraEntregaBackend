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
routerCarritoBd.delete("/carritos/:idc/productos/:idp", async (req, res) => {
    try {
      const { idc, idp } = req.params;
      const carritoActualizado = await carritoManager.eliminarProducto(idc, idp);
      res.json(carritoActualizado);
    } catch (error) {
      res.status(500).json({ error: "Error al eliminar el producto" });
    }
});
routerCarritoBd.delete("/carritos/:idc/productos", async (req, res) => {
    try {
      const { idc } = req.params;
      const carrito = await carritoManager.getCarritoById(idc);
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      await carritoManager.eliminarTodosLosProductos(carrito);
      res.json({ message: "Se eliminaron todos los productos del carrito" });
    } catch (error) {
      console.error("Error al eliminar los productos del carrito:", error);
      res.status(500).json({ error: "Error al eliminar los productos del carrito" });
    }
});
routerCarritoBd.put("/carritos/:idc/productos/:idp", async (req, res) => {
    try {
      const { idc, idp } = req.params;
      const { cantidad } = req.body;
      const carrito = await carritoManager.getCarritoById(idc);
      if (!carrito) {
        return res.status(404).json({ error: "Carrito no encontrado" });
      }
      const productoIndex = carrito.productos.findIndex(
        (producto) => producto._id.toString() === idp
      );
      if (productoIndex === -1) {
        return res.status(404).json({ error: "Producto no encontrado en el carrito" });
      }
      carrito.productos[productoIndex].cantidad = cantidad;
      const carritoActualizado = await carritoManager.updateCarrito(carrito);
      res.json({ status: "success", payload: carritoActualizado });
    } catch (error) {
      console.error("Error al actualizar el producto del carrito:", error);
      res.status(500).json({ error: "Error al actualizar el producto del carrito" });
    }
  });
  
export default routerCarritoBd