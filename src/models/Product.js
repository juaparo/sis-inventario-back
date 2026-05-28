import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  precio: {
    type: Number,
    required: true,
    min: 0
  },
  stockActual: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  stockMinimo: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  activo: {
    type: Boolean,
    default: true
  },
  // clasifica: relación con Categoría (diagrama)
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  }
}, {
  timestamps: true
});

// IValidableStock: validarStock(): boolean
// Retorna true si el stock actual está por debajo del mínimo
ProductSchema.methods.validarStock = function () {
  return this.stockActual < this.stockMinimo;
};

// actualizarStock(cantidad:int): void — método del diagrama Producto
ProductSchema.methods.actualizarStock = function (tipoMovimiento, cantidad) {
  const n = Number(cantidad);
  if (tipoMovimiento === 'ENTRADA' || tipoMovimiento === 'DEVOLUCION') {
    this.stockActual += n;
  } else if (tipoMovimiento === 'SALIDA') {
    this.stockActual -= n;
  } else if (tipoMovimiento === 'AJUSTE') {
    this.stockActual = n;
  }
};

// cambiarEstado(): void — método del diagrama Producto
ProductSchema.methods.cambiarEstado = function () {
  this.activo = !this.activo;
};

const Product = mongoose.model('Product', ProductSchema);
export default Product;
