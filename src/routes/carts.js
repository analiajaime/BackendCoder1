const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const cartsFilePath = path.join(__dirname, '../data/carrito.json');

// Crear un nuevo carrito
router.post('/', (req, res) => {
  fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo de carritos' });
    const carts = JSON.parse(data);
    const newCart = {
      id: carts.length + 1,
      products: []
    };
    carts.push(newCart);
    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error al escribir en el archivo de carritos' });
      res.status(201).json(newCart);
    });
  });
});

// Listar los productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const { cid } = req.params;
  fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo de carritos' });
    const carts = JSON.parse(data);
    const cart = carts.find(c => c.id == cid);
    if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(cart.products);
  });
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  const { cid, pid } = req.params;
  fs.readFile(cartsFilePath, 'utf-8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Error al leer el archivo de carritos' });
    let carts = JSON.parse(data);
    const cartIndex = carts.findIndex(c => c.id == cid);
    if (cartIndex === -1) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productIndex = carts[cartIndex].products.findIndex(p => p.product == pid);
    if (productIndex === -1) {
      carts[cartIndex].products.push({ product: pid, quantity: 1 });
    } else {
      carts[cartIndex].products[productIndex].quantity += 1;
    }

    fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2), err => {
      if (err) return res.status(500).json({ error: 'Error al escribir en el archivo de carritos' });
      res.json(carts[cartIndex]);
    });
  });
});

module.exports = router;
