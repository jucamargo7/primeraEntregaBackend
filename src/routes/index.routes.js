import { Router } from "express";
import router from "./productos.routes.js";
import routerCarrito from "./carrito.routes.js";
import routerViews from "./views.router.js";
import routerCarritoBd from "./carritobd.routes.js";
import routerProductBd from "./productosbd.routes.js";
import routerSession from "./sessions.router.js";
import routerMock from "./mock.routes.js";


const indexRouter = Router()

indexRouter.use("/api/productos", router)
indexRouter.use("/api/carrito", routerCarrito)
indexRouter.use("/", routerViews)
indexRouter.use("/api/productosbd", routerProductBd );
indexRouter.use("/api/carritobd", routerCarritoBd );
indexRouter.use("/api/sessions", routerSession)
indexRouter.use("/mockingproducts", routerMock)

export default indexRouter