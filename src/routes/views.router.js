const { Router } = express;
import express from 'express';
import ProductoBd from "../dao/dbManagers/productos.js";


const productoView = new ProductoBd()
const routerViews = Router();

routerViews.get("/realtimeproducts", (req, res) =>{
    res.render("realTimeProducts", {});
});

// routerViews.get("/productos", async(req,res)=>{
//     let product = await productoView.getAll()
//     const carritoId = req.user.carrito
//     res.render("productosbd",{product, carritoId})
// })

routerViews.get("/productos", async (req, res) => {
    try {
        let product = await productoView.getAll();
        let carritoId = null;
        if (req.user && req.user.carrito) {
            carritoId = req.user.carrito;
        }
        res.render("productosbd", { product, carritoId });
    } catch (error) {
        console.error("Error al obtener productos:", error);
        res.status(500).json({ error: "Error al obtener productos" });
    }
});
routerViews.get('/register',(req,res)=>{
    res.render('register');
})

routerViews.get('/login',(req,res)=>{
    res.render('login')
})

routerViews.get('/profile',(req,res)=>{
    res.render('profile',{
        user:req.session.user
    })
})

routerViews.get('/carrito', async (req, res) => {
    res.render('carritobd')
});


export default routerViews;