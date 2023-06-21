import express from 'express';
const { Router } = express;


const routerViews = Router();
routerViews.get("/", (req, res) =>{
    res.render("realTimeProducts", {});
});

export default routerViews;