const UuTravelAgencyError = require("./uu-travel-agency-error");

const Create = {
  UC_CODE: `${UuTravelAgencyError.ERROR_PREFIX}location/create/`,

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
  LocationDaoCreateFailed: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}locationDaoCreateFailed`;
      this.message = "Create location by location DAO create failed.";
    }
  },
  InvalidImage: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}invalidImage`;
      this.message = "Image is invalid or it is not an image.";
    }
  },
  UuBinaryCreateFailed: class extends UuTravelAgencyError {
    constructor() {
      super(...arguments);
      this.code = `${Create.UC_CODE}uuBinaryCreateFailed`;
      this.message = "Create uuBinary failed.";
    }
  },
};

const List = {
  UC_CODE: `${UuTravelAgencyError.ERROR_PREFIX}location/list/`,

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

module.exports = {
  Create,
  List,
};
