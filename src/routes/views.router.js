import express from 'express';
const { Router } = express;
import productManager from "../index.js";

const routerViews = Router();
const product = new productManager("productos.json");



export default routerViews;