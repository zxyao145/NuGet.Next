import { del, get, post, put } from "@/utils/fetch";

const prefix = "/api/v3/user-key";

export const CreateUserKey = () => {
  return post(prefix);
};

export const UserKeyList = () => {
  return get(`${prefix}`);
};

export const DeleteUserKey = (id: string) => {
  return del(prefix + "/" + id);
};

export const EnableUserKey = (id: string) => {
  return put(prefix + "/enable/" + id);
};
