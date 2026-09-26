const BaseRepository = require("./BaseRepository");
const Purchase = require("../models/Purchase");

class PurchaseRepository extends BaseRepository {
  constructor() {
    super(Purchase);
  }
}

module.exports = new PurchaseRepository();
