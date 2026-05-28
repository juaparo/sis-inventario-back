import ProductAdapter from '../adapters/MongooseProductAdapter.js';

// CREATE
export const createProduct = async (req, res) => {
  try {
    const guardado = await ProductAdapter.create(req.body);
    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ALL
export const getProducts = async (req, res) => {
  try {
    const productos = await ProductAdapter.findAll();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const actualizado = await ProductAdapter.update(req.params.id, req.body);
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
