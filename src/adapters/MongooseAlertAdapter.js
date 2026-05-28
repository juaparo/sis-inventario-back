import BaseAdapter from './BaseAdapter.js';
import Alert from '../models/Alert.js';

class MongooseAlertAdapter extends BaseAdapter {
  constructor() {
    super(Alert);
  }
}

export default new MongooseAlertAdapter();
