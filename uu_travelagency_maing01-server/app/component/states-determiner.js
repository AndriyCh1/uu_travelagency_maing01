class StatesDeterminer {
  determine(allowedProfilesStates, uuIdentityProfiles) {
    let allowedUuIdentityStates = [];

    uuIdentityProfiles.forEach((profile) => {
      const profilesStates = allowedProfilesStates[profile];

      if (profilesStates) {
        allowedUuIdentityStates = allowedUuIdentityStates.concat(profilesStates);
      }
    });

    allowedUuIdentityStates = [...new Set(allowedUuIdentityStates)];

    return allowedUuIdentityStates;
  }
}

module.exports = new StatesDeterminer();
