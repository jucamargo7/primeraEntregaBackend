import { promises as fs } from "fs";

export default class productManager {
  static ID = 0;
  constructor(path) {
    this.path = path;
    this.products = [];
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    const newProduct = {
      id: productManager.ID + 1,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    productManager.ID++;
    this.products.push(newProduct);
    try {
      await fs.writeFile(this.path, JSON.stringify( this.products ), "utf-8");
      console.log("El producto ha sido añadido correctamente.");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
    }
  }

  async getProducts() {
    try {
      const data = await promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      return products
    } catch (error) {
      console.error("No se pueden obtener los productos:", error);
    }
  }

  async getProductByID(id) {
    try {
      const data = await promises.readFile(this.path, "utf-8");
      const products = JSON.parse(data);
      const foundProduct =  products.find((x) => x.id === id);
      return foundProduct
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
    }
  }

  // async removeProductByID(id) {
  //   try {
  //     const data = await promises.readFile(this.path, "utf-8");
  //     if (data.trim().length === 0) {
  //       console.log("El archivo de productos está vacío.");
  //       return;
  //     }
  //     const products = JSON.parse(data);
  //     const updatedProducts = products.filter((x) => x.id !== id);
  //     if (products.length === updatedProducts.length) {
  //       console.log("No se encontró ningún producto con el ID especificado.");
  //       return;
  //     }
  //     await promises.writeFile(
  //       this.path,
  //       JSON.stringify(updatedProducts),
  //       "utf-8"
  //     );
  //     console.log("El producto ha sido eliminado correctamente.");
  //   } catch (error) {
  //     console.error("Error al eliminar el producto:", error);
  //   }
  // }

  // async updateProductByID(id, newData) {
  //   try {
  //     const data = await promises.readFile(this.path, "utf-8");
  //     if (data.trim().length === 0) {
  //       console.log("El archivo de productos está vacío.");
  //       return;
  //     }
  //     const products = JSON.parse(data);
  //     const productIndex = products.findIndex((x) => x.id === id);
  //     if (productIndex === -1) {
  //       console.log("No se encontró ningún producto con el ID especificado.");
  //       return;
  //     }
  //     products[productIndex] = { ...products[productIndex], ...newData };
  //     await promises.writeFile(
  //       this.path,
  //       JSON.stringify(products),
  //       "utf-8"
  //     );
  //     console.log("El producto ha sido actualizado correctamente.");
  //   } catch (error) {
  //     console.error("Error al actualizar el producto:", error);
  //   }
  // }
}


const prod1 = {
  title: "producto 1",
  description: "Pruena",
  price: 200,
  thumbnail: "sin imagen",
  code: "dscds",
  stock: 4545
}
const prod2 = {
  title: "producto 1",
  description: "Pruena",
  price: 200,
  thumbnail: "sin imagen",
  code: "dscds",
  stock: 4545
}
const prod3 = {
title: "producto 3",
description: "Pruena",
price: 300,
thumbnail: "sin imagen",
code: "dscds",
stock: 4545
}



const manager = new productManager("productos.json");
manager.addProduct(prod1);
manager.addProduct(prod2);
manager.addProduct(prod3);


// console.log(manager.getProducts())
// manager.getProductByID(1);
// console.log(manager.getProductByID(1));



