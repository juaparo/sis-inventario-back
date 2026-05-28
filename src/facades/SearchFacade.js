import ProductAdapter from '../adapters/MongooseProductAdapter.js';
import CategoryAdapter from '../adapters/MongooseCategoryAdapter.js';

export default class SearchFacade {
  /**
   * Realiza una búsqueda unificada en múltiples colecciones
   * ocultando la complejidad de instanciar y consultar varios adaptadores.
   */
  static async complexSearch(query) {
    const results = {
      products: [],
      categories: []
    };

    if (!query) return results;

    const regex = new RegExp(query, 'i');

    // Ejecutamos ambas búsquedas en paralelo para mayor eficiencia
    const [products, categories] = await Promise.all([
      ProductAdapter.findAll({
        $or: [
          { name: regex },
          { description: regex },
          { brand: regex }
        ]
      }),
      CategoryAdapter.findAll({
        $or: [
          { name: regex },
          { description: regex }
        ]
      })
    ]);

    results.products = products;
    results.categories = categories;

    return results;
  }
}
