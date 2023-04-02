//@@viewOn:imports
import { createVisualComponent, PropTypes, Lsi, useLsi, Utils } from "uu5g05";
import { Modal } from "uu5g05-elements";
import {
  Form,
  FormText,
  FormSelect,
  FormNumber,
  FormDate,
  FormTextArea,
  SubmitButton,
  CancelButton,
} from "uu5g05-forms";
import Config from "./config/config";
import importLsi from "../../../lsi/import-lsi";
import { UuDate } from "uu_i18ng01";

//@@viewOff:imports

//@@viewOn:css
const Css = {
  input: () =>
    Config.Css.css({
      marginBottom: "15px",
    }),
  footer: () => Config.Css.css({ display: "flex", justifyContent: "flex-end", gap: 10 }),
};
//@@viewOff:css

export const CreateModal = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "CreateModal",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    tripDataList: PropTypes.object.isRequired,
    locationDataList: PropTypes.object.isRequired,
    shown: PropTypes.bool,
    onSaveDone: PropTypes.func,
    onCancel: PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    shown: false,
    onSaveDone: () => {},
    onCancel: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    const { tripDataList, locationDataList } = props;

    const lsi = useLsi(importLsi, [CreateModal.uu5Tag]);

    async function handleSubmit(event) {
      try {
        const trip = await tripDataList.handlerMap.create(event.data.value);
        props.onSaveDone(trip);
      } catch (error) {
        CreateModal.logger.error("Error submitting form", error);
        throw new Utils.Error.Message(error.message, error);
      }
    }
    //TODO: LSI for messages
    const handleValidateDate = async (e) => {
      const minDate = new UuDate().format("en-US", { format: "YYYY-MM-DD" });
      const value = e.data.value;

      if (value < minDate) {
        return {
          message: {
            en: "The trip must start no earlier than today.",
            cs: "Výlet musí začínat nejdříve dnes.",
            uk: "Поїздка повинна починатися не раніше сьогодні.",
          },
          messageParams: [minDate],
        };
      }
    };

    const handleValidatePositiveNumber = async (e) => {
      const value = e.data.value;

      if (+value < 0) {
        return {
          message: { en: "The field must be positive.", cs: "Pole musí být kladné.", uk: "Поле має бути додатнім." },
        };
      }
    };
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Form.Provider onSubmit={handleSubmit}>
        <Modal
          header={lsi.header}
          open={props.shown}
          footer={
            <div className={Css.footer()}>
              <CancelButton onClick={props.onCancel}>{lsi.cancel}</CancelButton>
              <SubmitButton>{lsi.submit}</SubmitButton>
            </div>
          }
        >
          <Form.View>
            <FormText label={lsi.name} name="name" inputAttrs={{ maxLength: 255 }} className={Css.input()} required />
            <FormSelect
              label={lsi.location}
              name="locationId"
              itemList={mapLocationToItemList(locationDataList)}
              className={Css.input()}
              required
            />
            <FormNumber
              label={lsi.price}
              name="price"
              inputAttrs={{ maxLength: 255 }}
              className={Css.input()}
              onValidate={handleValidatePositiveNumber}
              required
            />
            <FormNumber
              label={lsi.freePlaces}
              name="freePlaces"
              className={Css.input()}
              onValidate={handleValidatePositiveNumber}
              required
            />
            <FormDate
              label={lsi.date}
              name="date"
              className={Css.input()}
              pickerType="horizontal"
              onValidate={handleValidateDate}
              required
            />
            <FormTextArea
              label={lsi.text}
              name="text"
              inputAttrs={{ maxLength: 5000 }}
              className={Css.input()}
              rows={10}
              required
              spellcheck
            />
          </Form.View>
        </Modal>
      </Form.Provider>
    );
    //@@viewOff:render
  },
});

function mapLocationToItemList(locationDataList) {
  return locationDataList.data.map((location) => ({ value: location.data.id, children: location.data.name }));
}

export default CreateModal;
