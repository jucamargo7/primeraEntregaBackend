import { carritoModel } from "../models/carritos.js"


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
      


}