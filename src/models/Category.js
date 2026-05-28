import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

const Category = mongoose.model('Category', CategorySchema);
export default Category;
