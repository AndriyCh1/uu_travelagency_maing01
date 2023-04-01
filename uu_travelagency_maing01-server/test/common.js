const fs = require("fs");
const path = require("path");

const getImageStream = () => {
  return fs.createReadStream(path.resolve(__dirname, "image.jpg"));
};

const getTomorrowDate = () => {
  const today = new Date();
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000); // add one day in milliseconds
  const tomorrowDate = tomorrow.toISOString().slice(0, 10);

  return tomorrowDate;
};
const constants = {
  Commands: {
    TRAVEL_AGENCY_ASSIGN: "sys/uuAppWorkspace/assign",
    TRAVEL_AGENCY_INIT: "sys/uuAppWorkspace/init",
    TRAVEL_AGENCY_LOAD: "sys/uuAppWorkspace/load",

    TRIP_CREATE: "trip/create",
    TRIP_LIST: "trip/list",
    TRIP_GET: "trip/get",
    TRIP_UPDATE: "trip/update",
    TRIP_DELETE: "trip/delete",

    LOCATION_CREATE: "location/create",
    LOCATION_LIST: "location/list",
    LOCATION_GET: "location/get",
  },
  Profiles: {
    AWID_LICENSE_OWNER: "AwidLicenseOwner",
    AWID_INITIATOR: "AwidInitiator",
    AUTHORITIES: "Authorities",
    TRIP_EXECUTIVES: "TripExecutives",
    LOCATION_EXECUTIVES: "LocationExecutives",
    READERS: "Readers",
  },
};

module.exports = {
  getImageStream,
  getTomorrowDate,
  ...constants,
};
