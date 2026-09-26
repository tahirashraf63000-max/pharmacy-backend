const BaseRepository = require("./BaseRepository");
const Supplier = require("../models/Supplier");

class SupplierRepository extends BaseRepository {
  constructor() {
    super(Supplier);
  }
}

module.exports = new SupplierRepository();
