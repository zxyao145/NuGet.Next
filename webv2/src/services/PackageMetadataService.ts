import { get } from "@/utils/fetch";

export const RegistrationIndex = (id: string) => {
  return get(`/v3/registration/${id}/index.json`);
};

export const RegistrationLeaf = (id: string, version: string) => {
  return get(`/v3/registration/${id}/${version}.json`);
};
