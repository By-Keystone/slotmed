import { config } from "@/config";

export const useHasFeatures = () => {
  const env = process.env.NODE_ENV;

  return config[env];
};
