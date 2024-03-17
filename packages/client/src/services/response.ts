export type Response<T> = {
  status: boolean;
  version: "0.1.0";
  message: { code: number; text: string };
  data: T;
  error: string;
};
