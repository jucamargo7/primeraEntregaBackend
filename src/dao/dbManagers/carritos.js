import mongoose from "mongoose"
import { carritoModel } from "../models/carritos.js"
import { productModel } from "../models/productos.js"
import ticketModel from "../models/ticket.js"




export default class CarritoBd {
  constructor() {
    console.log("Instanciando carrito")
  }
  getAllCarritos = async () => {
    let carritos = await carritoModel.find().lean().populate("productos")
    console.log(carritos);
    console.log(JSON.stringify(carritos, null, "\t"));
    return carritos
  }
  createCarrito = async (carrito) => {
    let result = await carritoModel.create(carrito)
    return result
  }
  ingresarProducto = async (idc, idp) => {
    try {
      const update = { $push: { productos: { _id: idp } }, };
      const carritoActualizado = await carritoModel.findByIdAndUpdate(idc, update, { new: true }).populate("productos");
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
    const carrito = await carritoModel.findOne({ _id: id });
    const productos = await Promise.all(carrito.productos.map(async (p) => {
      const product = await productModel.findById(p)
      return product
    }))
    const productoCantidad = {}
    productos.forEach((p) => {
      const productoID = p._id.toString()
      if (productoCantidad.hasOwnProperty(productoID)) {
        productoCantidad[productoID]++
      } else {
        productoCantidad[productoID] = 1
      }
    })
    const productosIDS = Object.keys(productoCantidad)
    const todosProductos = []
    productosIDS.forEach(productoID => {
      const producto = productos.filter(p => p._id.toString() === productoID)
      if (producto.length == 0) {
        return
      }
      todosProductos.push({
        ...producto[0]._doc,
        cantidad: productoCantidad[productoID] || 0
      })
    })
    return todosProductos
  };
  //   getCarritoById = async (id) => {
  //     const carrito = await carritoModel.findOne({_id:id});
  //     const rpta = await Promise.all(carrito.productos.map( async (p)=>{
  //       const product = await productModel.findById(p)
  //       return product
  //     })) 
  //     const productoDetalles = {}
  //     rpta.forEach((p)=>{
  //       const productoID = p._id.toString()
  //       if (productoDetalles.hasOwnProperty(productoID)){
  //         productoDetalles[productoID].cantidad++
  //       } else {
  //         productoDetalles[productoID] = {
  //           ...p,
  //           cantidad: 1
  //         }
  //       }
  //     })
  //     return productoDetalles 
  // };
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
    console.log(email)
    try {
      const carrito = await this.getCarritoById(carritoId)

      const productsNotProcessed = [];

      for (const item of carrito) {
        const product = await productModel.findById(item._id);

        if (product.stock >= item.cantidad) {
          product.stock -= item.cantidad;
          await product.save();
        } else {
          productsNotProcessed.push(item);
        }
      }

      let total = 0
      carrito.forEach(p => {
        total += p.price * p.cantidad
      })
      const ticketData = {
        code: "TICKET_" + Date.now(),
        purchase_datetime: new Date(),
        amount: total,
        purchaser: email,
      };

      const ticket = await ticketModel.create(ticketData)
      return {status:true,ticket, productsNotProcessed};
    } catch (error) {
      console.error("Error al finalizar la compra:", error);
      throw error;
    }
  };

}