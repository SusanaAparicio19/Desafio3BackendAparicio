import { promises as fs } from 'fs';
import { PRODUCTS_JASON } from './config.js';

class Product {
  constructor({
    id,
    category,
    object,
    title,
    description,
    thumbnail,
    code,
    stock,
    price,
  }) {
    this.id = id;
    this.category = category;
    this.object = object;
    this.title = title;
    this.description = description;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.price = price;
  }
}

export class ProductManager {
  static #lastId = 0;
  #products;

  constructor({ path }) {
    this.path = path;
    this.#products = [];
  }

  async init() {
    try {
      await this.#readProducts();
    } catch (error) {
      await this.#writeProducts();
    }
    if (this.#products.length === 0) {
      ProductManager.#lastId = 0;
    } else {
      ProductManager.#lastId = this.#products.at(-1).id;
    }
  }

  static #generarNewId() {
    return ++ProductManager.#lastId;
  }

  async #readProducts() {
    try {
      const leidoEnJson = await fs.readFile(this.path, 'utf-8');
      if (leidoEnJson.trim() === '') {
        console.log('El archivo JSON está vacío.');
      } else {
        this.products = JSON.parse(leidoEnJson);
      }
    } catch (error) {
      console.error('Error al leer el archivo JSON:', error);
    }
  }

  async #writeProducts() {
    await fs.writeFile(this.path, JSON.stringify(this.#products, null, 2));
  }

  /* en la verificacion no esta thumbnail porque todavia no manejamos imagenes asi no se traba. Cuando las pongamos pondre la validacion*/

  async addProduct({
    category,
    object,
    title,
    description,
    thumbnail,
    code,
    stock,
    price,
  }) {
    if (
      !category ||
      !object ||
      !title ||
      !description ||
      !code ||
      !stock ||
      !price
    ) {
      throw new Error('Todos los campos son obligatorios');
    }

    const existingProduct = this.#products.find(
      (product) => product.code === code
    );

    if (existingProduct) {
      throw new Error('El producto ya existe');
    }

    const id = ProductManager.#generarNewId();
    const product = new Product({
      id,
      category,
      object,
      title,
      description,
      thumbnail,
      code,
      stock,
      price,
    });
    await this.#readProducts();
    this.#products.push(product);
    await this.#writeProducts();
    return product;
  }
  
  async getProducts() {
    const products = await fs.readFile(this.path, 'utf-8');
    return products;
  }

  getProductById(id) {
    try {
      const buscada = this.#products.find((product) => product.id === id);
      if (!buscada) throw new Error(`Producto no encontrado`);
      return buscada;
    } catch (error) {
      throw error; 
    }
  }
  


  async updateProduct(id, updatedFields) {
    const index = this.#products.findIndex((product) => product.id === id);
    if (index != -1) {
      await this.#readProducts();
      this.#products[index] = { ...this.#products[index], ...updatedFields };
      await this.#writeProducts();
      return this.#products;
    }
  }

  async deleteProduct(id) {
    const index = this.#products.findIndex((product) => product.id === id);
    if (index != -1) {
      await this.#readProducts();
      this.#products.splice(index, 1);
      await this.#writeProducts();
      return this.#products;
    }
  }
}

async function main() {
  const ProdMan = new ProductManager(PRODUCTS_JASON);
  //await ProdMan.init()
  const prod1 = await ProdMan.addProduct({
    category: 'Linea Susan',
    object: 'Maceta',
    title: 'Face',
    description: 'Macetas con rostros pintados a mano',
    code: 'LS001',
    stock: 50,
    price: 1000,
  });

  const prod2 = await ProdMan.addProduct({
    category: 'Linea Susan',
    object: 'Maceta',
    title: 'Lady',
    description: 'Macetas hecha con forma de cuerpo',
    code: 'LS002',
    stock: 40,
    price: 1500,
  });

  const prod3 = await ProdMan.addProduct({
    category: 'Linea Susan',
    object: 'Maceta',
    title: 'Black&White',
    description: 'Macetas con diseños abstractos',
    code: 'LS003',
    stock: 30,
    price: 2000,
  });

  const prod4 = await ProdMan.addProduct({
    category: 'Linea Angie',
    object: 'Colgante',
    title: 'Arcoiris',
    description:
      'Adorno de alambre en forma de Arcoiris decorado con piedras transparentes',
    code: 'LA001',
    stock: 35,
    price: 1100,
  });

  const prod15 = await ProdMan.addProduct({
    category: 'Linea Prueba',
    object: 'para borrar',
    title: 'para prueba del  deleteProduct',
    description: 'deleteProduct',
    code: 'Lxxxx',
    stock: 30,
    price: 2000,
  });
  /*
//mostrar un producto
console.log(prod1)

// mostrar todos los productos
console.log(await ProdMan.getProducts())*/
  /*
//buscar un producto por Id
console.log(await ProdMan.getProductById(2))

//buscar un producto que no existe por id
console.log(await ProdMan.getProductById(30))
*/

  // con updateProduct cambiar solo el stock en prod2, mostrado antes y despues
  /*
console.log(await ProdMan.getProductById(2))
await ProdMan.updateProduct(2,{stock: 60})
console.log(await ProdMan.getProductById(2))

await ProdMan.updateProduct(2,{price: 2000})
console.log(await ProdMan.getProductById(2))*/
  /*
//con deleteProduct borrar el prod15 con id 5, mostrado antes y despues
console.log(prod15)
await ProdMan.deleteProduct(5)
console.log(prod15)

*/
}


