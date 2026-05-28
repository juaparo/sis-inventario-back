import Movement from '../models/Movement.js';
import Product from '../models/Product.js';
import { createAlert } from './alertController.js';

// Obtener todos los movimientos
export const getMovements = async (req, res) => {
  try {
    const movements = await Movement.find({})
      .populate('producto', 'nombre stockActual stockMinimo')
      .populate('usuario', 'name email')
      .sort({ fecha: -1 });
    return res.status(200).json(movements);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    return res.status(500).json({ message: 'Error al obtener los movimientos' });
  }
};

// Registrar un movimiento (registrarEntrada / registrarSalida del diagrama)
export const createMovement = async (req, res) => {
  const { tipoMovimiento, cantidad, productoId } = req.body;
  const usuarioId = req.user.id;

  try {
    if (!tipoMovimiento || !cantidad || !productoId) {
      return res.status(400).json({ message: 'Tipo de movimiento, cantidad y producto son requeridos' });
    }

    const product = await Product.findById(productoId);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (!product.activo) {
      return res.status(400).json({ message: 'No se pueden registrar movimientos de un producto inactivo' });
    }

    // actualizarStock según tipoMovimiento (método del diagrama Producto)
    const movement = new Movement({
      tipoMovimiento,
      cantidad,
      fecha: new Date(),
      usuario: usuarioId,
      producto: product._id
    });

    // validarStock(): boolean — método del diagrama Movimiento
    if (!movement.validarStock(product.stockActual)) {
      return res.status(400).json({ message: `Stock insuficiente. Disponible: ${product.stockActual} uds` });
    }

    product.actualizarStock(tipoMovimiento, cantidad);
    await product.save();
    await movement.save();

    // genera: si tras el movimiento el stock queda bajo el mínimo, crear alerta
    // validarStock() del diagrama IValidableStock
    if (product.validarStock()) {
      await createAlert({
        mensaje: `Stock bajo tras movimiento (${tipoMovimiento}): "${product.nombre}" tiene ${product.stockActual} uds (mín: ${product.stockMinimo})`,
        tipoOrigen: 'movimiento',
        referenciaId: movement._id
      });
    }

    const populated = await Movement.findById(movement._id)
      .populate('producto', 'nombre stockActual stockMinimo')
      .populate('usuario', 'name email');

    return res.status(201).json(populated);
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    return res.status(500).json({ message: 'Error al registrar el movimiento' });
  }
};
