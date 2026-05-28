import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  stock: { type: Number, required: true, default: 0 },
  minStock: { type: Number, required: true, default: 0 },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
}, { 
  timestamps: true // Esto genera automáticamente los campos createdAt y updatedAt
});

// Mongoose buscará o creará la colección 'products' en plural de forma automática
const Product = mongoose.model('Product', productSchema);
export default Product;