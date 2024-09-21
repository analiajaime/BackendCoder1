const express = require("express"); 
const productRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/carts.router.js");
const app = express(); 
const PUERTO = 8080;

//Middleware: 
app.use(express.json()); 

//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);


//Middleware de error

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Algo se rompio! Fuck!");
}   
)

// Ruta raíz
app.get("/", (req, res) => {
    res.redirect("/api/products");  // Redirigir a /api/products
});


//Servidor

app.listen(PUERTO, () => {
    console.log(`Trabajando en el puerto http://localhost:${PUERTO}`); 
})