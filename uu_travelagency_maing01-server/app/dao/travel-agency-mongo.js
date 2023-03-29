"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TravelAgencyMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1 }, { unique: true });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async getByAwid(awid) {
    return await super.findOne({ awid });
  }

  async updateByAwid(travelAgencyInstance) {
    return await super.findOneAndUpdate({ awid: travelAgencyInstance.awid }, travelAgencyInstance, "NONE");
  }
}

module.exports = TravelAgencyMongo;
