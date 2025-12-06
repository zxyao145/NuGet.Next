import { get } from "@/utils/fetch";

export const getPanelData = () => {
  return get("/api/v3/panel");
};
