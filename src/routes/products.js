const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const productsFilePath = path.join(__dirname, '../data/productos.json');

// Obtener todos los productos
router.get('/', (req, res) => {
  const limit = req.query.limit;
  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo de productos' });
    let products = JSON.parse(data);
    if (limit) products = products.slice(0, limit);
    res.json(products);
  });
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
  const { pid } = req.params;
  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo de productos' });
    const products = JSON.parse(data);
    const product = products.find(p => p.id == pid);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  });
});

// Crear un nuevo producto
router.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails = [] } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios, excepto thumbnails' });
  }

  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo de productos' });
    const products = JSON.parse(data);
    const newProduct = {
      id: products.length + 1,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails
    };
    products.push(newProduct);
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error al escribir en el archivo de productos' });
      res.status(201).json(newProduct);
    });
  });
});

// Actualizar un producto por ID
router.put('/:pid', (req, res) => {
  const { pid } = req.params;
  const updatedData = req.body;

  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo de productos' });
    let products = JSON.parse(data);
    const productIndex = products.findIndex(p => p.id == pid);
    if (productIndex === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    products[productIndex] = { ...products[productIndex], ...updatedData, id: products[productIndex].id };
    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error al escribir en el archivo de productos' });
      res.json(products[productIndex]);
    });
  });
});

// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  const { pid } = req.params;
  
  fs.readFile(productsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo de productos' });
    let products = JSON.parse(data);
    products = products.filter(p => p.id != pid);

    fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error al escribir en el archivo de productos' });
      res.json({ message: 'Producto eliminado exitosamente' });
    });
  });
});

module.exports = router;
