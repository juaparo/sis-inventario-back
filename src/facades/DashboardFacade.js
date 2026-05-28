import Product from '../models/Product.js';
import Movement from '../models/Movement.js';
import Alert from '../models/Alert.js';

export class DashboardFacade {
  static async getDashboardData() {
    // 1. Estadísticas Generales
    const totalProducts = await Product.countDocuments();
    const activeProducts = await Product.countDocuments({ status: 'active' });
    
    // Calcular el valor total del inventario
    const products = await Product.find({}, 'price stock');
    const inventoryValue = products.reduce((acc, p) => acc + (p.price * p.stock), 0);

    // Alertas activas no leídas
    const activeAlerts = await Alert.countDocuments({ read: false });

    const stats = {
      totalProducts,
      activeProducts,
      inventoryValue,
      activeAlerts
    };

    // 2. Productos con Stock Bajo (<= minStock)
    const lowStockProducts = await Product.find({
      $expr: { $lte: ['$stock', '$minStock'] },
      status: 'active'
    }).limit(10).select('name category stock minStock');

    // 3. Movimientos Recientes
    const recentMovements = await Movement.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('product', 'name')
      .populate('user', 'name');

    // Formatear movimientos para facilitar la vida al frontend
    const formattedMovements = recentMovements.map(m => ({
      product: m.product ? m.product.name : 'Desconocido',
      type: m.type,
      quantity: m.quantity,
      user: m.user ? m.user.name : 'Desconocido',
      date: m.createdAt
    }));

    return {
      stats,
      lowStockProducts,
      recentMovements: formattedMovements
    };
  }
}
