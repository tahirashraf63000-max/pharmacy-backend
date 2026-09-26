const BaseRepository = require("./BaseRepository");
const User = require("../models/User");

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmailWithPassword(email) {
    return this.model.findOne({ email }).select("+password");
  }

  async findByEmail(email) {
    return this.model.findOne({ email });
  }
}

module.exports = new UserRepository();
