import Product from '../models/Product.js'; // Recuerda usar .js por la configuración ESM

// CREATE (Aquí es donde Mongo creará la colección si no existe)
export const createProduct = async (req, res) => {
  try {
    const nuevoProducto = new Product(req.body);
    const guardado = await nuevoProducto.save();
    res.status(201).json(guardado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ ALL
export const getProducts = async (req, res) => {
  try {
    const productos = await Product.find();
    res.status(200).json(productos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE
export const updateProduct = async (req, res) => {
  try {
    const actualizado = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } // Retorna el documento ya modificado
    );
    res.status(200).json(actualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Producto eliminado con éxito del inventario' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};