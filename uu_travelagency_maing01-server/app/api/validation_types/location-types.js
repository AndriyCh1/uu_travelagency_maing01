const locationCreateDtoInType = shape({
  name: string(1, 255).isRequired("image"),
  address: string(1, 255).isRequired(),
  country: string(1, 50).isRequired(),
  phone: string(1, 50).isRequired(),
  image: binary().isRequired("name"),
  link: string(1, 500),
});

const locationListDtoInType = shape({
  order: oneOf(["asc", "desc"]),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});
