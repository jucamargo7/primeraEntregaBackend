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
    getProducts = async (limit = 10, page = 1, sort = "", query = "") => {
      const queryOptions = {};
      limit = parseInt(limit) || 10;
      queryOptions.limit = limit;
      const totalProducts = await productModel.countDocuments();
      const totalPages = Math.ceil(totalProducts / limit);
      page = parseInt(page) || 1;
      if (page < 1) {
        page = 1;
      } else if (page > totalPages) {
        page = totalPages;
      }
      queryOptions.skip = limit * (page - 1);
      if (sort === "asc") {
        queryOptions.sort = { precio: 1 };
      } else if (sort === "desc") {
        queryOptions.sort = { precio: -1 };
      }
      if (query) {
        queryOptions.query = { nombre: { $regex: query, $options: "i" } };
      }
      const products = await productModel.find(queryOptions.query)
        .sort(queryOptions.sort)
        .skip(queryOptions.skip)
        .limit(queryOptions.limit)
        .lean();
      const prevPage = page > 1 ? page - 1 : null;
      const nextPage = page < totalPages ? page + 1 : null;
      const hasPrevPage = prevPage !== null;
      const hasNextPage = nextPage !== null;
      const prevLink = prevPage ? `/productos?limit=${limit}&page=${prevPage}` : null;
      const nextLink = nextPage ? `/productos?limit=${limit}&page=${nextPage}` : null;
      return {
        status: "success",
        payload: products,
        totalPages,
        prevPage,
        nextPage,
        page,
        hasPrevPage,
        hasNextPage,
        prevLink,
        nextLink,
      };
    };

}