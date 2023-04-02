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
    return await super.findOne({ id, awid }, { state: 0, creationDate: 0 });
  }

  async list(awid, sortBy, order, pageInfo) {
    const filter = { awid };

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    const projection = {
      uuIdentity: 0,
      creatorName: 0,
      creationDate: 0,
      state: 0,
    };

    return await super.find(filter, pageInfo, sort, projection);
  }

  async listByLocationIdAndDate(awid, sortBy, order, pageInfo, filterMap) {
    let filter = { awid };
    let dateFilter = {};

    if (filterMap?.dateFrom) {
      dateFilter.$gte = filterMap.dateFrom;
    }

    if (filterMap?.dateTo) {
      dateFilter.$lte = filterMap.dateTo;
    }

    if (filterMap?.locationId) {
      filter.locationId = filterMap.locationId;
    }

    if (Object.keys(dateFilter).length) {
      filter.date = dateFilter;
    }

    const sort = {
      [sortBy]: order === "asc" ? 1 : -1,
    };

    const projection = {
      text: 0,
      uuIdentity: 0,
      creatorName: 0,
      creationDate: 0,
      state: 0,
    };

    return await super.find(filter, pageInfo, sort, projection);
  }

  async update(uuObject) {
    if (uuObject.locationId) {
      uuObject.locationId = new ObjectId(uuObject.locationId);
    }

    const filter = { id: uuObject.id, awid: uuObject.awid };

    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    await super.deleteOne({ awid, id });
  }
}

module.exports = TripMongo;
