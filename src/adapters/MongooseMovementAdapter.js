import BaseAdapter from './BaseAdapter.js';
import Movement from '../models/Movement.js';

class MongooseMovementAdapter extends BaseAdapter {
  constructor() {
    super(Movement);
  }
}

export default new MongooseMovementAdapter();
