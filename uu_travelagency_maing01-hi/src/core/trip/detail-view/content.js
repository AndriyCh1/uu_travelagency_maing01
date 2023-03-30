//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, Utils, PropTypes } from "uu5g05";
import { Text, Line, Icon, Link } from "uu5g05-elements";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  image: () =>
    Config.Css.css({
      display: "block",
      maxWidth: "35%",
      margin: "auto",
    }),

  text: () =>
    Config.Css.css({
      display: "block",
      marginTop: "10px",
      marginBottom: "10px",
      fontSize: "18px",
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
        {location.imageUrl && <img src={location.imageUrl} alt={location.name} className={Css.image()} />}
        <Text className={Css.text()}>
          <Icon icon="uugdsstencil-communication-comment-text-solid" />
          Update{trip.text}
        </Text>
        <Line significance="subdued" />
        <Text className={Css.text()}>
          <Icon icon="uugdsstencil-commerce-tag" />
          Price: {trip.price} €
        </Text>
        <Line significance="subdued" />
        <Text className={Css.text()}>
          <Icon icon="uugds-account-multi" />
          Free places: {trip.freePlaces}{" "}
        </Text>
        <Line significance="subdued" />
        <Text className={Css.text()}>
          <Icon icon="uugdsstencil-navigation-navigation-gps" />
          Location: {location.data.name}
        </Text>
        <Line significance="subdued" />
        <Text className={Css.text()}>
          <Icon icon="uugds-paperclip" />
          <Link href={location.data.link}>{location.data.link}</Link>
        </Text>
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
