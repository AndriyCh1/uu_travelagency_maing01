//@@viewOn:imports
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { Schemas } = require("../abl/constants");
//@@viewOff:imports

//@@viewOn:components
class InstanceChecker {
  constructor() {
    this.dao = DaoFactory.getDao(Schemas.TRAVEL_AGENCY);
  }

  async ensureInstanceAndState(awid, allowedStateRules, authorizationResult, errors, uuAppErrorMap = {}) {
    // HDS 1
    const travelAgency = await this.ensureInstance(awid, errors, uuAppErrorMap);

    // HDS 2
    const authorizedProfiles = authorizationResult.getAuthorizedProfiles();
    const allowedStates = allowedStateRules[authorizedProfiles[0]];

    // HDS 3
    if (!allowedStates.has(travelAgency.state)) {
      throw new errors.TravelAgencyNotInCorrectState(
        { uuAppErrorMap },
        {
          awid,
          state: travelAgency.state,
          expectedState: [...allowedStates],
        }
      );
    }

    return travelAgency;
  }

  async ensureInstance(awid, errors, uuAppErrorMap) {
    // HDS 1
    let travelAgency = await this.dao.getByAwid(awid);

    // HDS 2
    if (!travelAgency) {
      throw new errors.TravelAgencyDoesNotExist({ uuAppErrorMap }, { awid });
    }

    return travelAgency;
  }
}
//@@viewOff:components

//@@viewOn:exports
module.exports = new InstanceChecker();
//@@viewOff:exports
