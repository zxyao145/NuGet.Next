import { postJson } from "@/utils/fetch";

export const Authenticate = (input: any) => {
  return postJson("api/v2/authenticate", input);
};
