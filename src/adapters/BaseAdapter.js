export default class BaseAdapter {
  constructor(model) {
    if (this.constructor === BaseAdapter) {
      throw new Error("Cannot instantiate abstract class BaseAdapter");
    }
    this.model = model;
  }

  async findById(id, populateOpts = [], selectOpts = '') {
    let query = this.model.findById(id);
    if (selectOpts) {
      query = query.select(selectOpts);
    }
    if (populateOpts.length > 0) {
      populateOpts.forEach(opt => { query = query.populate(opt); });
    }
    return await query.exec();
  }

  async findOne(filter, populateOpts = [], selectOpts = '') {
    let query = this.model.findOne(filter);
    if (selectOpts) {
      query = query.select(selectOpts);
    }
    if (populateOpts.length > 0) {
      populateOpts.forEach(opt => { query = query.populate(opt); });
    }
    return await query.exec();
  }

  async findAll(filter = {}, populateOpts = [], selectOpts = '') {
    let query = this.model.find(filter);
    if (selectOpts) {
      query = query.select(selectOpts);
    }
    if (populateOpts.length > 0) {
      populateOpts.forEach(opt => { query = query.populate(opt); });
    }
    return await query.exec();
  }

  async create(data) {
    const item = new this.model(data);
    return await item.save();
  }

  async update(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id) {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return await this.model.countDocuments(filter);
  }

  async aggregate(pipeline) {
    return await this.model.aggregate(pipeline);
  }
}
