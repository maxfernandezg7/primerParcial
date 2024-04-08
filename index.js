const express = require ('express');
const mongoose = require ('mongoose');
require('dotenv').config();
//importar rutas
const ventasRutas = require('./routes/ventaRutas');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGO_URL;

app.use(express.json());

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log(`servidor funcionando: ${PORT}`)});
})
    .catch( error => console.log('Error MongoDB', error));

    app.use('/ruta-venta',ventasRutas)