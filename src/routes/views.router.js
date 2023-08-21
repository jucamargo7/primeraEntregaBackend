const { Router } = express;
import express, { request } from 'express';
import ProductoBd from "../dao/dbManagers/productos.js";
import CarritoBd from '../dao/dbManagers/carritos.js';

const productoView = new ProductoBd()
const routerViews = Router();
const carritoManager = new CarritoBd()

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
    const carritoId = req.user.carrito
    const productos = await carritoManager.getCarritoById(carritoId)
    let total = 0
    productos.forEach(p=>{
        total += p.price*p.cantidad
    })

    res.render('carritobd', {productos, total, carritoId} )
});


export default routerViews;