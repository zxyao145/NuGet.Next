import { useEffect, useState } from "react";
import { Select } from "antd";
import { getUser } from "@/services/UserService";
import { User } from "@/types/user";
import { Avatar } from "@lobehub/ui";
import { Flexbox } from "react-layout-kit";

const { Option } = Select;

interface UserSelectProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  // props传递给Select组件
  [key: string]: unknown;
  width?: string;
}

const UserSelect = ({ value, onChange, width, ...props }: UserSelectProps) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getUser(undefined, 1, 10000);
        setUsers(response.items);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Select
      {...props}
      value={value}
      onChange={(v) => {
        if (onChange) onChange(v);
      }}
      loading={loading}
      placeholder="选择用户"
      style={{ width: width }}
    >
      {users.map((user) => (
        <Option key={user.id} value={user.id}>
          <Flexbox horizontal>
            <Avatar shape="circle" animation={true} size={24} avatar={user.avatar} />
            <span
              style={{
                marginLeft: 8,
              }}
            >
              {user.fullName}
            </span>
          </Flexbox>
        </Option>
      ))}
    </Select>
  );
};

export default UserSelect;
