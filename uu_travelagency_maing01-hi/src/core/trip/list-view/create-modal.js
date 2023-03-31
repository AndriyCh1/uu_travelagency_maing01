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

    function handleValidate(event) {
      const formData = event.data.value;

      // if (new Date(formData.date) < new Date()) {
      //   return {
      //     message: {
      //       en: "Trip date cannot be in the past.",
      //     },
      //   };
      // }
    }
    //@@viewOff:private

    //@@viewOn:render
    return (
      <Form.Provider onSubmit={handleSubmit} onValidate={handleValidate}>
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
              required
            />
            <FormNumber
              label={lsi.freePlaces}
              name="freePlaces"
              inputAttrs={{ maxLength: 10 }}
              className={Css.input()}
              required
            />
            <FormDate label={lsi.date} name="date" className={Css.input()} pickerType="horizontal" required />

            <FormTextArea
              label={lsi.text}
              name="text"
              inputAttrs={{ maxLength: 5000 }}
              className={Css.input()}
              rows={10}
              required
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
