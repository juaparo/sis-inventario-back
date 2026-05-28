import mongoose from 'mongoose';

const MovementSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  type: {
    type: String,
    enum: ['ENTRADA', 'SALIDA'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  reason: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplier: {
    type: String, // Or ObjectId ref to Supplier if that model existed
    required: false
  }
}, {
  timestamps: true
});

const Movement = mongoose.model('Movement', MovementSchema);
export default Movement;
