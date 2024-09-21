const express = require('express');
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();
const PORT = 8080;

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Ruta raíz
app.get('/', (req, res) => {
  res.redirect('/api/products');
});

// Escucha del servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
