import UuTravelagency from "uu_travelagency_maing01-hi";
import { testProperties } from "uu5g05-test";

const CONFIG = {
  props: {
    // left: {
    //   values: ["Left as text", <span key="l">Left as JSX</span>, 0],
    // },
  },
  requiredProps: {
    // children: "Children content",
  },
};

describe(`UuTravelagency.Core.Trip.ListView.Content`, () => {
  testProperties(UuTravelagency.Core.Trip.ListView.Content, CONFIG);
});
