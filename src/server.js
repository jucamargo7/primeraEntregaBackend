import express from "express";
import productManager from "./index.js";
import router from "./routes/productos.routes.js";
import routerCarrito from "./routes/carrito.routes.js";
import routerViews from "./routes/views.router.js";
import path from "path";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";


const productos = new productManager("productos.json")
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))


app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use("/", express.static(__dirname + "/public"))



app.use("/api/productos", router)
app.use("/api/carrito", routerCarrito)
app.use("/realtimeproducts", routerViews)



app.get("/", async (req, res)=>{
  let totalProductos = await productos.getProducts()
  res.render("home", {productos: totalProductos})
})


const httpServer = app.listen(8080, () => {
  console.log("Levántate por favor");
});

const socketSever = new Server(httpServer)
socketSever.on("connection", socket=>{
  console.log("Nuevo cliente conectado")
})



// const product = new productManager("productos.json");

// app.get("/producto", async (req, res) => {
//   const usuarios = await product.getProducts();
//   let limit = parseInt(req.query.limit) ;
//   if (!limit) return res.send( await usuarios)
//   let productLimit = usuarios.slice(0, limit)
// res.send(productLimit);
// });

// app.get("/producto/:id", async (req, res) =>{
//   const usuario = await product.getProductByID(parseInt(req.params.id))
//   res.send(usuario)
// })

// app.post("/producto", async(req, res)=>{
// const nuevoUsuario = req.body;
// const usuario = await product.addProduct(nuevoUsuario)
// res.send(usuario)
// })

// app.delete("/producto/:id", async(req, res)=>{
// const id = parseInt(req.params.id)
// await product.removeProductByID(id)
// res.send("Producto eliminado")
// })

// app.put("/producto/:id", async (req, res) => {
// const id = parseInt(req.params.id);
// const newData = req.body;
// await product.updateProductByID(id, newData);
// res.send("Producto actualizado");
// })




