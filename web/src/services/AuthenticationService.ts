import { postJson } from "@/utils/fetch";

export const Authenticate = (input: unknown) => {
  return postJson("api/v2/authenticate", input);
};
