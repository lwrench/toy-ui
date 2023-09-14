import Form from './form';
import Item from './item';
import useForm from './useForm';

type FormType = typeof Form;

export interface FormComponent extends FormType {
  Item: typeof Item;
  useForm: typeof useForm;
}

const FormComp: FormComponent = Form as FormComponent;
FormComp.Item = Item;
FormComp.useForm = useForm;

export default FormComp;
