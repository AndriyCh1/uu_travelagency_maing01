const { ObjectId } = require("bson");
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class TripMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, _id: 1 }, { unique: true });
    await super.createIndex({ awid: 1, price: 1 });
    await super.createIndex({ awid: 1, date: 1 });
    await super.createIndex({ awid: 1, locationId: 1, date: 1 });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    return await super.findOne({ id, awid });
  }

  async list(awid, sortBy, order, pageInfo) {
    const filter = { awid };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }

  async listByLocationIdAndDate(awid, sortBy, order, pageInfo, filterMap) {
    // TODO: fix date filter in listByLocationIdAndDate
    // date: {
    // $gte: ISODate(filterMap.dateFrom),
    //   $lte: new Date(filterMap.dateTo),
    // },

    let filter = {
      awid,
      date: {
        $gte: "2023-04-13",
        $lte: "2023-04-20",
      },
      locationId: filterMap.locationId,
    };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    return await super.find(filter, pageInfo, sort);
  }
}

module.exports = TripMongo;
