import express from 'express';
import { ProductManager } from './ProductManager.js';
import { PORT, PRODUCTS_JASON } from './config.js';


const ProdMan = new ProductManager({ path: 'db/products.json' });

const app = express();


app.use(express.json());

app.get('/products', async (request, response) => {
    try {
        const prd = await ProdMan.getProducts();
        const products = await JSON.parse(prd);

        // para verificar si se proporcionó un límite
        const limit = parseInt(request.query.limit);

        if (!isNaN(limit)) {
            return response.json(products.slice(0, limit));
        } else {
            return response.json(products);
        }
    } catch (error) {
        response.json({
            status: 'error',
            message: error.message,
        });
    }
});

app.get('/products/:id', async (request, response) => {
    const id = parseInt(request.params.id);    
    try {
      const prd = await ProdMan.getProductById(id);
      response.json(prd);
    } catch (error) {
      response.status(404).json({
        status: 'error',
        message: error.message
      });
    }
  });
  
app.get('/', (request, response) => {
    response.sendFile('index.html', {root: 'views'})
})

app.listen(PORT, async () => {
  console.log(`Conectado al puerto ${PORT}`);
});