require("dotenv").config();
const app = require("./src/app");
const database = require("./src/config/database");

const PORT = process.env.PORT || 5000;

(async () => {
  await database.connect();
  app.listen(PORT, () => {
    console.log(`Pharmacy POS API server running on port ${PORT}`);
  });
})();
