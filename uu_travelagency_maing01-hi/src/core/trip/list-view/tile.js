//@@viewOn:imports
import "uu5g04-bricks";
import { createVisualComponent, Utils } from "uu5g05";
import Uu5Elements, { Text } from "uu5g05-elements";
import Config from "./config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  content: () => Config.Css.css({}),
  text: (parent) =>
    Config.Css.css({
      display: "block",
      marginLeft: parent.padding.left,
      marginRight: parent.padding.right,
      marginBottom: parent.padding.bottom,
      marginTop: parent.padding.top,
    }),

  image: () => Config.Css.css({ width: "100%" }),
};
//@@viewOff:css

export const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { data: tripDataObject } = props;
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    const trip = tripDataObject.data;

    return (
      <Uu5Elements.Tile
        {...elementProps}
        header={<Header trip={trip} />}
        footerSignificance="distinct"
        significance="subdued"
        borderRadius="elementary"
      >
        {(tile) => (
          <div className={Css.content()}>
            <Text
              category="interface"
              segment="content"
              type="medium"
              colorScheme="building"
              className={Css.text(tile)}
            >
              Location: {trip.locationId}
            </Text>
            <Text className={Css.text(tile)}>Price: {trip.price}</Text>
            <Text className={Css.text(tile)}>Date: {trip.date}</Text>
            <Text className={Css.text(tile)}>Free places: {trip.freePlaces}</Text>
          </div>
        )}
      </Uu5Elements.Tile>
    );
    //@@viewOff:render
  },
});

function Header({ trip }) {
  return (
    <Text category="interface" segment="title" type="micro" colorScheme="building">
      {trip.name}
    </Text>
  );
}

export default Tile;
