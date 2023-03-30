//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import { Text, Box } from "uu5g05-elements";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  text: () =>
    Config.Css.css({
      display: "block",
    }),
};
//@@viewOff:css

const Content = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Content",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripDataObject: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataObject, locationDataList } = props;

    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const trip = tripDataObject.data;
    const location = getLocationById(locationDataList.data, trip.locationId);

    return (
      <div {...attrs}>
        <Box>
          <Text className={Css.text()}>{trip.text}</Text>
          <Text className={Css.text()}>Name: {trip.name}</Text>
          <Text className={Css.text()}>Price: {trip.price}</Text>
          <Text className={Css.text()}>Free places: {trip.freePlaces}</Text>
          <Text className={Css.text()}>Location: {location.data.name}</Text>
        </Box>
      </div>
    );
    //@@viewOff:render
  },
});

//@@viewOn:helpers
function getLocationById(locationDataList, id) {
  const location = locationDataList.find((location) => location.data.id === id);
  return location;
}
//@@viewOff:helpers

export default Content;
