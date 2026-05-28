import mongoose from 'mongoose'; // <-- Cambio de 'require' a 'import' para mantener consistencia con ES6

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la categoría es obligatorio'],
    trim: true,
    unique: true // Evita duplicados en la base de datos
  },
  description: {
    type: String,
    required: [true, 'La descripción es obligatoria'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active' // Coincide con la corrección A del Front
  },
  createdAt: {
    type: Date,
    default: Date.now // Mongo guardará la fecha e ISODate nativa
  }
}, {
  // Convierte los documentos para que expongan "id" virtual (remueve el guion bajo en las lecturas si es necesario)
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


const Category = mongoose.model('Category', CategorySchema);
export default Category; // <-- Esto corrige el error 'does not provide an export named default'