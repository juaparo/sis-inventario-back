import BaseAdapter from './BaseAdapter.js';
import Role from '../models/Role.js';

class MongooseRoleAdapter extends BaseAdapter {
  constructor() {
    super(Role);
  }
}

export default new MongooseRoleAdapter();
