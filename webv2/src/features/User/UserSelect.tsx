import { useEffect, useState } from "react";
import { getUser } from "@/services/UserService";
import { User } from "@/types/user";
import { Avatar } from "@lobehub/ui";
import { Flexbox } from "react-layout-kit";

import {
  Select,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";

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
  if (loading) {
    return (
      <div>
        <Spinner /> 加载中...
      </div>
    );
  }

  return (
    <Select
      {...props}
      // value={value}
      onValueChange={(v) => {
        if (onChange) onChange(Array.isArray(v) ? v : [v]);
      }}
    >
      <SelectTrigger className={`w-[${width}px]`}>
        <SelectValue placeholder="选择用户" />
      </SelectTrigger>
      <SelectGroup>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id}>
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
          </SelectItem>
        ))}
      </SelectGroup>
    </Select>
  );
};

export default UserSelect;
