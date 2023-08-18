import { Router } from "express";
import UsuarioManagerM from "../dao/dbManagers/usuario.js";
import multer from "multer";

const routerUsuarios = Router();

const usuario = new UsuarioManagerM()

routerUsuarios.get("/premium/:uid", (req, res) => {
    res.render("register");
});

routerUsuarios.put("/premium/:uid", async (req, res) => {
    try {
        const { uid } = req.params;
        const userUpdate = req.body;

        const result = await usuario.update({ _id: uid }, userUpdate);
        res.send({ status: "success", payload: result });
    } catch (error) {
        console.error("Error al acceder a la ruta:", error);
        res.status(500).send({ status: "error", message: "No es posible acceder a la ruta" });
    }
});


const upload = multer({ dest: "uploads/" });

routerUsuarios.post("/:uid/documents", upload.array("documents"), async (req, res) => {
  try {
    const { uid } = req.params;
    const files = req.files;
    const userUpdate = { documents: files.map((file) => ({ name: file.originalname, reference: file.path })) };
    const result = await usuario.update({ _id: uid }, userUpdate);
    res.send({ status: "success", payload: result });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ status: "error", message: "Error al subir los archivos" });
  }
});


export default routerUsuarios;
