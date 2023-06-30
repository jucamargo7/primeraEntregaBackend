import { carritoModel } from "../models/carritos.js"


export default class CarritoBd {
    constructor(){
        console.log("Instanciando carrito")
    }
    createCarrito = async(carrito) =>{
        let result = await carritoModel.create(carrito)
        return result
    }


}