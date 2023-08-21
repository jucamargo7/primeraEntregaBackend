import { Router } from "express";
import CarritoBd from "../dao/dbManagers/carritos.js";
import { addLogger, logger } from "../utils/logger.js"
import transporter from "../config/mailer.js";


const carritoManager = new CarritoBd()
const routerCarritoBd = Router()

routerCarritoBd.use(addLogger);

routerCarritoBd.get("/", async (req, res) => {
  try {
    req.logger.info("Obteniendo todos los carritos");
    let carritos = await carritoManager.getAllCarritos();
    res.json({ status: "success", payload: carritos });
  } catch (error) {
    req.logger.error("Error al obtener carritos:", error);
    res.status(500).json({ error: "Error al obtener carritos" });
  }
});

routerCarritoBd.post("/", async (req, res) => {
  try {
    req.logger.info("Creando un nuevo carrito");
    const { product } = req.body;
    let nuevoCarrito = await carritoManager.createCarrito({ product });
    res.json({ status: "success", payload: nuevoCarrito });
  } catch (error) {
    req.logger.error("Error al crear un nuevo carrito:", error);
    res.status(500).json({ error: "Error al crear un nuevo carrito" });
  }
});

routerCarritoBd.get("/:id", async (req, res) => {
  const carritoId = req.params.id;

  try {
    req.logger.info(`Obteniendo carrito con ID: ${carritoId}`);
    const carrito = await carritoManager.getCarritoById(carritoId);

    if (carrito) {
      res.json({ status: "success", payload: carrito });
    } else {
      res.status(404).json({ error: "Carrito no encontrado" });
    }
  } catch (error) {
    req.logger.error("Error al obtener el carrito:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

routerCarritoBd.post("/carritos/:idc/productos/:idp", async (req, res) => {
  try {
    const { idc, idp } = req.params;
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
routerCarritoBd.post("/:cid/purchase", async (req, res) => {
  try {
    const { cid } = req.params;
    const email  = req.user.email;

    const result = await carritoManager.finalizarCompra(cid, email);
    const cart = await carritoManager.createCarrito()
    req.user.carrito = cart._id
    await req.user.save()
    if (result.status === true) {
      let html =
        `<p>Su factura es: ${result.ticket.code} con fecha de ${result.ticket.purchase_datetime}</p>
        <p>Cantidad por valor de: $${result.ticket.amount}</p>`
      if (result.productsNotProcessed.length > 0) {
        html += `<p>Productos no procesados por falta de stock</p>`
        result.productsNotProcessed.forEach(p => {
          html += `<p>Producto: ${p.title}</p>`
        })
      }
      const mailOptions = {
        from: "camargoherrerajuanpablo02@gmail.com",
        to: email,
        subject: "Factura",
        html,
      };
      await transporter.sendMail(mailOptions)
      res.redirect("/productos");
    }
    else {
      res.status(500).json({ error: "Error al finalizar la compra" });
    }
  } catch (error) {
    logger.fatal("Error al finalizar la compra:", error);
    res.status(500).json({ error: "Error al finalizar la compra" });
  }
});

export default routerCarritoBd