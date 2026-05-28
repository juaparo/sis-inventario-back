import EventEmitter from 'events';
import AlertAdapter from '../adapters/MongooseAlertAdapter.js';

class StockObserver extends EventEmitter {
  constructor() {
    super();
    this.on('stockDecreased', this.handleStockDecreased.bind(this));
  }

  async handleStockDecreased(product) {
    // Definir stock mínimo predeterminado si el modelo no lo tiene explícito aún
    const minStock = product.minStock || 10;
    
    if (product.stock <= minStock) {
      // Crear registro de alerta
      const message = `Alerta: El producto ${product.name} ha alcanzado su límite de stock (${product.stock} restantes).`;
      const level = product.stock === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK';
      
      try {
        await AlertAdapter.create({
          product: product._id,
          message,
          level
        });
        console.log(`[Observer] Alerta generada para ${product.name}: ${level}`);
      } catch (err) {
        console.error('[Observer] Error al generar la alerta:', err);
      }
    }
  }
}

export default new StockObserver();
