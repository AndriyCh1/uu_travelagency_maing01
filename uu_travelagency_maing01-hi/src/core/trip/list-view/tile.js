//@@viewOn:imports
import "uu5g04-bricks";
import { createVisualComponent, useEffect, Utils } from "uu5g05";
import Uu5Elements, { Text, Button, Pending, Icon } from "uu5g05-elements";
import Config from "./config/config";
import ImagePlaceholder from "../../../assets/image-placeholder.jpg";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: () =>
    Config.Css.css({
      display: "flex",
      margin: "10px",
      gap: "10px",
    }),
  imageContainer: () =>
    Config.Css.css({
      width: "50%",
    }),
  image: () =>
    Config.Css.css({
      width: "100%",
      height: "200px",
      objectFit: "cover",
    }),
  contentContainer: () =>
    Config.Css.css({
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      width: "49.99%",
      gap: "15px",
    }),
  content: () =>
    Config.Css.css({
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      overflow: "hidden",
      height: "100%",
    }),
  actionButtons: () =>
    Config.Css.css({
      marginLeft: "auto",
    }),
  price: () =>
    Config.Css.css({
      fontSize: "22px",
      color: "primary",
    }),
  mainInfo: () =>
    Config.Css.css({
      fontSize: "16px",
      color: "primary",
      display: "flex",
      gap: "10px",
    }),
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
    const { tripDataObject, locationDataObject, onDetail } = props;
    const actionsDisabled = tripDataObject.state === "pending" || locationDataObject.state === "pending";

    const handleDetail = () => {
      onDetail(tripDataObject.data);
    };

    useEffect(() => {
      if (
        locationDataObject.data.image &&
        !locationDataObject.data.imageUrl &&
        locationDataObject.state === "ready" &&
        locationDataObject.handlerMap?.getImage
      ) {
        locationDataObject.handlerMap
          .getImage(locationDataObject.data)
          .catch((error) => Tile.logger.error("Error loading image", error));
      }
    }, [locationDataObject]);

    const handleUpdate = () => {};
    const handleDelete = () => {};

    const getActions = () => {
      const actionList = [];

      actionList.push({
        icon: "mdi-pencil",
        onClick: handleUpdate,
        disabled: actionsDisabled,
      });

      actionList.push({
        icon: "mdi-delete",
        onClick: handleDelete,
        disabled: actionsDisabled,
      });

      return actionList;
    };
    //@@viewOff:private

    //@@viewOn:render
    const { elementProps } = Utils.VisualComponent.splitProps(props);

    const trip = tripDataObject.data;
    const location = locationDataObject.data;

    return (
      <Uu5Elements.Tile
        {...elementProps}
        header={<Header trip={trip} />}
        footerSignificance="distinct"
        significance="subdued"
        borderRadius="expressive"
        actionList={getActions()}
      >
        {(tile) => (
          <div className={Css.container()}>
            <div className={Css.imageContainer()}>
              {location.imageUrl && <img src={location.imageUrl} alt={location.name} className={Css.image()} />}
              {location.image && !location.imageUrl && <Pending size="xl" />}
              {!location.image && !location.imageUrl && (
                <img src={ImagePlaceholder} alt={"lsi.no images"} className={Css.image()} />
              )}
            </div>
            <div className={Css.contentContainer()}>
              <div className={Css.content()}>
                <Text>{location.name}</Text>
                <Text>{trip.freePlaces} place (-s) left</Text>
                <div className={Css.mainInfo()}>
                  <Text>{trip.date}</Text>
                  <Text>{trip.price} €</Text>
                </div>
              </div>

              <div className={Css.actionButtons()}>
                <Button onClick={handleDetail}>
                  <Icon icon="eye" />
                  Lsi View details
                </Button>
              </div>
            </div>
          </div>
        )}
      </Uu5Elements.Tile>
    );
    //@@viewOff:render
  },
});

function Header({ trip }) {
  return (
    <Text category="interface" segment="title" type="minor" colorScheme="building">
      {trip.name}
    </Text>
  );
}

export default Tile;
