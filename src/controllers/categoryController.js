import CategoryAdapter from '../adapters/MongooseCategoryAdapter.js';

export const getCategories = async (req, res, next) => {
  try {
    const categories = await CategoryAdapter.aggregate([
      // 1. Convertimos el _id a string para que coincida con el campo 'category' de tus productos
      {
        $addFields: {
          idString: { $toString: "$_id" }
        }
      },
      // 2. Lookup usando el campo convertido
      {
        $lookup: {
          from: 'products',
          localField: 'name',         // <--- AJUSTE AQUÍ: Si tu producto guarda el NOMBRE de la cat.
          foreignField: 'category',   // <--- AJUSTE AQUÍ: Como está en tu imagen (ej: "Electronica")
          as: 'products_array'
        }
      },
      // 3. Conteo y limpieza
      {
        $addFields: {
          productCount: { $size: '$products_array' }
        }
      },
      {
        $project: {
          products_array: 0,
          idString: 0
        }
      },
      { $sort: { createdAt: -1 } }
    ]);

    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// POST - Crear una nueva categoría
export const createCategory = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    const savedCategory = await CategoryAdapter.create({
      name,
      description,
      status: status || 'active'
    });
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
    const updatedCategory = await CategoryAdapter.update(
      id,
      req.body
    );
    if (!updatedCategory) {
      return res.status(404).json({ message: 'La categoría no existe.' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};