const BaseRepository = require("./BaseRepository");
const Sale = require("../models/Sale");

class SaleRepository extends BaseRepository {
  constructor() {
    super(Sale);
  }
}

module.exports = new SaleRepository();
