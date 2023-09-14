import React, { useEffect } from 'react';
import { Form } from '@lwrench/toy-ui';

function Input({ onChange, value }: Record<string, any>) {
  return (
    <input className="input" onChange={(e) => onChange && onChange(e.target.value)} value={value} />
  );
}

const { Item } = Form;
export default function App() {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("form.getFieldValue('input')", form.getFieldValue('input'));
    form.getFieldValue('input');
  }, []);

  return (
    <div>
      <Form form={form} onChange={(v, vs) => console.log('onchange', v, vs)}>
        <Item field="user.name" label="Name">
          <Input />
        </Item>
        <Item field="user.email" label="Email">
          <Input />
        </Item>
        <Item field="password" label="Password">
          <Input />
        </Item>
      </Form>
    </div>
  );
}
