import { RootState } from "../app/store";

export const getAuthStateToken = async (state: unknown): Promise<{ token: string; address: string }> => {
  const { auth } = state as RootState;
  return { token: auth.token, address: auth.address };
};
