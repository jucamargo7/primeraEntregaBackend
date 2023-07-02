import express from "express";
import productManager from "./persistencia/index.js";
import router from "./routes/productos.routes.js";
import routerCarrito from "./routes/carrito.routes.js";
import routerViews from "./routes/views.router.js";
import path from "path";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import { Server } from "socket.io";
import {v4 as uuid} from "uuid"
import routerProductBd from "./routes/productosbd.routes.js";
import routerCarritoBd from "./routes/carritobd.routes.js";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import routerSession from "./routes/sessions.router.js";


const creacionProducto = []
const productos = new productManager("productos.json")
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))


const connection = mongoose.connect("mongodb+srv://juanpablo9911:Industrial.5@cluster0.glftsot.mongodb.net/?retryWrites=true&w=majority");

app.use(session({
  store: MongoStore.create({
    mongoUrl : "mongodb+srv://juanpablo9911:Industrial.5@cluster0.glftsot.mongodb.net/?retryWrites=true&w=majority",
    ttl: 3600,
  }),
  secret: "Proy3ctoBack",
  resave: false,
  saveUninitialized: false,
}))


app.engine("handlebars", engine());
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use("/", express.static(__dirname + "/public"))



app.use("/api/productos", router)
app.use("/api/carrito", routerCarrito)
app.use("/", routerViews)
app.use("/api/productosbd", routerProductBd );
app.use("/api/carritobd", routerCarritoBd );
app.use("/api/sessions", routerSession)



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

  socket.on("cliente:NuevoProducto", nuevaData =>{
    const productoNuevo = ({...nuevaData, id: uuid()})
    creacionProducto.push(productoNuevo)
    socket.emit("server:NuevoProducto", nuevaData)
  })

})






