//@@viewOn:imports
import { createComponent, PropTypes, useRoute } from "uu5g05";
import Uu5Elements, { Pending } from "uu5g05-elements";
import { Error } from "uu_plus4u5g02-elements";
import Config from "./config/config";
//@@viewOff:imports

export const DataObjectStateResolver = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "DataObjectStateResolver",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    dataObject: PropTypes.object.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const [, setRoute] = useRoute();
    //@@viewOff:private

    //@@viewOn:render
    const { dataObject, children, ...viewProps } = props;

    switch (dataObject.state) {
      case "ready":
      case "error":
      case "pending":
        return typeof children === "function" ? children() : children;
      case "readyNoData":
        return (
          <Uu5Elements.Text category="story" segment="heading" type="h4">
            No data found
          </Uu5Elements.Text>
        );
      case "pendingNoData":
        return <Pending {...viewProps} />;
      case "errorNoData":
        return (
          <Uu5Elements.Text category="story" segment="heading" type="h3">
            Not Found
          </Uu5Elements.Text>
        );
      default:
        return <Error {...viewProps} error={dataObject.errorData} />;
    }
    //@@viewOff:render
  },
});

export default DataObjectStateResolver;
