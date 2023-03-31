//@@viewOn:imports
import { createVisualComponent, useEffect, Utils, PropTypes, useLsi, useScreenSize } from "uu5g05";
import Uu5Elements, { Text, Button, Pending, Icon, Box } from "uu5g05-elements";
import Config from "./config/config";
import ImagePlaceholder from "../../../assets/image-placeholder.jpg";
import importLsi from "../../../lsi/import-lsi";

//@@viewOff:imports

//@@viewOn:css
const Css = {
  container: (screenSize) => {
    let styles;

    switch (screenSize) {
      case "m":
      case "l":
      case "xl":
        styles = { display: "flex", gap: "15px" };
        break;
      default:
        styles = { display: "block" };
    }

    return Config.Css.css({ ...styles, margin: "10px" });
  },
  imageContainer: (screenSize) => {
    let styles;

    switch (screenSize) {
      case "m":
      case "l":
      case "xl":
        styles = { width: "50%" };
        break;
      default:
        styles = { width: "100%", marginBottom: "10px" };
    }

    return Config.Css.css({ ...styles });
  },
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
      gap: "15px",
    }),
  content: () =>
    Config.Css.css({
      display: "flex",
      flexDirection: "column",
      alignItems: "start",
      overflow: "hidden",
      height: "100%",
      fontSize: "1rem",
      gap: "15px",
    }),
  text: () =>
    Config.Css.css({
      verticalAlign: "center",
    }),
  icon: () =>
    Config.Css.css({
      marginRight: "10px",
      fontSize: "1.4rem",
    }),
  actionButtons: () =>
    Config.Css.css({
      marginLeft: "auto",
    }),
};
//@@viewOff:css

export const Tile = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Tile",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripDataObject: PropTypes.object.isRequired,
    locationDataObject: PropTypes.object.isRequired,
    onDetail: PropTypes.func,
    onUpdate: PropTypes.func,
    onDelete: PropTypes.func,
    tripsPermissions: PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataObject, locationDataObject, onDetail, onDelete } = props;
    const actionsDisabled = tripDataObject.state === "pending" || locationDataObject.state === "pending";
    const lsi = useLsi(importLsi, [Tile.uu5Tag]);
    const [screenSize] = useScreenSize();

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
          .catch((e) => Tile.logger.error("Error loading image", e));
      }
    }, [locationDataObject]);

    const handleUpdate = (event) => {
      event.stopPropagation();
      props.onUpdate(tripDataObject);
    };

    const handleDelete = (event) => {
      event.stopPropagation();
      onDelete(tripDataObject);
    };

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
          <div className={Css.container(screenSize)}>
            <div className={Css.imageContainer(screenSize)}>
              {location.imageUrl && <img src={location.imageUrl} alt={location.name} className={Css.image()} />}
              {location.image && !location.imageUrl && <Pending size="xl" />}
              {!location.image && !location.imageUrl && (
                <img src={ImagePlaceholder} alt={lsi.noImage} className={Css.image()} />
              )}
            </div>
            <div className={Css.contentContainer()}>
              <div className={Css.content()}>
                <Text className={Css.text()}>
                  <Icon icon="mdi-map-marker" className={Css.icon()} />
                  {location.name}
                </Text>
                <Text className={Css.text()}>
                  <Icon icon="mdi-account-multiple" className={Css.icon()} />
                  {Utils.String.format(lsi.freePlaces, trip.freePlaces)}
                </Text>
                <Text className={Css.text()}>
                  <Icon icon="mdi-calendar-multiple" className={Css.icon()} />
                  {trip.date}
                </Text>
                <Text className={Css.text()}>
                  <Icon icon="mdi-cash" className={Css.icon()} />
                  {trip.price} €
                </Text>
              </div>
              <div className={Css.actionButtons()}>
                <Button onClick={handleDetail}>
                  <Icon icon="eye" />
                  {lsi.seeMore}
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
