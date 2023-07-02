const { Router } = express;
import express from 'express';
import ProductoBd from "../dao/dbManagers/productos.js";


const productoView = new ProductoBd()
const routerViews = Router();

routerViews.get("/realtimeproducts", (req, res) =>{
    res.render("realTimeProducts", {});
});

routerViews.get("/productos", async(req,res)=>{
    let product = await productoView.getAll()
    res.render("productosbd",{product})
})

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



export default routerViews;