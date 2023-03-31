//@@viewOn:imports
import { createVisualComponent, Utils, PropTypes, useEffect, useScreenSize, useLsi } from "uu5g05";
import { Text, Icon, Link, Button, DateTime, Tabs, Box, Pending } from "uu5g05-elements";
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
        styles = { display: "flex", gap: "25px" };
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
        styles = { width: "auto", maxWidth: "500px" };
        break;
      default:
        styles = { width: "100%", marginBottom: "10px" };
    }

    return Config.Css.css(styles);
  },
  image: () =>
    Config.Css.css({
      width: "100%",
      maxHeight: "450px",
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
      height: "100%",
    }),
  text: () =>
    Config.Css.css({
      display: "block",
      marginTop: "10px",
      marginBottom: "10px",
      fontSize: "1.1rem",
    }),
  footer: () =>
    Config.Css.css({
      padding: "10px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      fontSize: "1rem",
    }),
  button: () =>
    Config.Css.css({
      fontSize: "1rem",
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
    locationDataObject: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataObject, locationDataObject } = props;
    const lsi = useLsi(importLsi, [Content.uu5Tag]);

    useEffect(() => {
      if (
        locationDataObject.data.image &&
        !locationDataObject.data.imageUrl &&
        locationDataObject.state === "ready" &&
        locationDataObject.handlerMap?.getImage
      ) {
        locationDataObject.handlerMap
          .getImage(locationDataObject.data)
          .catch((e) => Content.logger.error("Error loading image", e));
      }
    }, [locationDataObject]);

    const handleShowParticipants = () => {
      console.log("----- handleShowParticipants");
    };

    const handleSignUp = () => {
      console.log("----- handleSignUp");
    };
    //@@viewOff:private

    //@@viewOn:render
    const attrs = Utils.VisualComponent.getAttrs(props);
    const trip = tripDataObject.data;
    const location = locationDataObject.data;

    return (
      <div {...attrs}>
        <Tabs
          itemList={[
            {
              label: lsi.details,
              icon: "mdi-information-outline",
              children: <Details trip={trip} location={location} lsi={lsi} />,
            },
            { label: lsi.participants, icon: "mdi-account-group", children: "Participants" },
          ]}
        />
        <Box significance="distinct" className={Css.footer()}>
          <div>
            <Text>
              {trip.creatorName}, <DateTime dateFormat="short" timeFormat="none" value={trip.creationDate} />
            </Text>
          </div>
          <Button onClick={handleSignUp} className={Css.button()}>
            {lsi.signUp}
          </Button>
        </Box>
      </div>
    );
    //@@viewOff:render
  },
});

function Details({ trip, location, lsi }) {
  const [screenSize] = useScreenSize();

  return (
    <>
      <div className={Css.container(screenSize)}>
        <div className={Css.imageContainer(screenSize)}>
          {location.imageUrl && <img src={location.imageUrl} alt={location.name} className={Css.image()} />}
          {location.image && !location.imageUrl && <Pending size="xl" />}
          {!location.image && !location.imageUrl && (
            <img src={ImagePlaceholder} alt={lsi.noImage} className={Css.image()} />
          )}
        </div>
        <div className={Css.content()}>
          <Info label={lsi.tripName} icon="mdi-information">
            {trip.name}
          </Info>
          <Info label={lsi.price} icon="mdi-cash">
            {trip.price} €
          </Info>
          <Info label={lsi.freePlaces} icon="mdi-account-multiple">
            {trip.freePlaces}
          </Info>
          <Info label={lsi.location} icon="mdi-map-marker">
            {location.name}
          </Info>
          <Info label={lsi.date} icon="mdi-calendar-multiple">
            {trip.date}
          </Info>
          <Info label={lsi.locationLink} icon="mdi-link-variant">
            <Link href={location.link}>{location.link}</Link>
          </Info>
        </div>
      </div>
    </>
  );
}
function Info({ children, label, icon, ...props }) {
  return (
    <Text className={Css.text()} {...props}>
      <Icon
        icon={icon}
        className={Config.Css.css({
          marginRight: "10px",
          fontSize: "1.3rem",
        })}
      />
      {label}: {children}
    </Text>
  );
}
export default Content;
