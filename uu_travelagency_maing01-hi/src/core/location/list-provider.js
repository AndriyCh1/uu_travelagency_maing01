//@@viewOn:imports
import { createComponent, useDataList, useEffect, useRef } from "uu5g05";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

export const ListProvider = createComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "ListProvider",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const locationDataList = useDataList({
      handlerMap: {
        load: handleLoad,
        loadNext: handleLoadNext,
      },
      itemHandlerMap: {
        getImage: handleGetImage,
      },
    });

    const criteriaRef = useRef({});
    const imageUrlListRef = useRef([]);

    function handleLoad(criteria) {
      const dtoIn = { ...criteria };
      dtoIn.order = criteria.order || "asc";
      criteriaRef.current = dtoIn;

      return Calls.Location.list(dtoIn);
    }

    function handleLoadNext(pageInfo) {
      const dtoIn = { ...criteriaRef.current, pageInfo };
      return Calls.Location.list(dtoIn);
    }

    async function handleGetImage(location) {
      const dtoIn = { code: location.image };
      const image = await Calls.Location.getImage(dtoIn);
      const imageUrl = URL.createObjectURL(image);
      imageUrlListRef.current.push(imageUrl);

      return { ...location, image, imageUrl };
    }

    useEffect(() => {
      return () => imageUrlListRef.current.forEach((url) => URL.revokeObjectURL(url));
    }, []);
    //@@viewOff:private

    //@@viewOn:render
    return typeof props.children === "function" ? props.children(locationDataList) : props.children;
    //@@viewOff:render
  },
});

export default ListProvider;
