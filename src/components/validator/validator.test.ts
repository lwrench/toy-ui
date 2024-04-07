import { Schema } from './index';

const rules = {
  username: [
    {
      validator(_: any, value: string) {
        if (value === '' || value === undefined || value === null) {
          alert('请输入用户名');
          return false;
        }
      },
    },
  ],
  password: [
    {
      validator(_: any, value: string) {
        if (value === '' || value === undefined || value === null) {
          alert('请输入密码');
          return false;
        }
      },
    },
    {
      validator(value: string) {
        if (value.length < 6 || value.length > 18) {
          alert('密码长度必须大于6位小于18位');
          return false;
        }
      },
    },
  ],
};

const validator = new Schema(rules);

const handleSubmit = () => {
  if (validator.validate(['username', 'password'])) {
    alert('提交成功');
  } else {
    alert('提交失败');
  }
};

const handleUsernameBlur = () => {
  validator.validate(['username']);
};
const handlePasswordBlur = () => {
  validator.validate(['password']);
};
