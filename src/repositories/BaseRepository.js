/**
 * BaseRepository centralizes common Mongoose data-access operations so
 * individual repositories only need to add model-specific query logic.
 */
class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return this.model.create(data);
  }

  async findById(id, populate = []) {
    let query = this.model.findById(id);
    populate.forEach((p) => (query = query.populate(p)));
    return query;
  }

  async findOne(filter, populate = []) {
    let query = this.model.findOne(filter);
    populate.forEach((p) => (query = query.populate(p)));
    return query;
  }

  async findMany(filter = {}, { skip = 0, limit = 10, sort = { createdAt: -1 }, populate = [] } = {}) {
    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);
    populate.forEach((p) => (query = query.populate(p)));
    return query;
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }

  async updateById(id, data) {
    return this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;
