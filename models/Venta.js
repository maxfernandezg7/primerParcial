const mongoose = require('mongoose');

const ventaSchema = new mongoose.Schema({
    nombreCliente : String,
    telefonoCliente : String,
    direccionCliente : String,
    modelo : String,
    marca : String,
    precio : Number,
    cantidad : Number,
    totalVenta : Number,
    medioPago : String,
    observaciones : String
})

const VentaModel = mongoose.model('Venta', ventaSchema, 'venta');
module.exports = VentaModel;
