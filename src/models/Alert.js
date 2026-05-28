import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  message: {
    type: String,
    required: true
  },
  level: {
    type: String,
    enum: ['LOW_STOCK', 'OUT_OF_STOCK'],
    default: 'LOW_STOCK'
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Alert = mongoose.model('Alert', AlertSchema);
export default Alert;
