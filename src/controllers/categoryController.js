import Category from '../models/Category.js';

// Obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ nombre: 1 });
    return res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    return res.status(500).json({ message: 'Error al obtener las categorías' });
  }
};

// Crear una categoría
export const createCategory = async (req, res) => {
  const { nombre, descripcion } = req.body;
  try {
    if (!nombre || !descripcion) {
      return res.status(400).json({ message: 'El nombre y la descripción son requeridos' });
    }

    const existing = await Category.findOne({ nombre: nombre.trim() });
    if (existing) {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
    }

    const category = new Category({ nombre: nombre.trim(), descripcion: descripcion.trim() });
    await category.save();
    return res.status(201).json(category);
  } catch (error) {
    console.error('Error al crear categoría:', error);
    return res.status(500).json({ message: 'Error al crear la categoría' });
  }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }

    if (nombre && nombre.trim() !== category.nombre) {
      const existing = await Category.findOne({ nombre: nombre.trim() });
      if (existing) {
        return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
      }
      category.nombre = nombre.trim();
    }

    if (descripcion) category.descripcion = descripcion.trim();

    await category.save();
    return res.status(200).json(category);
  } catch (error) {
    console.error('Error al actualizar categoría:', error);
    return res.status(500).json({ message: 'Error al actualizar la categoría' });
  }
};

// Alternar estado activo/inactivo
export const toggleCategoryStatus = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    // Nota: Categoría no tiene campo activo en el diagrama del Entregable 2
    // Esta función queda como stub para extensión futura
    return res.status(400).json({ message: 'La entidad Categoría no soporta cambio de estado según el diagrama de clases' });
  } catch (error) {
    console.error('Error al alternar estado de categoría:', error);
    return res.status(500).json({ message: 'Error al alternar el estado de la categoría' });
  }
};
