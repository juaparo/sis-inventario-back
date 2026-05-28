import MovementAdapter from '../adapters/MongooseMovementAdapter.js';
import ProductAdapter from '../adapters/MongooseProductAdapter.js';
import MovementFactory from '../factories/MovementFactory.js';
import ReportFactory from '../factories/ReportFactory.js';
import StockObserver from '../observers/StockObserver.js';

export const createMovement = async (req, res) => {
  try {
    const { type, product, quantity, reason, user, supplier } = req.body;

    // Validar producto
    const productDoc = await ProductAdapter.findById(product);
    if (!productDoc) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    if (productDoc.status === 'inactivo' || productDoc.status === 'inhabilitado') {
      return res.status(400).json({ message: 'No se pueden hacer movimientos de un producto inactivo' });
    }

    // Validar stock para salida
    if (type === 'SALIDA' && productDoc.stock < quantity) {
      return res.status(400).json({ message: 'Stock insuficiente para la salida' });
    }

    // Factory method
    const movementData = MovementFactory.createMovement(type, {
      product,
      quantity,
      reason,
      user,
      supplier
    });

    const savedMovement = await MovementAdapter.create(movementData);

    // Actualizar stock del producto
    if (type === 'ENTRADA') {
      productDoc.stock += quantity;
    } else if (type === 'SALIDA') {
      productDoc.stock -= quantity;
    }

    await ProductAdapter.update(productDoc._id, { stock: productDoc.stock });

    if (type === 'SALIDA') {
      StockObserver.emit('stockDecreased', productDoc);
    }

    res.status(201).json(savedMovement);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMovements = async (req, res) => {
  try {
    const movements = await MovementAdapter.findAll({}, ['product', 'user']);
    res.status(200).json(movements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportReport = async (req, res) => {
  try {
    const { format } = req.query; // 'PDF' o 'EXCEL'
    const movements = await MovementAdapter.findAll({});

    // Factory method
    const report = ReportFactory.createReport(format || 'PDF', movements);

    res.status(200).json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
