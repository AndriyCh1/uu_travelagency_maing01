const { ObjectId } = require("bson");
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TripMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, price: 1 });
    await super.createIndex({ awid: 1, date: 1 });
    await super.createIndex({ awid: 1, locationId: 1, date: 1 });
  }
}

module.exports = TripMongo;
