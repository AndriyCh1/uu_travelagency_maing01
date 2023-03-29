const UuTravelAgencyError = require("./uu-travel-agency-error");

const Create = {
  UC_CODE: `${UuTravelAgencyError.ERROR_PREFIX}trip/create/`,

  InvalidDtoIn: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  TravelAgencyDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyDoesNotExist`;
      this.message = "UuObject travelAgencyDoesNotExist does not exist.";
    }
  },
  TravelAgencyNotInCorrectState: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyNotInCorrectState`;
      this.message = "UuObject travelAgency is not in correct state.";
    }
  },
  InvalidDate: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDate`;
      this.message = "Invalid date - it cannot be less then creationDate.";
    }
  },
  LocationDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationDoesNotExist`;
      this.message = "Provided location does not exist.";
    }
  },
  LocationIsUnavailable: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsUnavailable`;
      this.message = "Location is unavailable.";
    }
  },
  TripDaoCreateFailed: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}tripDaoCreateFailed`;
      this.message = "Create trip by trip DAO create failed.";
    }
  },
};

const Get = {
  UC_CODE: `${UuTravelAgencyError.ERROR_PREFIX}trip/get/`,

  InvalidDtoIn: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  TravelAgencyDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyDoesNotExist`;
      this.message = "UuObject travelAgency does not exist.";
    }
  },
  TravelAgencyNotInCorrectState: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyNotInCorrectState`;
      this.message = "UuObject travelAgency is not in correct state.";
    }
  },
  TripDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}tripDoesNotExist`;
      this.message = "Trip does not exist.";
    }
  },
};

const List = {
  UC_CODE: `${UuTravelAgencyError.ERROR_PREFIX}trip/list/`,

  InvalidDtoIn: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  TravelAgencyDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyDoesNotExist`;
      this.message = "UuObject travelAgency does not exist.";
    }
  },
  TravelAgencyNotInCorrectState: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyNotInCorrectState`;
      this.message = "UuObject travelAgency is not in correct state.";
    }
  },
};

const Update = {
  UC_CODE: `${UuTravelAgencyError.ERROR_PREFIX}trip/update/`,

  InvalidDtoIn: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  TravelAgencyDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyDoesNotExist`;
      this.message = "UuObject travelAgency does not exist.";
    }
  },
  TravelAgencyNotInCorrectState: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyNotInCorrectState`;
      this.message = "UuObject travelAgency is not in correct state.";
    }
  },
  UserNotAuthorized: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "User not authorized.";
    }
  },
  TripDoesnotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}tripDoesnotExist`;
      this.message = "Trip does not exist.";
    }
  },
  UpdatingUnavailable: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}updatingUnavailable`;
      this.message = "The trip has participants and its state of trip is active.";
    }
  },
  LocationDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationDoesNotExist`;
      this.message = "Provided location does not exist.";
    }
  },
  LocationIsUnavailable: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationIsUnavailiable`;
      this.message = "Location is unavailable.";
    }
  },
  InvalidDate: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDate`;
      this.message = "Invalid date - it cannot be less then creationDate.";
    }
  },
  TripDaoUpdateFailed: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDate`;
      this.message = "Update trip by trip Dao update failed.";
    }
  },
};

const Delete = {
  UC_CODE: `${UuTravelAgencyError.ERROR_PREFIX}trip/delete/`,

  InvalidDtoIn: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },
  TravelAgencyDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyDoesNotExist`;
      this.message = "UuObject travelAgency does not exist.";
    }
  },
  TravelAgencyNotInCorrectState: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}travelAgencyNotInCorrectState`;
      this.message = "UuObject travelAgency is not in correct state.";
    }
  },
  UserNotAuthorized: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidDtoIn`;
      this.message = "User not authorized.";
    }
  },
  TripDoesNotExist: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}tripDoesNotExist`;
      this.message = "Trip does not exist.";
    }
  },
  DeletingUnavailable: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}deletingUnavailable`;
      this.message = "The trip is not in closed state.";
    }
  },
};

module.exports = {
  List,
  Get,
  Create,
  Update,
  Delete,
};
