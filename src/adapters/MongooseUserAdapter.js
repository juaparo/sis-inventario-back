import BaseAdapter from './BaseAdapter.js';
import User from '../models/User.js';

class MongooseUserAdapter extends BaseAdapter {
  constructor() {
    super(User);
  }
}

export default new MongooseUserAdapter();
