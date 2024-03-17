import { DB__MOON42 } from "../config";

export const createDBCollName = (name: string) => {
  return `${DB__MOON42}__${name}`;
};
