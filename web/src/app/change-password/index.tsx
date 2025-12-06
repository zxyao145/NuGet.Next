import { memo, useState } from "react";
import { Form, Input, Button, message } from "antd";
import { LockOutlined } from "@ant-design/icons";
import { updatePassword } from "@/services/UserService";

const ChangePassword = memo(() => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: unknown) => {
    setLoading(true);
    try {
      const res = await updatePassword(values);

      if (res.success) {
        message.success("密码更新成功");
      } else {
        message.error(res.message);
      }
    } catch (error) {
      console.error(error);
      message.error("密码更新失败,请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "0 auto" }}>
      <h2>更改密码</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item name="currentPassword" rules={[{ required: true, message: "请输入当前密码" }]}>
          <Input.Password prefix={<LockOutlined />} placeholder="当前密码" />
        </Form.Item>
        <Form.Item
          name="newPassword"
          rules={[
            { required: true, message: "请输入新密码" },
            { min: 8, message: "密码长度至少为8位" },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="新密码" />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          dependencies={["newPassword"]}
          rules={[
            { required: true, message: "请确认新密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入的密码不一致"));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="确认新密码" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            更新密码
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
});

ChangePassword.displayName = "ChangePassword";

export default ChangePassword;
