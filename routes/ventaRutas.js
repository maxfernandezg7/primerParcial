const express = require('express');
const rutas = express.Router();
const VentaModel = require('../models/Venta');

rutas.get('/', async (req, res) =>{
    try {
        const ventas = await VentaModel.find();
        console.log(ventas);
        res.json(ventas);
    }
    catch(error){
        res.status(404).json({mensaje: error.message});
    }
});

rutas.post('/agregar', async (req, res) =>{
    // console.log(req.body);
    const nuevaVenta = new VentaModel({
        nombreCliente: req.body.nombreCliente,
        telefonoCliente: req.body.telefonoCliente,
        direccionCliente: req.body.direccionCliente,
        modelo: req.body.modelo,  
        marca: req.body.marca,
        precio: req.body.precio, 
        cantidad: req.body.cantidad,
        totalVenta: req.body.totalVenta,
        medioPago: req.body.medioPago,
        observaciones: req.body.observaciones
    });
    try {
        const guardarVenta = await nuevaVenta.save();
        res.status(201).json(guardarVenta);
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

rutas.put('/editar/:id', async (req, res) =>{
    try {
        const actualizarVenta = await VentaModel.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.status(201).json(actualizarVenta);
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

rutas.delete('/eliminar/:id', async (req, res) =>{
    try {
        const eliminarVenta = await VentaModel.findByIdAndDelete(req.params.id);
        res.json({mensaje: 'Venta eliminada correctamente'});
        
    } catch(error){
        res.status(400).json({mensaje: error.message});
    }
});

//consultas ----------------------
//Consuta de venta a clientes-----
rutas.get('/ventas-cliente/:nombreCliente', async (req, res) => {
    try {
      const { nombreCliente } = req.params;
      const ventasCliente = await VentaModel.find({ nombreCliente })
        .sort({ createdAt: -1 })
        .select('modelo marca precio cantidad totalVenta createdAt');
  
      if (ventasCliente.length === 0) {
        return res.json({ mensaje: `No se encontraron ventas para el cliente ${nombreCliente}` });
      }
  
      res.json(ventasCliente);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  });
// Consulta de Venta por Marcas
rutas.get('/ventas-marca-modelo/:marca', async (req, res) => {
    try {
      const { marca } = req.params;
      const ventasMarcaModelo = await VentaModel.aggregate([
        {
          $match: { marca }
        },
        {
          $group: {
            _id: "$modelo",
            totalVentas: { $sum: 1 },
            ventasModelo: { $push: "$$ROOT" }
          }
        }
      ]);
  
      if (ventasMarcaModelo.length === 0) {
        return res.json({ mensaje: `No se encontraron ventas para la marca ${marca}` });
      }
      res.json(ventasMarcaModelo);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  });
// Consulta venta en rango de precio
  rutas.get('/ventas-rango-precio/:precioMin/:precioMax', async (req, res) => {
    try {
      const { precioMin, precioMax } = req.params;
      const ventasRangoPrecio = await VentaModel.find({
        precio: {
          $gte: precioMin,
          $lte: precioMax
        }
      })
        .sort({ precio: 1 })
        .select('modelo marca precio cantidad totalVenta createdAt');
    if (ventasRangoPrecio.length === 0) {
        return res.json({ mensaje: `No se encontraron ventas en el rango de precios ${precioMin} - ${precioMax}` });
      }
      res.json(ventasRangoPrecio);
    } catch (error) {
      res.status(400).json({ mensaje: error.message });
    }
  });

module.exports = rutas;