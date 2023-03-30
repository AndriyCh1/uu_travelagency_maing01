//@@viewOn:imports
import { createVisualComponent, useScreenSize } from "uu5g05";
import Config from "./config/config";
//@@viewOff:imports

const Css = {
  routeContainer: (screenSize) => {
    let padding;
    let maxWidth;
    switch (screenSize) {
      case "xs":
      case "s":
        maxWidth = "100%";
        padding = "18px 18px";
        break;
      case "m":
      case "l":
        maxWidth = 640;
        padding = "22px 22px";
        break;
      case "xl":
      default:
        padding = "26px 26px";
        maxWidth = 1280;
    }
    return Config.Css.css`padding: ${padding};`;
  },
};

export const RouteContainer = createVisualComponent({
  render(props) {
    const [screenSize] = useScreenSize();
    return <div className={Css.routeContainer(screenSize)}>{props.children}</div>;
  },
});

export default RouteContainer;
