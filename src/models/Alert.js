import mongoose from 'mongoose';

// S - Single Responsibility: este schema SOLO define la estructura de una alerta
const AlertSchema = new mongoose.Schema({
  mensaje: {
    type: String,
    required: true,
    trim: true
  },
  // fecha: campo explícito según diagrama de clases (Entregable 2)
  fecha: {
    type: Date,
    default: Date.now,
    required: true
  },
  leida: {
    type: Boolean,
    default: false
  },
  // tipoOrigen identifica si la alerta fue generada por un movimiento o un producto
  tipoOrigen: {
    type: String,
    enum: ['movimiento', 'producto'],
    required: true
  },
  // referenciaId guarda el _id del documento que generó la alerta (para redirección)
  referenciaId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
}, {
  timestamps: true
});

const Alert = mongoose.model('Alert', AlertSchema);
export default Alert;
