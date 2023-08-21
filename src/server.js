import express from "express";
import productManager from "./persistencia/index.js";
import path from "path";
import __dirname from "./utils.js";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import {v4 as uuid} from "uuid"
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import indexRouter from "./routes/index.routes.js";
import config from "./config/config.js";
import errorHandler from "./middlewars/index.js"
import { addLogger, logger } from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import handlebars from "express-handlebars";
import Handlebars from "handlebars";

const creacionProducto = []
const productos = new productManager("./persistencia/productos.json")
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(addLogger)



const swaggerOption = {
  definition:{
    openapi: "3.0.1",
    info:{
      title: "Documentación Proyecto Backend",
      description:"Se estará documentando los procesos más importantes del proyecto"
    },

  },
  apis: [`${__dirname}/docs/**/*.yaml`],
}
const specs = swaggerJSDoc(swaggerOption)
app.use("/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

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




initializePassport()
app.use(passport.initialize())
app.use(passport.session())
app.use((req,res,next)=>{
  res.locals.isLoginIn = req.isAuthenticated()
  next()
})


app.engine("handlebars", engine({
  handlebars: allowInsecurePrototypeAccess(Handlebars)
}));
app.set("view engine", "handlebars")
app.set("views", path.resolve(__dirname + "/views"))
app.use("/", express.static(__dirname + "/public"))



app.use("/", indexRouter)
app.use(errorHandler)


app.get("/real", async (req, res)=>{
  let totalProductos = await productos.getProducts()
  res.render("home",{productos: totalProductos})
})


const httpServer = app.listen(8080, () => {
  console.info("Levántate por favor");
});




const socketSever = new Server(httpServer)
socketSever.on("connection", socket=>{
  console.info("Nuevo cliente conectado")

  socket.on("cliente:NuevoProducto", nuevaData =>{
    const productoNuevo = ({...nuevaData, id: uuid()})
    creacionProducto.push(productoNuevo)
    socket.emit("server:NuevoProducto", nuevaData)
  })

})






