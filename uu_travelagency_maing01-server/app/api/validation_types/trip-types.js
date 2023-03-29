const tripCreateDtoInType = shape({
  name: string(1, 255).isRequired(),
  date: date().isRequired(),
  price: float().isRequired(),
  freePlaces: integer(1, 10).isRequired(),
  locationId: id().isRequired(),
  text: string(1, 5000).isRequired(),
});
