/* eslint-disable */

const sysUuAppWorkspaceInitDtoInType = shape({
  uuAppProfileAuthorities: uri().isRequired("uuBtLocationUri"),
  state: oneOf(["active", "underConstruction", "closed"]),
  name: uu5String(4000),
});
