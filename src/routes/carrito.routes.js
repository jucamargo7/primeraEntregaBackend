import express from 'express';
const { Router } = express;


const routerCarrito = Router();

const carts = [];

routerCarrito.post('/', (req, res) => {
  const id = generateUniqueId();
  const newCart = {id,products: [] };
  carts.push(newCart);
  res.json(newCart);
});
function generateUniqueId() {
  const timestamp = new Date().getTime();
  const randomNum = Math.floor(Math.random() * 10000);
  return `${timestamp}-${randomNum}`;
}

routerCarrito.get('/:cid', (req, res) => {
    const cartId = req.params.cid;
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart.products);
});


routerCarrito.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const cart = carts.find(cart => cart.id === cartId);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    const product = {
      product: productId,
      quantity: 1 
    };
    cart.products.push(product);
    res.json(cart);
  });



export default routerCarrito;