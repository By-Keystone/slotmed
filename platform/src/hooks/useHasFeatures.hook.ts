import { getSettings } from "@/lib/utils";

export const useHasFeatures = () => {
  return getSettings();
};
