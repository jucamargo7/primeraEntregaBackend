import { Router } from "express";
import generateProducts from "../utils/mock.products.js";

const routerMock = Router();

routerMock.get("/", async (req, res) => {
  const prod = generateProducts(100);
  res.send(prod); 
});

export default routerMock;
