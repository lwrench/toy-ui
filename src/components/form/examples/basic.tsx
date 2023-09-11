import React from 'react';
import { Form } from '@lwrench/toy-ui';
import { Input } from 'antd';

const { Item } = Form;
export default function App() {
  return (
    <div>
      <Form>
        <Item>
          <Input />
        </Item>
      </Form>
    </div>
  );
}
