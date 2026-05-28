import Category from '../models/Category.js'; 

// GET - Obtener todas las categorías
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (error) {
    next(error); 
  }
};

// POST - Crear una nueva categoría
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    
    const newCategory = new Category({
      name,
      description,
      status: status || 'active'
    });

    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'El nombre de la categoría ya existe.' });
    }
    next(error);
  }
};

// PUT - Actualizar datos o cambiar estado
export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: 'La categoría no existe.' });
    }

    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};