import { Router } from "express";
import userModel from "../dao/models/users.js";
import { createHash, isValidPassword } from "../utils.js";
import passport from "passport";


const routerSession = Router();

routerSession.post('/register', passport.authenticate("registrer", {failureRedirect: "/failureRedirect"}), async(req,res)=>{
    res.send({status:"success",message: "Usuario registrado"});
})

routerSession.get("/failureRedirect", async (req, res) =>{
    console.log("Failed Strategy");
    res.send({error: "Failed"})
})

routerSession.post('/login', passport.authenticate("login", {failureRedirect: "/failurelogin"}) ,async(req,res)=>{
    if (!req.user) return res.status(400).send({status: "error", error: "Credenciales invalidas"})
    req.session.user ={
        first_name : req.user.first_name,
        las_name : req.user.las_name,
        email: req.user.email,
    }
    res.send({status: "success", payload: req.user})
})

export default routerSession;


// const {first_name, last_name, email, password} = req.body
//     if (!first_name || !last_name || !email || !password) res.status(400).send({status: "error", error: "Faltan datos por dilidenciar" })
//     let user = {
//         first_name,
//         last_name,
//         email,
//         password: createHash(password)
//     }
//     const result = await userModel.create(user); Suponiendo que envió todo bien

// const {email, password} = req.body;
//     if (!email || !password) res.status(400).send({status: "error", error: "Datos incompletos" })


//     Número 1!!!!! buscar al usuario, ¿existe?
//     const user = await userModel.findOne({email});
//     if(!user) return res.status(400).send({status:"error",error:"Usuario no encontrado"});
//     if(!isValidPassword (user, password)) return res.status(403).send({status : "error", error: "Contraseña incorrecta"})
//     delete user.password;
//     req.session.user = user;