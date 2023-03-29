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

    get NonFinalStates() {
      return new Set([this.States.ACTIVE, this.States.UNDER_CONSTRUCTION]);
    },
  },
};

module.exports = Constants;
