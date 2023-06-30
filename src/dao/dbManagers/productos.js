import { productModel } from "../models/productos.js";


export default class ProductoBd {
    constructor(){
        console.log("Instanciando producto")
    }
    getAll = async () =>{
        let products = await  productModel.find()
        return products.map(product => product.toObject())
    }
    createProduct = async(product) =>{
        let result = await productModel.create(product)
        return result
    }
    getProductById = async (id) => {
        let product = await productModel.findById(id);
        return product ? product.toObject() : null;
      };
    deleteProductById = async (id) => {
        let result = await productModel.findByIdAndDelete(id);
        return result ? result.toObject() : null;
    };

}