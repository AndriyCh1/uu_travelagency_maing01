const tripCreateDtoInType = shape({
  name: string(1, 255).isRequired(),
  date: date().isRequired(),
  price: float().isRequired(),
  freePlaces: integer(1, 10).isRequired(),
  locationId: id().isRequired(),
  text: string(1, 5000).isRequired(),
});

const tripListDtoInType = shape({
  sortBy: oneOf(["date", "price"]),
  order: oneOf(["asc", "desc"]),
  filterMap: shape({
    locationId: id(),
    dateFrom: date(),
    dateTo: date(),
  }),
  pageInfo: shape({
    pageIndex: integer(),
    pageSize: integer(),
  }),
});

const tripGetDtoInType = shape({
  id: id().isRequired(),
});

const tripUpdateDtoInType = shape({
  id: id().isRequired(),
  name: string(1, 255),
  date: date(),
  price: float(),
  locationId: id(),
  text: string(1, 5000),
});

const tripDeleteDtoInType = shape({
  id: id().isRequired(),
});
