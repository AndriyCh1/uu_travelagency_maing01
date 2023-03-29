const { ObjectId } = require("bson");
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class LocationMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getById(awid, id) {
    return await super.findOne({ id, awid });
  }

  async list(awid, sortBy, order, pageInfo) {
    const filter = { awid };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = LocationMongo;
