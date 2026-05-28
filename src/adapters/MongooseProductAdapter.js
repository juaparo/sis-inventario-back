import BaseAdapter from './BaseAdapter.js';
import Product from '../models/product.js';

class MongooseProductAdapter extends BaseAdapter {
  constructor() {
    super(Product);
  }
}

export default new MongooseProductAdapter();
