const Constants = {
  Schemas: {
    PARTICIPANT: "participant",
    TRIP: "trip",
    TRAVEL_AGENCY: "travelAgency",
    LOCATION: "location",
  },
  Profiles: {
    AUTHORITIES: "Authorities",
    TRIP_EXECUTIVES: "TripExecutives",
    LOCATION_EXECUTIVES: "LocationExecutives",
    READERS: "Readers",
  },
  TravelAgency: {
    States: {
      INIT: "init",
      ACTIVE: "active",
      UNDER_CONSTRUCTION: "underConstruction",
      CLOSED: "closed",
    },
  },
  Trip: {
    States: {
      INIT: "init",
      ACTIVE: "active",
      CLOSED: "closed",
    },
  },
  Location: {
    States: {
      ACTIVE: "active",
      PROBLEM: "problem",
      CLOSED: "closed",
    },
  },
};

module.exports = Constants;
