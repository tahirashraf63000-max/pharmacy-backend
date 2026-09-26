const BaseRepository = require("./BaseRepository");
const Category = require("../models/Category");

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findByName(name) {
    return this.model.findOne({ name: new RegExp(`^${name}$`, "i") });
  }
}

module.exports = new CategoryRepository();
