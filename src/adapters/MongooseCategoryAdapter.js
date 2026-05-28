import BaseAdapter from './BaseAdapter.js';
import Category from '../models/category.js';

class MongooseCategoryAdapter extends BaseAdapter {
  constructor() {
    super(Category);
  }
}

export default new MongooseCategoryAdapter();
