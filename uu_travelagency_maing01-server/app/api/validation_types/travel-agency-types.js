/* eslint-disable */

const sysUuAppWorkspaceInitDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  uuBtLocationUri: uri().isRequired("uuAppProfileAuthorities"),
  state: oneOf(["active", "underConstruction"]),
  name: uu5String(4000),
});
