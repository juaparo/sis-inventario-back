import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { createAlert } from './alertController.js';

// Obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('categoria', 'nombre').sort({ nombre: 1 });
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    return res.status(500).json({ message: 'Error al obtener los productos' });
  }
};

// Crear un producto
export const createProduct = async (req, res) => {
  const { nombre, precio, stockActual, stockMinimo, categoria } = req.body;
  try {
    if (!nombre || precio == null || stockActual == null || stockMinimo == null || !categoria) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const categoryExists = await Category.findById(categoria);
    if (!categoryExists) {
      return res.status(400).json({ message: 'La categoría especificada no existe' });
    }

    const product = new Product({ nombre, precio, stockActual, stockMinimo, categoria });
    await product.save();

    // Si al crearlo ya tiene stock bajo el mínimo, generar alerta de tipo 'producto'
    if (product.validarStock()) {
      await createAlert({
        mensaje: `Producto "${product.nombre}" creado con stock bajo el mínimo: ${product.stockActual} uds (mín: ${product.stockMinimo})`,
        tipoOrigen: 'producto',
        referenciaId: product._id
      });
    }

    const populated = await Product.findById(product._id).populate('categoria', 'nombre');
    return res.status(201).json(populated);
  } catch (error) {
    console.error('Error al crear producto:', error);
    return res.status(500).json({ message: 'Error al crear el producto' });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { nombre, precio, stockActual, stockMinimo, categoria } = req.body;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (categoria) {
      const categoryExists = await Category.findById(categoria);
      if (!categoryExists) {
        return res.status(400).json({ message: 'La categoría especificada no existe' });
      }
      product.categoria = categoria;
    }

    if (nombre != null) product.nombre = nombre;
    if (precio != null) product.precio = precio;
    if (stockActual != null) product.stockActual = stockActual;
    if (stockMinimo != null) product.stockMinimo = stockMinimo;

    await product.save();

    // Si tras la actualización el stock queda bajo el mínimo, generar alerta
    if (product.validarStock()) {
      await createAlert({
        mensaje: `Producto "${product.nombre}" con stock bajo el mínimo: ${product.stockActual} uds (mín: ${product.stockMinimo})`,
        tipoOrigen: 'producto',
        referenciaId: product._id
      });
    }

    const populated = await Product.findById(product._id).populate('categoria', 'nombre');
    return res.status(200).json(populated);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return res.status(500).json({ message: 'Error al actualizar el producto' });
  }
};

// Alternar estado activo/inactivo (cambiarEstado del diagrama)
export const toggleProductStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    product.cambiarEstado();
    await product.save();
    return res.status(200).json(product);
  } catch (error) {
    console.error('Error al alternar estado del producto:', error);
    return res.status(500).json({ message: 'Error al alternar el estado del producto' });
  }
};
