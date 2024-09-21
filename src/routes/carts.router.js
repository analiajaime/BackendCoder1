const express = require("express");
const router = express.Router();
const CartManager = require("../managers/cart-manager.js");
const manager = new CartManager("./src/data/carritos.json");


router.get("/", async (req, res) => {
    try {
        const arrayCarritos = await manager.getCarts();

        res.send(arrayCarritos);
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
}
)

router.get("/:cid", async (req, res) => {
    let id = req.params.cid;

    try {
        const carritoBuscado = await manager.getCartById(parseInt(id));

        if (!carritoBuscado) {
            res.send("Carrito no encontrado");
        } else {
            res.send(carritoBuscado);
        }

    } catch (error) {
        res.status(500).send("Error del servidor");
    }
}
)

router.post("/", async (req, res) => {
    const nuevoCarrito = req.body;

    try {
        await manager.addCart(nuevoCarrito);
        res.status(201).send("Carrito agregado exitosamente");
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
}
)

router.delete("/:cid", async (req, res) => {
    let id = req.params.cid;

    try {
        await manager.deleteCart(parseInt(id));
        res.send("Carrito eliminado");
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
}
)

router.post("/:cid/productos", async (req, res) => {
    let id = req.params.cid;
    let producto = req.body;

    try {
        await manager.addProductToCart(parseInt(id), producto);
        res.send("Producto agregado al carrito");
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
}
)

router.delete("/:cid/productos/:pid", async (req, res) => {
    let id = req.params.cid;
    let idProducto = req.params.pid;

    try {
        await manager.deleteProductFromCart(parseInt(id), parseInt(idProducto));
        res.send("Producto eliminado del carrito");
    } catch (error) {
        res.status(500).send("Error del servidor");
    }
}
)

module.exports = router;
