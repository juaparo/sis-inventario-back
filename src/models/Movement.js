import mongoose from 'mongoose';

// TipoMovimiento: enum del diagrama de clases (Entregable 2)
const TipoMovimiento = ['ENTRADA', 'SALIDA', 'AJUSTE', 'DEVOLUCION'];

const MovementSchema = new mongoose.Schema({
  tipoMovimiento: {
    type: String,
    enum: TipoMovimiento,
    required: true
  },
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  // realiza: relación con Usuario (diagrama)
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // afecta: relación con Producto (diagrama)
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  }
}, {
  timestamps: true
});

// validarStock(): boolean — método del diagrama Movimiento
// Valida si hay stock suficiente para ejecutar el movimiento (especialmente SALIDA)
MovementSchema.methods.validarStock = function (stockActual) {
  if (this.tipoMovimiento === 'SALIDA') {
    return stockActual >= this.cantidad;
  }
  return true;
};

const Movement = mongoose.model('Movement', MovementSchema);
export default Movement;
