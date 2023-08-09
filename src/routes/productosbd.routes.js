import { Router } from "express";
import ProductoBd from "../dao/dbManagers/productos.js";
import { addLogger, logger } from "../utils/logger.js"
import { chequeoUsuario } from "../config/passport.config.js";
import generateUserErrorInfo from "../utils/errors/Info.errors.js";
import EnumErrors from "../utils/errors/Enum.errors.js";
import CustomErrors from "../utils/errors/Custom.errors.js";


const productManager = new ProductoBd()
const routerProductBd = Router()

routerProductBd.use(addLogger);


routerProductBd.get("/", async (req, res) => {
    try {
        req.logger.info("Obteniendo todos los productos");
        let productos = await productManager.getAll();
        res.json({ status: "success", payload: productos });
    } catch (error) {
        req.logger.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});

routerProductBd.post("/",chequeoUsuario ("admin"), async(req,res)=>{
    const {title, description,code,price,status,stock,category} = req.body
    if (!title||!description || !code || !price || !stock || !category) {
        CustomErrors.createError({
        name: "error en la creacion del producto",
        cause: generateUserErrorInfo({ first_name, last_name, email }),
        message: "No se cumple con las espicificaciones del Schema ",
        code: EnumErrors.INVALID_TYPES_ERROR,
    })
    }   
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