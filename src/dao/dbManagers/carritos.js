import { carritoModel } from "../models/carritos.js"
import { productModel } from "../models/productos.js"
import ticketModel from "../models/ticket.js"


export default class CarritoBd {
    constructor(){
        console.log("Instanciando carrito")
    }
    getAllCarritos = async()=>{
        let carritos = await carritoModel.find().lean().populate("productos")
       console.log(carritos);
       console.log(JSON.stringify(carritos, null, "\t"));
        return carritos
    }
    createCarrito = async(carrito) =>{
        let result = await carritoModel.create(carrito)
        return result
    }
    ingresarProducto = async (idc, idp) => {
        try {const update = {$push: { productos: { _id: idp } },};
          const carritoActualizado = await carritoModel.findByIdAndUpdate(idc, update,{ new: true }).populate("productos");
          console.log(JSON.stringify(carritoActualizado, null, "\t"));
          return carritoActualizado;
        } catch (error) {
          console.error("Error al ingresar el producto:", error);
          throw error;
        }
      };
    eliminarProducto = async (carritoId, productoId) => {
        try {
          const carrito = await carritoModel.findById(carritoId);
          if (!carrito) {
            throw new Error("Carrito no encontrado");
          }
          const index = carrito.productos.findIndex(
            (producto) => producto._id.toString() === productoId
          );
          if (index === -1) {
            throw new Error("Producto no encontrado en el carrito");
          }
          carrito.productos.splice(index, 1);
          await carrito.save();
          return carrito.toObject();
        } catch (error) {
          throw error;
        }
      };
    getCarritoById = async (id) => {
        const carrito = await carritoModel.findById(id);
        return carrito ? carrito.toObject() : null;
    };
    eliminarTodosLosProductos = async (carrito) => {
        carrito.productos = [];
        await carritoModel.findByIdAndUpdate(carrito._id, carrito);
    };
    updateCarrito = async (carrito) => {
        try {
          const carritoActualizado = await carritoModel.findByIdAndUpdate(
            carrito._id,
            carrito,
            { new: true }
          );
    
          return carritoActualizado;
        } catch (error) {
          console.error("Error al actualizar el carrito:", error);
          throw error;
        }
    }
    finalizarCompra = async (carritoId, email) => {
      try {
        const carrito = await carritoModel.findById(carritoId).populate("productos");
  
        const productsNotProcessed = [];
  
        for (const item of carrito.productos) {
          const product = await productModel.findById(item._id);
  
          const total = product.price * item.incart;
  
          if (product.stock >= item.incart) {
            product.stock -= item.incart;
            await product.save();
          } else {
            productsNotProcessed.push(item._id);
          }
        }
  
        if (productsNotProcessed.length > 0) {
          return { status: "incomplete", productsNotProcessed };
        }
  
        const ticketData = {
          code: "TICKET_" + Date.now(),
          purchase_datetime: new Date(),
          amount: carrito.productos.reduce((total, item) => {
            const product =  productModel.findById(item._id);
            return total + product.price * item.incart;
          }, 0),
          purchaser: email,
        };
  
        await ticketModel.create(ticketData);
  
        return { status: "success" };
      } catch (error) {
        console.error("Error al finalizar la compra:", error);
        throw error;
      }
    };

}